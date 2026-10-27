import java.math.BigDecimal;

// A welcome offer: a higher rate for the first months, then the usual policy.
class Promotion implements InterestPolicy {
    private final BigDecimal rate;
    private final InterestPolicy after;
    private int monthsLeft;

    Promotion(BigDecimal rate, int months, InterestPolicy after) {
        this.rate = rate;
        this.monthsLeft = months;
        this.after = after;
    }

    @Override
    public Money monthlyInterest(Money balance) {
        if (monthsLeft == 0) {
            return after.monthlyInterest(balance);
        }
        monthsLeft--;
        return balance.times(rate);
    }
}
