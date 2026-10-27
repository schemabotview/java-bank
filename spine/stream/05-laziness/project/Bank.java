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

    Predicate<Entry> large = e -> e.tx() instanceof Transaction.Withdrawal w
            && !Money.eur("1000.00").isMoreThan(w.amount());

    Stream<Entry> checked = ledger.stream()
            .peek(e -> IO.println("  checking " + e.on() + " " + e.tx()));
    IO.println("built the stream; nothing checked yet");
    boolean any = checked.anyMatch(large);
    IO.println("any large withdrawal? " + any);
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
