// Syndica Bank: the bank's accounts and its ledger

List<Entry> ledger = new ArrayList<>();

void main() {
    Account ana = new Account("Ana", AccountType.SAVINGS, Money.eur("120.50"));
    post(ana, "2026-10-01", new Transaction.Deposit(Money.eur("25.10")));
    post(ana, "2026-10-02", new Transaction.Withdrawal(Money.eur("40.00")));
    post(ana, "2026-10-03", new Transaction.Withdrawal(Money.eur("500.00")));
    post(ana, "2026-10-03", new Transaction.Deposit(Money.eur("12.99")));

    IO.println("ledger: " + ledger.size() + " entries");
    IO.println("first:  " + ledger.get(0));
    IO.println("last:   " + ledger.getLast());
    IO.println(ana.number() + ": " + ana.balance());
}

void post(Account a, String day, Transaction t) {
    try {
        a.apply(t);
        ledger.add(new Entry(LocalDate.parse(day), a.number(), t));
    } catch (InsufficientFundsException e) {
        IO.println("declined: " + e.getMessage());
    }
}
