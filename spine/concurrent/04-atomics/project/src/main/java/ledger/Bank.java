package ledger;

import module java.base;

import ledger.model.Account;
import ledger.model.AccountType;
import ledger.model.Entry;
import ledger.model.InsufficientFundsException;
import ledger.model.Money;
import ledger.model.Transaction;
import ledger.store.Journal;
import ledger.store.StatementImport;

// Syndica Bank: the bank's accounts, its ledger and its journal.
class Bank {
    // The audit log: every posted and declined transaction, by level.
    static final System.Logger AUDIT = System.getLogger("ledger.audit");
    // Where the books are kept: a day is a day in Berlin.
    final ZoneId BANK_ZONE = ZoneId.of("Europe/Berlin");

    List<Entry> ledger = new ArrayList<>();
    Map<String, Account> accounts = new HashMap<>();
    Journal journal;

    void main() throws IOException {
        // One line per record: level, logger, message (and no timestamp).
        System.setProperty("java.util.logging.SimpleFormatter.format",
                "%4$-7s %3$s: %5$s%n");
        try (Journal j = new Journal(Path.of("data", "journal.csv"))) {
            journal = j;
            run();
        }
    }

    void run() throws IOException {
        Account ana = open("Ana", AccountType.SAVINGS);
        Account ben = open("Ben", AccountType.CHECKING);

        List<Entry> saved = journal.readAll();
        for (Entry e : saved) {
            replay(e);
        }
        if (saved.isEmpty()) {
            IO.println("a new journal: posting the opening day");
            post(ana, "2026-10-01", deposit("1200.00"));
            post(ben, "2026-10-01", deposit("300.00"));
            post(ana, "2026-10-02", withdrawal("80.00"));
            post(ben, "2026-10-03", withdrawal("500.00"));
            Path file = Path.of("data", "import", "statement-2026-10.csv");
            var statement = new StatementImport(file, accounts.keySet());
            for (Entry e : statement.accepted) {
                post(accounts.get(e.account()), e.on().toString(), e.tx());
            }
            payInterest(YearMonth.of(2026, 10));
        } else {
            IO.println("replayed " + saved.size() + " journal entries");
        }
        IO.println("Ana " + ana.balance() + ", Ben " + ben.balance());
    }

    // Interest is paid on the month's last day, whatever its length.
    void payInterest(YearMonth month) throws IOException {
        LocalDate day = month.atEndOfMonth();
        for (Account a : accounts.values()) {
            Money due = a.interestDue();
            if (due.amount().signum() > 0) {
                post(a, day.toString(), new Transaction.Deposit(due));
                IO.println("interest " + day + ": " + a.number() + " +" + due);
            }
        }
    }

    // A journal entry: apply it again, but do not write it twice.
    void replay(Entry e) {
        try {
            accounts.get(e.account()).apply(e.tx());
            ledger.add(e);
            AUDIT.log(System.Logger.Level.DEBUG, "replayed {0}", e.toCsv());
        } catch (InsufficientFundsException ex) {
            throw new IllegalStateException("cannot replay " + e, ex);
        }
    }

    Account open(String holder, AccountType type) {
        Account a = new Account(holder, type);
        accounts.put(a.number(), a);
        return a;
    }

    Transaction deposit(String amount) {
        return new Transaction.Deposit(Money.eur(amount));
    }

    Transaction withdrawal(String amount) {
        return new Transaction.Withdrawal(Money.eur(amount));
    }

    void post(Account a, String day, Transaction t) throws IOException {
        try {
            a.apply(t);
            Entry e = new Entry(LocalDate.parse(day), a.number(), t);
            ledger.add(e);
            journal.append(e);
            AUDIT.log(System.Logger.Level.INFO, "posted {0}", e.toCsv());
        } catch (InsufficientFundsException ex) {
            AUDIT.log(System.Logger.Level.WARNING, "declined {0}: {1}",
                    a.number(), ex.getMessage());
        }
    }
}
