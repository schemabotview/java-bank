// Replay a million ledger entries, keep them, and watch the garbage collector.

record Entry(LocalDate on, String account, BigDecimal amount) {}

void main() {
    List<Entry> ledger = new ArrayList<>();
    for (int i = 0; i < 1_000_000; i++) {
        String line = "SB-" + (i % 5000) + "," + i + ".25";
        String[] f = line.split(",");                  // garbage: dies young
        ledger.add(new Entry(LocalDate.of(2026, 10, 1 + i % 28), f[0],
                new BigDecimal(f[1])));                // kept: lives long
    }
    Runtime rt = Runtime.getRuntime();
    long used = (rt.totalMemory() - rt.freeMemory()) / 1_000_000;
    IO.println(ledger.size() + " entries kept, about " + used + " MB in use");
}
