package ledger.model;

import java.time.Clock;
import java.time.LocalDate;
import java.time.YearMonth;

// Today, as the bank sees it. It reads a Clock, so a test can choose the day.
public final class BankCalendar {
    private final Clock clock;

    public BankCalendar(Clock clock) {
        this.clock = clock;
    }

    public LocalDate today() {
        return LocalDate.now(clock);
    }

    public boolean isMonthEnd() {
        LocalDate today = today();
        return today.equals(YearMonth.from(today).atEndOfMonth());
    }
}
