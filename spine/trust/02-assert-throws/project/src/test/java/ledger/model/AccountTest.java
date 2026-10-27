package ledger.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class AccountTest {

    @Test
    void depositAddsToTheBalance() {
        var ana = new Account("Ana", AccountType.CHECKING, Money.eur("100.00"));

        ana.deposit(Money.eur("25.10"));

        assertEquals(Money.eur("125.10"), ana.balance());
    }

    @Test
    void anOverdraftIsRefusedAndChangesNothing() {
        var ben = new Account("Ben", AccountType.CHECKING, Money.eur("80.00"));

        var refused = assertThrows(InsufficientFundsException.class,
                () -> ben.withdraw(Money.eur("100.00")));

        assertEquals("100.00 EUR is more than the balance, 80.00 EUR",
                refused.getMessage());
        assertEquals(Money.eur("80.00"), ben.balance());
    }
}
