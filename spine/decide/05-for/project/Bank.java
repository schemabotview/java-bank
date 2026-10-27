// Syndica Bank: the ledger's first file

void main() {
    String holder = "Ana";
    BigDecimal balance = new BigDecimal("120.50");
    BigDecimal[] today = {
        new BigDecimal("25.10"),     // a deposit
        new BigDecimal("-40.00"),    // a withdrawal
        new BigDecimal("12.99"),     // a refund
        new BigDecimal("-7.25"),     // a card payment
    };

    IO.println(holder + ", opening balance " + balance);
    for (BigDecimal amount : today) {
        balance = balance.add(amount);
        IO.println("%8s  →  %s".formatted(amount, balance));
    }
    IO.println("Newest first:");
    for (int i = today.length - 1; i >= 0; i--) {
        IO.println("  " + (i + 1) + ". " + today[i]);
    }
}
