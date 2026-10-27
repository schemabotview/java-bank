// Syndica Bank: the ledger's first file

void main() {
    String holder = "Ana";
    BigDecimal balance = new BigDecimal("120.50");
    BigDecimal[] asked = { new BigDecimal("200.00"), new BigDecimal("40.00") };

    IO.println(holder + "'s balance: " + balance);
    BigDecimal withdrawal = asked[0];
    if (withdrawal.compareTo(balance) > 0) {
        IO.println("Refused: " + withdrawal + " is more than " + balance);
    } else {
        balance = balance.subtract(withdrawal);
        IO.println("Paid out " + withdrawal + ", balance " + balance);
    }
    withdrawal = asked[1];
    if (withdrawal.compareTo(balance) > 0) {
        IO.println("Refused: " + withdrawal + " is more than " + balance);
    } else {
        balance = balance.subtract(withdrawal);
        IO.println("Paid out " + withdrawal + ", balance " + balance);
    }
}
