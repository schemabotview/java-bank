package ledger.model;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class AccountTest {

    @Test
    void depositAddsToTheBalance() {
        var ana = new Account("Ana", AccountType.CHECKING, Money.eur("100.00"));

        ana.deposit(Money.eur("25.10"));

        assertEquals(Money.eur("125.10"), ana.balance());
    }
}
