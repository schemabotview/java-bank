// A hundred threads each open 100 accounts into a shared map: 10000 in all.
void main() throws InterruptedException {
    Map<String, Integer> plain = new HashMap<>();
    Map<String, Integer> concurrent = new ConcurrentHashMap<>();
    List<Thread> threads = new ArrayList<>();
    for (int t = 0; t < 100; t++) {
        int base = t * 100;
        threads.add(Thread.ofPlatform().start(() -> {
            for (int i = base; i < base + 100; i++) {
                plain.put("SB-%05d".formatted(i), i);
                concurrent.put("SB-%05d".formatted(i), i);
            }
        }));
    }
    for (Thread t : threads) {
        t.join();
    }
    IO.println("HashMap:           " + plain.size() + " accounts");
    IO.println("ConcurrentHashMap: " + concurrent.size() + " accounts");
}
