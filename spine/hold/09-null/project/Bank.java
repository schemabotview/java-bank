// Syndica Bank: the ledger's first file

String note;    // a note on the account: none written yet

void main() {
    String bank = "Syndica Bank";
    String holder = "Ana";
    String account = "SB-0001";
    BigDecimal balance = new BigDecimal("120.50");
    BigDecimal rate = new BigDecimal("0.015");
    BigDecimal interest = balance.multiply(rate)
            .setScale(2, RoundingMode.HALF_EVEN);

    String header = """
            %s
            Statement for %s, account %s
            ----------------------------""".formatted(bank, holder, account);
    IO.println(header);
    IO.println("Balance: " + balance + ", interest: " + interest);

    BigDecimal[] today = {
        new BigDecimal("25.10"),     // a deposit
        new BigDecimal("-40.00"),    // a withdrawal
        new BigDecimal("12.99"),     // a refund
    };
    BigDecimal closing = balance.add(today[0]).add(today[1]).add(today[2]);
    IO.println(today);
    IO.println(Arrays.toString(today) + ": " + today.length + " transactions");
    IO.println("Closing balance: " + closing);
    IO.println("Note: " + note);
    IO.println("Note length: " + note.length());
}
