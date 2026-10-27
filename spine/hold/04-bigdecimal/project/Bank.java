// Syndica Bank: the ledger's first file

void main() {
    String bank = "Syndica Bank";
    String holder = "Ana";
    int accounts = 1;
    BigDecimal balance = new BigDecimal("120.50");
    BigDecimal rate = new BigDecimal("0.015");
    BigDecimal interest = balance.multiply(rate);

    IO.println(bank + ": open, " + accounts + " account");
    IO.println(holder + "'s balance: " + balance);
    IO.println("Interest this month: " + interest);
    IO.println("In cents: " + interest.setScale(2, RoundingMode.HALF_EVEN));
}
