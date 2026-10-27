// Syndica Bank: the ledger's first file

void main() {
    String bank = "Syndica Bank";
    String holder = "Ana";
    String account = "SB-0001";
    BigDecimal balance = new BigDecimal("120.50");
    BigDecimal rate = new BigDecimal("0.015");
    BigDecimal interest = balance.multiply(rate)
            .setScale(2, RoundingMode.HALF_EVEN);

    IO.println(bank + ": open");
    IO.println("%s, account %s".formatted(holder.toUpperCase(), account));
    IO.println("Balance: " + balance + ", interest: " + interest);
}
