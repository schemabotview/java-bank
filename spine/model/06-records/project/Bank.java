// Syndica Bank: main tries out the bank's types

void main() {
    Account ana = new Account("Ana", AccountType.SAVINGS, Money.eur("120.50"));
    Account ben = new Account("Ben", AccountType.CHECKING);
    ana.payInterest();
    IO.println(ana.holder() + ": " + ana.balance());
    IO.println(ben.holder() + ": " + ben.balance());

    Money a = Money.eur("10.00");
    Money b = Money.eur("10");
    IO.println(a + " equals " + b + "? " + a.equals(b));
    IO.println(new Money(new BigDecimal("2.50"), Money.EUR).amount());
    IO.println(Money.eur("0.001"));
}
