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

    // a business client deposits 15 million, twice, counted in cents
    int deposit = 1_500_000_000;
    int total = deposit + deposit;
    long counted = (long) deposit + deposit;
    IO.println("Two deposits, as an int:  " + total);
    IO.println("Two deposits, as a long:  " + counted);
}
