package ledger.model;

import java.math.BigDecimal;
import java.util.concurrent.atomic.AtomicInteger;

// One account at Syndica Bank: who holds it, and what is in it.
// Every method that touches the balance is synchronized on the account:
// one thread at a time, and each sees what the one before it wrote.
public class Account {
    // One counter, shared by every account, and safe to bump from any thread.
    private static final AtomicInteger opened = new AtomicInteger();

    private final String number;
    private final String holder;
    private final AccountType type;
    private InterestPolicy interest;
    private Money balance;

    public Account(String holder, AccountType type, Money opening) {
        if (holder == null || holder.isBlank()) {
            throw new IllegalArgumentException("an account needs a holder");
        }
        if (opening.amount().signum() < 0) {
            throw new IllegalArgumentException(
                    "opening balance below zero: " + opening);
        }
        this.number = "SB-%04d".formatted(opened.incrementAndGet());
        this.holder = holder;
        this.type = type;
        this.interest = type;
        this.balance = opening;
    }

    public Account(String holder, AccountType type) {
        this(holder, type, Money.eur("0"));
    }

    public static int opened() { return opened.get(); }

    public String number() { return number; }
    public String holder() { return holder; }
    public AccountType type() { return type; }
    public synchronized Money balance() { return balance; }

    public synchronized void deposit(Money amount) {
        balance = balance.plus(amount);
    }

    public synchronized void withdraw(Money amount)
            throws InsufficientFundsException {
        if (amount.isMoreThan(balance)) {
            throw new InsufficientFundsException(amount, balance);
        }
        balance = balance.minus(amount);
    }

    public synchronized void apply(Transaction t)
            throws InsufficientFundsException {
        switch (t) {
            case Transaction.Deposit(Money amount) -> deposit(amount);
            case Transaction.Withdrawal(Money amount) -> withdraw(amount);
            case Transaction.Transfer(_, Money amount) -> withdraw(amount);
        }
    }

    public void earnWith(InterestPolicy policy) {
        this.interest = policy;
    }

    public synchronized Money payInterest() {
        Money paid = interest.monthlyInterest(balance);
        balance = balance.plus(paid);
        return paid;
    }

    public synchronized Money interestDue() {
        return interest.monthlyInterest(balance);
    }
}
