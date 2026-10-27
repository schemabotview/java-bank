import java.time.LocalDate;

// One line of the ledger: the day, the account, and what happened.
record Entry(LocalDate on, String account, Transaction tx)
        implements Comparable<Entry> {

    // Natural order: by day; within a day, the larger amount first.
    @Override
    public int compareTo(Entry other) {
        int byDay = on.compareTo(other.on);
        if (byDay != 0) {
            return byDay;
        }
        return other.tx.amount().amount().compareTo(tx.amount().amount());
    }
}
