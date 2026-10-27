package ledger;

import ledger.model.Account;
import ledger.model.InsufficientFundsException;
import ledger.model.Money;

// Moves money between two accounts: both change, or neither does.
public class TransferService {

    public void transfer(Account from, Account to, Money amount)
            throws InsufficientFundsException {
        // Every thread takes the two locks in ONE order, the account number's,
        // so no two threads can each hold the lock the other is waiting for.
        boolean fromFirst = from.number().compareTo(to.number()) < 0;
        Account first = fromFirst ? from : to;
        Account second = fromFirst ? to : from;
        synchronized (first) {
            synchronized (second) {
                from.withdraw(amount);
                to.deposit(amount);
            }
        }
    }
}
