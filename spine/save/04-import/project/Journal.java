import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;

// The bank's memory: every entry, appended to a file, one line each.
// One writer, opened once: it must be closed, or its buffer is lost.
class Journal implements AutoCloseable {
    private final Path file;
    private final BufferedWriter out;

    Journal(Path file) throws IOException {
        this.file = file;
        Files.createDirectories(file.getParent());
        this.out = Files.newBufferedWriter(file,
                StandardOpenOption.CREATE, StandardOpenOption.APPEND);
    }

    void append(Entry e) throws IOException {
        out.write(e.toCsv());
        out.newLine();
    }

    List<Entry> readAll() throws IOException {
        List<Entry> entries = new ArrayList<>();
        for (String line : Files.readAllLines(file)) {
            entries.add(Entry.fromCsv(line));
        }
        return entries;
    }

    @Override
    public void close() throws IOException {
        out.close();
    }
}
