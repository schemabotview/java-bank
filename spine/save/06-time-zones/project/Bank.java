// Syndica Bank: the bank's accounts, its ledger and its journal

// Where the books are kept: a day is a day in Berlin.
final ZoneId BANK_ZONE = ZoneId.of("Europe/Berlin");

List<Entry> ledger = new ArrayList<>();
Map<String, Account> accounts = new HashMap<>();
Journal journal;

void main() throws IOException {
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
    } else {
        IO.println("replayed " + saved.size() + " entries from the journal");
    }

    Path file = Path.of("data", "import", "statement-2026-10.csv");
    StatementImport statement = new StatementImport(file, accounts.keySet());
    for (Entry e : statement.accepted) {
        post(accounts.get(e.account()), e.on().toString(), e.tx());
    }
    payInterest(YearMonth.of(2026, 10));

    // Ana pays by card in New York, late on the last evening of October.
    ZonedDateTime paid = ZonedDateTime.of(2026, 10, 31, 23, 30, 0, 0,
            ZoneId.of("America/New_York"));
    Instant at = paid.toInstant();
    LocalDate booked = LocalDate.ofInstant(at, BANK_ZONE);
    post(ana, booked.toString(), withdrawal("42.00"));
    IO.println("paid   " + paid);
    IO.println("at     " + at);
    IO.println("booked " + booked + " (" + BANK_ZONE + ")");
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

// An entry already in the journal: apply it again, but do not write it twice.
void replay(Entry e) {
    try {
        accounts.get(e.account()).apply(e.tx());
        ledger.add(e);
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
    } catch (InsufficientFundsException ex) {
        IO.println("declined: " + ex.getMessage());
    }
}
