// 10000 card payments, each waiting 10 ms on the card network.
import ledger.model.*;

void main() throws Exception {
    var platform = Executors.newFixedThreadPool(200);
    IO.println("platform pool of 200: " + time(platform));
    var virtual = Executors.newVirtualThreadPerTaskExecutor();
    IO.println("virtual threads:      " + time(virtual));
}

String time(ExecutorService executor) throws Exception {
    var shop = new Account("Shop", AccountType.CHECKING);
    long start = System.nanoTime();
    try (executor) {
        for (int i = 0; i < 10_000; i++) {
            executor.submit(() -> {
                Thread.sleep(10);                 // the network: just waiting
                shop.deposit(Money.eur("1.00"));
                return null;
            });
        }
    }                                   // close() waits for every task
    long ms = (System.nanoTime() - start) / 1_000_000;
    return shop.balance() + " in about " + ms + " ms";
}
