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

    // One journal line: day,account,KIND,amount[,to]
    String toCsv() {
        String amount = tx.amount().amount().toPlainString();
        String head = on + "," + account + ",";
        return switch (tx) {
            case Transaction.Deposit _ -> head + "DEPOSIT," + amount;
            case Transaction.Withdrawal _ -> head + "WITHDRAWAL," + amount;
            case Transaction.Transfer t ->
                    head + "TRANSFER," + amount + "," + t.to();
        };
    }

    static Entry fromCsv(String line) {
        String[] f = line.split(",");
        Money amount = Money.eur(f[3]);
        Transaction tx = switch (f[2]) {
            case "DEPOSIT" -> new Transaction.Deposit(amount);
            case "WITHDRAWAL" -> new Transaction.Withdrawal(amount);
            case "TRANSFER" -> new Transaction.Transfer(f[4], amount);
            default ->
                    throw new IllegalArgumentException("no such kind: " + f[2]);
        };
        return new Entry(LocalDate.parse(f[0]), f[1], tx);
    }
}
