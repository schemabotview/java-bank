// Syndica Bank: the ledger's first file

void main() {
    String holder = "Ana";
    BigDecimal balance = new BigDecimal("120.50");
    BigDecimal rate = new BigDecimal("0.015");      // per month
    int months = 12;

    // a year of simple interest: balance × rate × months, then cents
    BigDecimal yearly = balance.multiply(rate)
            .multiply(BigDecimal.valueOf(months))
            .setScale(2, RoundingMode.HALF_EVEN);
    IO.println(holder + "'s balance: " + balance);
    IO.println("A year of interest: " + yearly);
}
