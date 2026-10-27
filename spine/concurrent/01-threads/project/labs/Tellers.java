// Four tellers, four threads, one account: each deposits 1.00 at the same time.
import ledger.model.*;

void main() throws InterruptedException {
    var ana = new Account("Ana", AccountType.CHECKING, Money.eur("1000.00"));
    List<Thread> tellers = new ArrayList<>();
    for (int i = 1; i <= 4; i++) {
        Thread t = new Thread(() -> ana.deposit(Money.eur("1.00")),
                "teller-" + i);
        tellers.add(t);
        t.start();
    }
    for (Thread t : tellers) {
        t.join();                       // wait for each teller to finish
    }
    IO.println(tellers.size() + " tellers ran: " + tellers.getFirst().getName()
            + " to " + tellers.getLast().getName());
    IO.println("main ran on " + Thread.currentThread().getName());
    IO.println("balance " + ana.balance());
}
