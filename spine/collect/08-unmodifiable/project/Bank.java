// Syndica Bank: the bank's accounts and its ledger

List<Entry> ledger = new ArrayList<>();
Map<String, Account> accounts = new HashMap<>();

void main() {
    Account ana = open("Ana", AccountType.SAVINGS, "120.50");
    Account ben = open("Ben", AccountType.CHECKING, "80.00");
    post(ana, "2026-10-01", new Transaction.Deposit(Money.eur("25.10")));
    post(ben, "2026-10-01", new Transaction.Withdrawal(Money.eur("15.00")));
    post(ana, "2026-10-02", new Transaction.Withdrawal(Money.eur("40.00")));

    List<Entry> mine = statement("SB-0001");
    IO.println("Ana's statement: " + mine.size() + " entries");
    ledger.clear();
    IO.println("after the ledger is cleared: " + mine.size() + " entries");
    mine.add(new Entry(LocalDate.parse("2026-10-09"), "SB-0001",
            new Transaction.Deposit(Money.eur("1000000.00"))));
}

// A copy of one account's entries that nobody, the caller included, can change.
List<Entry> statement(String number) {
    List<Entry> found = new ArrayList<>();
    for (Entry e : ledger) {
        if (e.account().equals(number)) {
            found.add(e);
        }
    }
    return List.copyOf(found);
}

Account open(String holder, AccountType type, String opening) {
    Account a = new Account(holder, type, Money.eur(opening));
    accounts.put(a.number(), a);
    return a;
}

void post(Account a, String day, Transaction t) {
    try {
        a.apply(t);
        ledger.add(new Entry(LocalDate.parse(day), a.number(), t));
    } catch (InsufficientFundsException e) {
        IO.println("declined: " + e.getMessage());
    }
}
