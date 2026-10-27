// Syndica Bank: main tries out the bank's types

void main() {
    Account ana = new Account("Ana", AccountType.CHECKING, Money.eur("120.50"));
    List<Transaction> today = List.of(
            new Transaction.Deposit(Money.eur("25.10")),
            new Transaction.Withdrawal(Money.eur("40.00")),
            new Transaction.Transfer("SB-0002", Money.eur("30.00")));

    for (Transaction t : today) {
        ana.apply(t);
        IO.println(t + " -> " + ana.balance());
    }
}
