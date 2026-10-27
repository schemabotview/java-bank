// A hundred threads, a thousand increments each: three ways to count to 100000.
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.LongAdder;

long plain = 0;
AtomicLong atomic = new AtomicLong();
LongAdder adder = new LongAdder();

void main() throws InterruptedException {
    List<Thread> threads = new ArrayList<>();
    for (int i = 0; i < 100; i++) {
        threads.add(Thread.ofPlatform().start(() -> {
            for (int n = 0; n < 1000; n++) {
                plain++;                      // read, add, write: three steps
                atomic.incrementAndGet();     // one indivisible step
                adder.increment();            // a cell per thread, summed later
            }
        }));
    }
    for (Thread t : threads) {
        t.join();
    }
    IO.println("plain long:  " + plain);
    IO.println("AtomicLong:  " + atomic.get());
    IO.println("LongAdder:   " + adder.sum());
}
