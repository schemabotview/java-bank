import java.time.LocalDate;

// One line of the ledger: the day, the account, and what happened.
record Entry(LocalDate on, String account, Transaction tx) {}
