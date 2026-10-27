// Month-end interest for 1000 accounts: 1000 tasks, a pool of 4 workers.
import ledger.model.*;

void main() throws Exception {
    List<Account> accounts = new ArrayList<>();
    for (int i = 0; i < 1000; i++) {
        accounts.add(new Account("holder " + i, AccountType.SAVINGS,
                Money.eur("1000.00")));
    }
    try (ExecutorService pool = Executors.newFixedThreadPool(4)) {
        List<Future<Money>> due = new ArrayList<>();
        for (Account a : accounts) {
            due.add(pool.submit(() -> a.interestDue()));   // a Callable
        }
        Money total = Money.eur("0");
        for (Future<Money> f : due) {
            total = total.plus(f.get());       // waits until it is done
        }
        IO.println(due.size() + " tasks, 4 workers: interest " + total);
    }
}
