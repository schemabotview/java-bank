// Syndica Bank: main tries out the bank's types

void main() {
    var ana = new Account("Ana", AccountType.SAVINGS, new BigDecimal("120.50"));
    var ben = new Account("Ben", AccountType.CHECKING, new BigDecimal("80.00"));

    for (AccountType t : AccountType.values()) {
        IO.println(t + ": fee " + t.monthlyFee() + ", rate " + t.monthlyRate());
    }
    for (Account a : new Account[] { ana, ben }) {
        String perk = switch (a.type()) {
            case CHECKING -> "a debit card";
            case SAVINGS -> "monthly interest";
        };
        IO.println(a.holder() + ", " + a.type() + ": " + perk);
    }
    IO.println(AccountType.valueOf("SAVINGS").ordinal());
    IO.println(AccountType.valueOf("PREMIUM"));
}
