// Syndica Bank: main tries out the bank's types

void main() {
    Account ana = new Account("Ana", AccountType.SAVINGS, Money.eur("120.50"));
    Account twin = new Account("Ana", AccountType.SAVINGS, Money.eur("120.50"));
    IO.println(ana.number() + " and " + twin.number());
    IO.println("same account? " + ana.equals(twin));

    Set<Money> amounts = new HashSet<>();
    amounts.add(Money.eur("10.00"));
    amounts.add(Money.eur("10"));
    amounts.add(Money.eur("25.10"));
    IO.println("distinct amounts: " + amounts.size());
}
