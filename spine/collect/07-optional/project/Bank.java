// Syndica Bank: the bank's accounts and its ledger

List<Entry> ledger = new ArrayList<>();
Map<String, Account> accounts = new HashMap<>();

void main() {
    open("Ana", AccountType.SAVINGS, "120.50");
    open("Ben", AccountType.CHECKING, "80.00");

    for (String number : new String[] { "SB-0002", "SB-0009" }) {
        Optional<Account> found = find(number);
        if (found.isPresent()) {
            IO.println(number + ": " + found.get().holder());
        } else {
            IO.println(number + ": no such account");
        }
    }
    IO.println(find("SB-0001").orElseThrow().balance());
    IO.println(find("SB-0009"));
    IO.println(find("SB-0009").orElseThrow().balance());
}

Optional<Account> find(String number) {
    return Optional.ofNullable(accounts.get(number));
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
