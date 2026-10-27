// Syndica Bank: the ledger's first file

void main() {
    BigDecimal balance = new BigDecimal("120.50");
    IO.println("Syndica Bank: teller ready");

    while (true) {
        String line = IO.readln("teller> ").strip();
        if (line.equals("quit")) {
            break;
        } else if (line.equals("balance")) {
            IO.println("balance: " + balance);
        } else if (line.startsWith("deposit ")) {
            balance = balance.add(new BigDecimal(line.substring(8)));
            IO.println("balance: " + balance);
        } else {
            IO.println("unknown command: " + line);
        }
    }
    IO.println("teller closed");
}
