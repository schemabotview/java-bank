// A hundred tellers, a thousand deposits of one cent each: 1000.00 in all.
import ledger.model.*;

void main() throws InterruptedException {
    Account ana = new Account("Ana", AccountType.CHECKING, Money.eur("0"));
    List<Thread> tellers = new ArrayList<>();
    for (int i = 1; i <= 100; i++) {
        Thread t = new Thread(() -> {
            for (int n = 0; n < 1000; n++) {
                ana.deposit(Money.eur("0.01"));
            }
        });
        tellers.add(t);
        t.start();
    }
    for (Thread t : tellers) {
        t.join();
    }
    IO.println("deposited 100000 × 0.01 EUR = 1000.00 EUR");
    IO.println("balance   " + ana.balance());
}
