// Syndica Bank: the bank's accounts and its ledger

List<Entry> ledger = new ArrayList<>();
Map<String, Account> accounts = new HashMap<>();

void main() {
    Account ana = open("Ana", AccountType.SAVINGS, "120.50");
    open("Ben", AccountType.CHECKING, "80.00");
    open("Chen", AccountType.SAVINGS, "2500.00");
    post(ana, "2026-10-01", new Transaction.Deposit(Money.eur("25.10")));
    post(ana, "2026-10-02", new Transaction.Withdrawal(Money.eur("40.00")));
    post(ana, "2026-10-03", new Transaction.Deposit(Money.eur("12.99")));

    Page<Entry> statement = Page.of(ledger, 2, 2);
    IO.println("page " + statement.number() + " of " + statement.pages());
    for (Entry e : statement.items()) {
        IO.println("  " + e.on() + " " + e.tx());
    }
    Page<Account> list = Page.of(new ArrayList<>(accounts.values()), 2, 1);
    for (Account a : list.items()) {
        IO.println("  " + a.number() + " " + a.holder());
    }
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
