// Syndica Bank: the bank's accounts and its ledger

List<Entry> ledger = new ArrayList<>();
Map<String, Account> accounts = new HashMap<>();

void main() {
    Account ana = open("Ana", AccountType.SAVINGS, "120.50");
    Account ben = open("Ben", AccountType.CHECKING, "80.00");
    post(ana, "2026-10-03", new Transaction.Deposit(Money.eur("12.99")));
    post(ben, "2026-10-01", new Transaction.Withdrawal(Money.eur("15.00")));
    post(ana, "2026-10-03", new Transaction.Withdrawal(Money.eur("40.00")));
    post(ana, "2026-10-01", new Transaction.Deposit(Money.eur("25.10")));

    IO.println("as posted:");
    for (Entry e : ledger) {
        IO.println("  " + e.on() + " " + e.account() + " " + e.tx().amount());
    }
    Collections.sort(ledger);
    IO.println("sorted:");
    for (Entry e : ledger) {
        IO.println("  " + e.on() + " " + e.account() + " " + e.tx().amount());
    }
}

Account open(String holder, AccountType type, String opening) {
    Account a = new Account(holder, type, Money.eur(opening));
    accounts.put(a.number(), a);
    return a;
}

void post(Account a, String day, Transaction t) {
    try {
        a.apply(t);
        ledger.add(new Entry(LocalDate.parse(day), a.number(), t));
    } catch (InsufficientFundsException e) {
        IO.println("declined: " + e.getMessage());
    }
}
