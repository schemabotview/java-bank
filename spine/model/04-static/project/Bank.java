// Syndica Bank: main tries out the bank's types

void main() {
    Account ana = new Account("Ana", new BigDecimal("120.50"));
    Account ben = new Account("Ben");
    Account chen = new Account("Chen", new BigDecimal("2500.00"));

    for (Account a : new Account[] { ana, ben, chen }) {
        IO.println(a.number() + "  " + a.holder() + ": " + a.balance());
    }
    IO.println("Accounts opened: " + Account.opened());
}
