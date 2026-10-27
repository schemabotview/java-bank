// Syndica Bank: the ledger's first file

void main() {
    BigDecimal balance = new BigDecimal("120.50");
    IO.println("Syndica Bank: teller ready");

    while (true) {
        String[] words = IO.readln("teller> ").strip().split(" ");
        try {
            switch (words[0]) {
                case "quit" -> { IO.println("teller closed"); return; }
                case "balance" -> IO.println("balance: " + balance);
                case "deposit" -> balance = deposit(balance, money(words[1]));
                case "withdraw" -> balance = withdraw(balance, money(words[1]));
                case "fee" -> balance = chargeFee(balance, money("2.00"));
                default -> IO.println("unknown command: " + words[0]);
            }
        } catch (NumberFormatException e) {
            IO.println("not an amount: " + words[1]);
        }
    }
}

BigDecimal money(String text) {
    return new BigDecimal(text);
}

BigDecimal deposit(BigDecimal balance, BigDecimal amount) {
    BigDecimal after = balance.add(amount);
    IO.println("deposited " + amount + ", balance " + after);
    return after;
}

BigDecimal withdraw(BigDecimal balance, BigDecimal amount) {
    if (amount.compareTo(balance) > 0) {
        IO.println("refused: " + amount + " is more than " + balance);
        return balance;
    }
    BigDecimal after = balance.subtract(amount);
    IO.println("paid out " + amount + ", balance " + after);
    return after;
}

BigDecimal chargeFee(BigDecimal balance, BigDecimal fee) {
    BigDecimal after = balance.subtract(fee);
    IO.println("charged " + fee + ", balance " + after);
    return after;
}
