import java.math.BigDecimal;

// One account at Syndica Bank: who holds it, and what is in it.
class Account {
    private String holder;
    private BigDecimal balance;

    Account(String holder, BigDecimal opening) {
        if (holder == null || holder.isBlank()) {
            throw new IllegalArgumentException("an account needs a holder");
        }
        if (opening.signum() < 0) {
            throw new IllegalArgumentException(
                    "opening balance below zero: " + opening);
        }
        this.holder = holder;
        this.balance = opening;
    }

    Account(String holder) {
        this(holder, BigDecimal.ZERO);
    }

    String holder() { return holder; }
    BigDecimal balance() { return balance; }

    void deposit(BigDecimal amount) {
        balance = balance.add(amount);
    }

    void withdraw(BigDecimal amount) {
        if (amount.compareTo(balance) > 0) {
            throw new IllegalArgumentException(
                    amount + " is more than " + balance);
        }
        balance = balance.subtract(amount);
    }
}
