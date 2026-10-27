// Two threads move cents in opposite directions between the same two accounts.
import ledger.TransferService;
import ledger.model.*;

void main() throws InterruptedException {
    var ana = new Account("Ana", AccountType.CHECKING, Money.eur("5000.00"));
    var ben = new Account("Ben", AccountType.CHECKING, Money.eur("5000.00"));
    var service = new TransferService();
    Thread anaToBen = Thread.ofPlatform().name("ana-to-ben")
            .start(() -> move(service, ana, ben));
    Thread benToAna = Thread.ofPlatform().name("ben-to-ana")
            .start(() -> move(service, ben, ana));
    anaToBen.join();
    benToAna.join();
    IO.println("400000 transfers done; Ana " + ana.balance() + ", Ben "
            + ben.balance() + ", total " + ana.balance().plus(ben.balance()));
}

void move(TransferService service, Account from, Account to) {
    for (int i = 0; i < 200_000; i++) {
        try {
            service.transfer(from, to, Money.eur("0.01"));
        } catch (InsufficientFundsException e) {
            throw new IllegalStateException(e);
        }
    }
}
