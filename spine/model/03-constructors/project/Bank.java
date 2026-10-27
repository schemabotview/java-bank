// Syndica Bank: main tries out the bank's types

void main() {
    Account ana = new Account("Ana", new BigDecimal("120.50"));
    Account ben = new Account("Ben");
    IO.println(ana.holder() + ": " + ana.balance());
    IO.println(ben.holder() + ": " + ben.balance());

    try {
        new Account("Chen", new BigDecimal("-50.00"));
    } catch (IllegalArgumentException e) {
        IO.println("refused: " + e.getMessage());
    }
    try {
        new Account("  ");
    } catch (IllegalArgumentException e) {
        IO.println("refused: " + e.getMessage());
    }
}
