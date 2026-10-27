import java.util.List;

// One page of anything: a statement's entries, a list of accounts.
record Page<T>(List<T> items, int number, int pages) {

    static <T> Page<T> of(List<T> all, int size, int number) {
        int pages = Math.max(1, (all.size() + size - 1) / size);
        int from = Math.min((number - 1) * size, all.size());
        int to = Math.min(from + size, all.size());
        return new Page<>(all.subList(from, to), number, pages);
    }
}
