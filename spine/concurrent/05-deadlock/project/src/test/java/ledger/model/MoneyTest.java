package ledger.model;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class MoneyTest {

    // balance × rate, rounded to cents, half to the even digit
    @ParameterizedTest(name = "{0} × {1} = {2}")
    @CsvSource({
            "120.50, 0.015, 1.81",
            "1000.00, 0.015, 15.00",
            "0.03, 0.5, 0.02",      // 0.015: a tie, rounds to the even 2
            "0.05, 0.5, 0.02",      // 0.025: a tie, rounds to the even 2
            "0.07, 0.5, 0.04",      // 0.035: a tie, rounds to the even 4
    })
    void interestIsRoundedToCents(String balance, String rate, String paid) {
        Money interest = Money.eur(balance).times(new BigDecimal(rate));
        assertEquals(Money.eur(paid), interest);
    }
}
