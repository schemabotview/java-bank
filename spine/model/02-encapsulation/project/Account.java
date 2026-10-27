import java.math.BigDecimal;

// One account at Syndica Bank: who holds it, and what is in it.
class Account {
    private String holder;
    private BigDecimal balance;

    Account(String holder, BigDecimal opening) {
        this.holder = holder;
        this.balance = opening;
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
