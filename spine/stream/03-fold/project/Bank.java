// Syndica Bank: the bank's accounts and its ledger

List<Entry> ledger = new ArrayList<>();
Map<String, Account> accounts = new HashMap<>();

void main() {
    Account ana = open("Ana", AccountType.SAVINGS);
    Account ben = open("Ben", AccountType.CHECKING);
    post(ana, "2026-09-01", deposit("1200.00"));
    post(ben, "2026-09-01", deposit("300.00"));
    post(ana, "2026-09-14", withdrawal("80.00"));
    post(ana, "2026-10-01", deposit("2500.00"));
    post(ana, "2026-10-03", withdrawal("1500.00"));
    post(ben, "2026-10-05", withdrawal("120.00"));
    post(ben, "2026-10-09", deposit("64.20"));

    for (Account a : List.of(ana, ben)) {
        Money folded = ledger.stream()
                .filter(e -> e.account().equals(a.number()))
                .map(e -> signed(e.tx()))
                .reduce(Money.eur("0"), Money::plus);
        IO.println(a.number() + " kept: " + a.balance()
                + ", folded: " + folded);
    }
    long deposits = ledger.stream()
            .filter(e -> e.tx() instanceof Transaction.Deposit)
            .count();
    IO.println(deposits + " deposits of " + ledger.size() + " entries");
}

// What a transaction does to its account's balance: in is plus, out is minus.
Money signed(Transaction t) {
    Money zero = Money.eur("0");
    return switch (t) {
        case Transaction.Deposit d -> d.amount();
        case Transaction.Withdrawal w -> zero.minus(w.amount());
        case Transaction.Transfer x -> zero.minus(x.amount());
    };
}

Account open(String holder, AccountType type) {
    Account a = new Account(holder, type);
    accounts.put(a.number(), a);
    return a;
}

Transaction deposit(String amount) {
    return new Transaction.Deposit(Money.eur(amount));
}

Transaction withdrawal(String amount) {
    return new Transaction.Withdrawal(Money.eur(amount));
}

void post(Account a, String day, Transaction t) {
    try {
        a.apply(t);
        ledger.add(new Entry(LocalDate.parse(day), a.number(), t));
    } catch (InsufficientFundsException e) {
        IO.println("declined: " + e.getMessage());
    }
}
