// Syndica Bank: main tries out the bank's types

void main() {
    Account ana = new Account();
    ana.holder = "Ana";
    ana.balance = new BigDecimal("120.50");

    Account ben = new Account();
    ben.holder = "Ben";
    ben.balance = new BigDecimal("80.00");

    ana.deposit(new BigDecimal("25.10"));
    IO.println(ana.holder + ": " + ana.balance);
    IO.println(ben.holder + ": " + ben.balance);

    ben.balance = ben.balance.subtract(new BigDecimal("500.00"));
    IO.println(ben.holder + ", after a direct write: " + ben.balance);
}
