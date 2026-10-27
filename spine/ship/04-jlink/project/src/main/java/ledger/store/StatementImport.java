package ledger.store;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import ledger.model.Entry;
import ledger.model.Money;
import ledger.model.Transaction;

// A statement from another system: every row accepted, or rejected with why.
public class StatementImport {
    public record Rejected(int line, String reason) {}

    public final List<Entry> accepted = new ArrayList<>();
    public final List<Rejected> rejected = new ArrayList<>();

    public StatementImport(Path file, Set<String> known) throws IOException {
        List<String> rows = Files.readAllLines(file);
        Set<String> seen = new HashSet<>();
        for (int i = 1; i < rows.size(); i++) {        // row 0 is the header
            try {
                accepted.add(parse(rows.get(i), known, seen));
            } catch (IllegalArgumentException e) {
                rejected.add(new Rejected(i + 1, e.getMessage()));
            }
        }
    }

    private static Entry parse(String row, Set<String> known,
            Set<String> seen) {
        String[] f = row.split(",");
        if (f.length != 5) {
            throw new IllegalArgumentException(f.length + " fields, not 5");
        }
        if (!seen.add(f[0])) {
            throw new IllegalArgumentException("duplicate id " + f[0]);
        }
        if (!known.contains(f[2])) {
            throw new IllegalArgumentException("no account " + f[2]);
        }
        Money amount = Money.eur(f[4]);
        if (amount.amount().signum() <= 0) {
            throw new IllegalArgumentException("not positive: " + f[4]);
        }
        Transaction tx = switch (f[3]) {
            case "DEPOSIT" -> new Transaction.Deposit(amount);
            case "WITHDRAWAL" -> new Transaction.Withdrawal(amount);
            default -> throw new IllegalArgumentException("no kind " + f[3]);
        };
        return new Entry(LocalDate.parse(f[1]), f[2], tx);
    }
}
