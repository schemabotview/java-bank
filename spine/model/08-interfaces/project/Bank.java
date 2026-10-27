// Syndica Bank: main tries out the bank's types

void main() {
    Account ana = new Account("Ana", AccountType.SAVINGS, Money.eur("1000.00"));
    Account ben = new Account("Ben", AccountType.SAVINGS, Money.eur("1000.00"));
    ben.earnWith(new Promotion(new BigDecimal("0.03"), 2, AccountType.SAVINGS));

    for (int month = 1; month <= 3; month++) {
        Money a = ana.payInterest();
        Money b = ben.payInterest();
        IO.println("month " + month + ": Ana +" + a + ", Ben +" + b);
    }
    IO.println("Ana " + ana.balance() + ", Ben " + ben.balance());
}
