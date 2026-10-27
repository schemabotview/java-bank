import java.math.BigDecimal;

// The kinds of account Syndica Bank offers: a fixed list, each with its terms.
enum AccountType {
    CHECKING(new BigDecimal("2.00"), BigDecimal.ZERO),
    SAVINGS(BigDecimal.ZERO, new BigDecimal("0.015"));

    private final BigDecimal monthlyFee;
    private final BigDecimal monthlyRate;

    AccountType(BigDecimal monthlyFee, BigDecimal monthlyRate) {
        this.monthlyFee = monthlyFee;
        this.monthlyRate = monthlyRate;
    }

    BigDecimal monthlyFee() { return monthlyFee; }
    BigDecimal monthlyRate() { return monthlyRate; }
}
