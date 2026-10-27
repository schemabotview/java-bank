import java.math.BigDecimal;

// One account at Syndica Bank: who holds it, and what is in it.
class Account {
    String holder;
    BigDecimal balance;

    void deposit(BigDecimal amount) {
        balance = balance.add(amount);
    }
}
