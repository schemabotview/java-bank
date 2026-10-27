import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;

// The bank's memory: every entry, appended to a file, one line each.
class Journal {
    private final Path file;

    Journal(Path file) throws IOException {
        this.file = file;
        Files.createDirectories(file.getParent());
    }

    void append(Entry e) throws IOException {
        Files.writeString(file, e.toCsv() + "\n",
                StandardOpenOption.CREATE, StandardOpenOption.APPEND);
    }

    List<Entry> readAll() throws IOException {
        if (!Files.exists(file)) {
            return List.of();
        }
        List<Entry> entries = new ArrayList<>();
        for (String line : Files.readAllLines(file)) {
            entries.add(Entry.fromCsv(line));
        }
        return entries;
    }
}
