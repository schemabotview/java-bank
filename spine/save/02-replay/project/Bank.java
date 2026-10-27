// Syndica Bank: the bank's accounts, its ledger and its journal

List<Entry> ledger = new ArrayList<>();
Map<String, Account> accounts = new HashMap<>();
Journal journal;

void main() throws IOException {
    journal = new Journal(Path.of("data", "journal.csv"));
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
    IO.println("Ana " + ana.balance() + ", Ben " + ben.balance());
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
