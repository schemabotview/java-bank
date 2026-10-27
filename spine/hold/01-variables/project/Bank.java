// Syndica Bank: the ledger's first file

void main() {
    String bank = "Syndica Bank";
    String holder = "Ana";
    int accounts = 1;
    double balance = 120.50;
    var rate = 0.015;

    IO.println(bank + ": open, " + accounts + " account");
    IO.println(holder + "'s balance: " + balance);
    IO.println("Interest this month: " + balance * rate);
}
