// Syndica Bank: the bank's accounts and its ledger

List<Entry> ledger = new ArrayList<>();
Map<String, Account> accounts = new HashMap<>();

void main() {
    open("Ana", AccountType.SAVINGS, "120.50");
    open("Ben", AccountType.CHECKING, "80.00");
    open("Chen", AccountType.SAVINGS, "2500.00");

    Account ben = accounts.get("SB-0002");
    post(ben, "2026-10-01", new Transaction.Deposit(Money.eur("19.99")));
    IO.println(ben.holder() + ": " + ben.balance());
    IO.println("SB-0009: " + accounts.get("SB-0009"));
    IO.println(accounts.size() + " accounts: " + accounts.keySet());
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
