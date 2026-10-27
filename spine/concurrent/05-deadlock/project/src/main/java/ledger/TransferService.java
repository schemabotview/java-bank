package ledger;

import ledger.model.Account;
import ledger.model.InsufficientFundsException;
import ledger.model.Money;

// Moves money between two accounts: both change, or neither does.
public class TransferService {

    public void transfer(Account from, Account to, Money amount)
            throws InsufficientFundsException {
        synchronized (from) {           // hold the payer ...
            synchronized (to) {         // ... and the payee, together
                from.withdraw(amount);
                to.deposit(amount);
            }
        }
    }
}
