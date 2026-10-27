package ledger.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

import org.junit.jupiter.api.Test;

class BankCalendarTest {
    static final ZoneId BERLIN = ZoneId.of("Europe/Berlin");

    // A calendar whose clock is stopped at one instant, in the bank's zone.
    static BankCalendar at(String instant) {
        return new BankCalendar(Clock.fixed(Instant.parse(instant), BERLIN));
    }

    @Test
    void halfPastElevenOnTheLastEveningIsMonthEnd() {
        assertTrue(at("2026-10-31T22:30:00Z").isMonthEnd());   // 23:30, Berlin
    }

    @Test
    void anHourLaterItIsAlreadyNovember() {
        BankCalendar calendar = at("2026-10-31T23:30:00Z");    // 00:30, Berlin
        assertFalse(calendar.isMonthEnd());
        assertEquals(LocalDate.of(2026, 11, 1), calendar.today());
    }

    @Test
    void aLeapYearFebruaryEndsOnThe29th() {
        assertFalse(at("2028-02-28T12:00:00Z").isMonthEnd());
        assertTrue(at("2028-02-29T12:00:00Z").isMonthEnd());
    }
}
