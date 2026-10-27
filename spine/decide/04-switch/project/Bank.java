// Syndica Bank: the ledger's first file

void main() {
    String holder = "Ana";
    BigDecimal balance = new BigDecimal("120.50");
    String type = "checking";

    BigDecimal fee = switch (type) {
        case "checking" -> new BigDecimal("2.00");
        case "savings" -> BigDecimal.ZERO;
        case "business", "corporate" -> new BigDecimal("9.50");
        default -> throw new IllegalStateException("no such type: " + type);
    };
    balance = balance.subtract(fee);
    IO.println(holder + ", " + type + " account");
    IO.println("Monthly fee " + fee + ", balance " + balance);
}
