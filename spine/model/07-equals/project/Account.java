import java.math.BigDecimal;

// One account at Syndica Bank: who holds it, and what is in it.
class Account {
    private static int opened = 0;    // one counter, shared by every account

    private final String number;
    private final String holder;
    private final AccountType type;
    private Money balance;

    Account(String holder, AccountType type, Money opening) {
        if (holder == null || holder.isBlank()) {
            throw new IllegalArgumentException("an account needs a holder");
        }
        if (opening.amount().signum() < 0) {
            throw new IllegalArgumentException(
                    "opening balance below zero: " + opening);
        }
        opened++;
        this.number = "SB-%04d".formatted(opened);
        this.holder = holder;
        this.type = type;
        this.balance = opening;
    }

    Account(String holder, AccountType type) {
        this(holder, type, Money.eur("0"));
    }

    static int opened() { return opened; }

    String number() { return number; }
    String holder() { return holder; }
    AccountType type() { return type; }
    Money balance() { return balance; }

    void deposit(Money amount) {
        balance = balance.plus(amount);
    }

    void withdraw(Money amount) {
        if (amount.isMoreThan(balance)) {
            throw new IllegalArgumentException(
                    amount + " is more than " + balance);
        }
        balance = balance.minus(amount);
    }

    void payInterest() {
        balance = balance.plus(balance.times(type.monthlyRate()));
    }
}
