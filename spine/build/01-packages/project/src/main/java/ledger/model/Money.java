package ledger.model;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Currency;

// An amount of money: a value, compared by what it holds, never changed.
public record Money(BigDecimal amount, Currency currency) {
    public static final Currency EUR = Currency.getInstance("EUR");

    public Money {
        if (amount.scale() > currency.getDefaultFractionDigits()) {
            throw new IllegalArgumentException("finer than cents: " + amount);
        }
        amount = amount.setScale(currency.getDefaultFractionDigits());
    }

    public static Money eur(String amount) {
        return new Money(new BigDecimal(amount), EUR);
    }

    public Money plus(Money other) {
        sameCurrency(other);
        return new Money(amount.add(other.amount), currency);
    }

    public Money minus(Money other) {
        sameCurrency(other);
        return new Money(amount.subtract(other.amount), currency);
    }

    public Money times(BigDecimal rate) {
        BigDecimal exact = amount.multiply(rate);
        int cents = currency.getDefaultFractionDigits();
        BigDecimal rounded = exact.setScale(cents, RoundingMode.HALF_EVEN);
        return new Money(rounded, currency);
    }

    public boolean isMoreThan(Money other) {
        sameCurrency(other);
        return amount.compareTo(other.amount) > 0;
    }

    private void sameCurrency(Money other) {
        if (!currency.equals(other.currency)) {
            throw new IllegalArgumentException(
                    "mixed currencies: " + currency + " and " + other.currency);
        }
    }

    @Override
    public String toString() {
        return amount + " " + currency;
    }
}
