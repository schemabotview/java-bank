// Syndica Bank: main tries out the bank's types

void main() {
    Account ana = new Account("Ana", AccountType.CHECKING, Money.eur("120.50"));
    List<Transaction> today = List.of(
            new Transaction.Withdrawal(Money.eur("40.00")),
            new Transaction.Transfer("SB-0002", Money.eur("500.00")),
            new Transaction.Deposit(Money.eur("25.10")));

    for (Transaction t : today) {
        try {
            ana.apply(t);
            IO.println("done: " + t + " -> " + ana.balance());
        } catch (InsufficientFundsException e) {
            IO.println("declined: " + e.getMessage());
        }
    }
}
