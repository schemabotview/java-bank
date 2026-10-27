package ledger.model;

import java.math.BigDecimal;

// The kinds of account Syndica Bank offers: a fixed list, each with its terms.
public enum AccountType implements InterestPolicy {
    CHECKING(new BigDecimal("2.00"), BigDecimal.ZERO),
    SAVINGS(BigDecimal.ZERO, new BigDecimal("0.015"));

    private final BigDecimal monthlyFee;
    private final BigDecimal monthlyRate;

    AccountType(BigDecimal monthlyFee, BigDecimal monthlyRate) {
        this.monthlyFee = monthlyFee;
        this.monthlyRate = monthlyRate;
    }

    public BigDecimal monthlyFee() { return monthlyFee; }
    public BigDecimal monthlyRate() { return monthlyRate; }

    @Override
    public Money monthlyInterest(Money balance) {
        return balance.times(monthlyRate);
    }
}
