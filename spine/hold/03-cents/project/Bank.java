// Syndica Bank: the ledger's first file

void main() {
    String bank = "Syndica Bank";
    String holder = "Ana";
    int accounts = 1;
    long balanceCents = 12050;     // 120.50, as whole cents
    long ratePerThousand = 15;     // 1.5%

    IO.println(bank + ": open, " + accounts + " account");
    IO.println(holder + "'s balance in cents: " + balanceCents);
    IO.println("Interest in cents: " + balanceCents * ratePerThousand / 1000);
}
