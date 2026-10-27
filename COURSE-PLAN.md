# Learn Java by building a bank: full course, beginner to professional — plan

**Status: v1 plan, scope agreed with the owner (2026-10-27): app `ledger`, JDK 25, 12 courses,
83 sections.** Infra is in (toolchain, spine replay, IDE frame, checks, app map); no course is authored yet.

## The idea

One application, `ledger`, a small fictional bank. It grows from one file that prints one balance to
a tested, packaged transfer service: it keeps a ledger, survives a restart, runs 10,000 concurrent
transfers without losing a cent, and serves an HTTP API. Every Java feature is taught **when the
bank first needs it**. Background topics (the JVM, class loading, memory, GC) appear as short
detours at the moment they answer a question on screen. They are never front-loaded.

Why a bank:

- **It is Java's home turf.** Banks and payment systems really run on the JVM; the app is a small
  version of real work, not a classroom exercise.
- **Everyone understands it.** Accounts, deposits, transfers and an overdraft need no explaining.
- **It grows the way Java is used**: a file → a modelled domain → a Maven project → a concurrent
  service → an HTTP API.
- **Each need pulls in a feature**: money cannot be a `double` (`BigDecimal`, then a `Money`
  record); a balance must never go negative (encapsulation); the kinds of transaction are closed
  (a sealed type, pattern-matching `switch`); an overdraft must be handled (a checked exception);
  the balance is a fold of the ledger (streams); the ledger must survive a restart (an append-only
  journal); tellers work at once (a race, then a deadlock: locks and lock ordering); scale
  (virtual threads); a retried payment must not pay twice (idempotency keys). Nothing is taught
  for its own sake.

It is the BANK's side of money, not personal spending, so it does not repeat python-expense-tracker:
a derived balance, two-sided transfers, month-end interest, concurrency that must never lose money.

## Packaging for YouTube

**One video: "Learn Java by building a bank: full course, beginner to professional"** covers all
12 courses, 83 sections, about 2 h 05 min, as one continuous story.

A course is one YouTube chapter group and the owner's review unit. A section (~90 s) is one chapter,
titled *concept: what the bank gets* (e.g. "Records: money as a value"). The video opens with the
finished service running (the payoff first). It is published only when all 12 courses are recorded.
Each section can also go out as a Short (portrait, `record-reels`).

## Java: JDK 25 LTS

Pinned to OpenJDK 25.0.4.1 (LTS; Ubuntu's `openjdk-25-jdk-headless` build) and Maven 3.9.16, both
installed by `scripts/install-jdk.sh` (also usable as the cloud environment's setup script). Every output is run and replayed, never typed; `jshell` plays the part
the Python REPL plays. JDK 25 features used: compact source files and instance `main`
(`void main() { IO.println(...) }`, Course 2 — the class arrives in Course 5 when it is needed),
module import declarations, flexible constructor bodies (5.3), records, sealed types and
pattern-matching `switch` (5), virtual threads (11.9). Preview features are not used.

## The app: `ledger`

One name everywhere: the folder, the Maven `artifactId`, the jar and the root package are `ledger`.
The bank is **Syndica Bank**, a fictional name (the owner's pick, 2026-10-27). Not "Syndicate Bank":
that was a real Indian bank, now part of Canara Bank, which holds the brand. Customers are Ana, Ben and Chen. Data is synthetic and owned.

The bad rows are real: `12,50` as an amount, an unknown account number, a duplicate transaction id,
a negative deposit, a timestamp near midnight in New York.

Money is `long` cents for one section (3.3), then `BigDecimal` (3.4), then a `Money` record (5.6).

```
ledger/
  Bank.java                        one compact source file, void main()        (2 → 4)
  src/main/java/ledger/
    model/  Account, AccountType (enum), Money (record)                        (5)
            Transaction: sealed Deposit | Withdrawal | Transfer                (5)
            InsufficientFundsException (checked)                               (5)
    Bank.java          Map<AccountNo, Account>, the ledger List                (6)
    Statements.java    streams: balance = fold of the ledger; by month         (7)
    store/Journal.java append-only CSV journal, replay on start                (8)
    TransferService    thread-safe transfers, lock ordering                    (11)
    api/Server.java    JDK HttpServer: accounts, transfers, idempotency keys   (12)
  src/test/java/ledger/…           JUnit 6                                     (10)
  pom.xml                          Maven                                       (9)
  data/journal.csv                 what the bank writes                        (8)
  data/import/statement-2026-10.csv  a statement to import, with bad rows      (8)
```

| After course | The bank can… |
| --- | --- |
| 2 Start | print one balance |
| 3 Hold | hold accounts and a day's transactions, with exact money |
| 4 Decide | deposit and withdraw in a teller loop; refuse overdrafts and bad input |
| 5 Model | use real types: accounts, `Money`, sealed transactions |
| 6 Collect | hold many accounts and a full ledger; find and sort them |
| 7 Stream | derive balances from the ledger; print monthly statements |
| 8 Save | journal every transaction, replay it on restart, import a statement with bad rows |
| 9 Build | build as a Maven project; run as `java -jar ledger.jar` |
| 10 Trust | pass its tests, keep an audit log; the GC shown at work |
| 11 Concurrent | run 10,000 concurrent transfers with no lost cents and no deadlock |
| 12 Ship | serve an HTTP API where a retried transfer pays once; ship as a jlink runtime |

The app is JDK only. JUnit (Jupiter 6.1.3) is the one dependency, arriving with Maven in Course 9, where it also
teaches what a dependency is.

## The courses

Side pane = the diagram (every IDE section carries one). Detours are marked ◆, in two kinds:

- **◆ side pane:** a small picture of the code on screen (stack and heap, a frame, buckets). It
  stays in the IDE frame, so the proof (the jshell or program output) stays visible beside it.
- **◆ full scene:** a canonical big picture that needs the whole 16:9 frame (how `java` runs a
  file, the heap and GC). It is its own section with a concept frame, and carries the real output
  inside the scene as a `code` node imported from a lab, so it stays proof. The next section
  returns to the IDE.

Rule: if a detour's diagram cannot fit the side pane at ≥ 24px body text in the 4K frame, it is a
full scene. When in doubt, full scene.

**1. `intro` · Java, and what we'll build · 2**

| # | Section | Frame | Side pane |
| --- | --- | --- | --- |
| 1 | What Java is, and where it runs | concept | the JVM → banks and payments, Android, Kafka, Spark, Elasticsearch |
| 2 | What we'll build | concept | **the app map**: one balance → ledger → transfer service → API; the finished statement |

**2. `start` · The first program · 6**

| # | Section | Step | Side pane |
| --- | --- | --- | --- |
| 1 | Install a JDK | `java --version` | JDK ⊃ runtime ⊃ JVM |
| 2 | `Bank.java` | print one balance with `java Bank.java` | file → `java` launcher → stdout |
| 3 | ◆ full scene: what `java Bank.java` does | concept + lab (`javac`, `javap -c`, `-Xlog:class+load`) | source → javac → bytecode → class loading → the JVM → output; javac folded `"…" + 120.50` into one string |
| 4 | jshell beside the editor | try `120.50 * 0.015` (interest: `1.8074999999999999`), then write it down | read → eval → print → loop |
| 5 | Compile errors | a typo `IO.prinln`: nothing runs; a missing `;` (lab) beside it | the compiler stops the file; a typo is caught BEFORE running (the contrast with Python) |
| 6 | A runtime exception | `120 / 0`: `ArithmeticException`, lines 4–6 already printed | stack trace anatomy; compile time vs run time compared |

**3. `hold` · Hold the data · 9**

| # | Section | Step | Side pane |
| --- | --- | --- | --- |
| 1 | Variables and static types | `int balance`; a `String` into an `int` refused | name → typed slot |
| 2 | ◆ side pane: primitives vs references | `long` vs `String` | stack slots vs heap objects |
| 3 | Why money is not a `double` | `0.1 + 0.2`; cents in a `long` | what `0.1` really stores |
| 4 | `BigDecimal` | `new BigDecimal(0.1)` vs `"0.1"` | unscaled value + scale |
| 5 | Strings | holder names, account numbers, `formatted` | immutable cells; a "change" is a new object |
| 6 | `==` vs `equals` | two equal names compare unequal (failure) | two objects, equal text, different identity |
| 7 | Text blocks | a statement header | one literal, its lines |
| 8 | Arrays | one day's transactions | fixed slots → `BigDecimal`s |
| 9 | `null` | a helpful NPE message | a slot with no arrow |

**4. `decide` · Decide, repeat, react · 10**

| # | Section | Step | Side pane |
| --- | --- | --- | --- |
| 1 | Expressions | simple interest; precedence | expression tree |
| 2 | Integer overflow | cents in an `int` wrap (failure) | the 32-bit wheel |
| 3 | `if` / `else` | withdraw only when funds allow | decision chart, one path lit |
| 4 | `switch` expressions | fee by account type | the value against each case |
| 5 | `for` loops | apply a day of transactions | cursor down the array |
| 6 | `while` and `Scanner` | the teller loop until `quit` | the loop and its exits |
| 7 | Methods ◆ side pane: the call stack | `deposit()`, `withdraw()` | a frame pushed, popped |
| 8 | Pass by value | a method cannot change the caller's `balance` (failure) | copy of a value vs copy of a reference |
| 9 | `try` / `catch` | `NumberFormatException` on bad input | the exception unwinding frames |
| 10 | `throw` | a negative deposit refused | guard → throw → caller |

**5. `model` · Model the bank · 10**

| # | Section | Step | Side pane |
| --- | --- | --- | --- |
| 1 | A class | `Account` | class → objects |
| 2 | Encapsulation | a field write makes a negative balance (failure), then `private` | the invariant wall: only `deposit` / `withdraw` get in |
| 3 | Constructors and `this` | validation before the fields are set | an object never exists invalid |
| 4 | `static` | the next account number | one counter, many instances |
| 5 | Enums | `AccountType`: checking, savings with a rate | the enum's fixed instances |
| 6 | Records | `Money(amount, currency)`, compact constructor | a value object; the check on the way in |
| 7 | `equals` and `hashCode` | a duplicate account in a `HashSet` (failure); records do it right | same bucket, or not |
| 8 | Interfaces; inheritance vs composition | `InterestPolicy` | `SavingsAccount extends` vs has-a policy |
| 9 | Sealed types and pattern-matching `switch` | `Deposit \| Withdrawal \| Transfer` | the sealed hierarchy; a new kind will not compile until handled |
| 10 | Checked exceptions | `InsufficientFundsException` | checked vs unchecked: who must handle it |

**6. `collect` · Many accounts · 8**

| # | Section | Step | Side pane |
| --- | --- | --- | --- |
| 1 | `ArrayList` ◆ side pane: growth | the ledger | backing array copied at capacity |
| 2 | `HashMap` ◆ side pane: buckets | accounts by number | key → hash → bucket → account |
| 3 | `Set` | flagged accounts | `contains` on a set vs a list |
| 4 | Iterating safely | remove closed accounts mid-loop: `ConcurrentModificationException` (failure) | the iterator's modification count |
| 5 | Generics | `Page<T>` of results | one class, many types; erasure in one line |
| 6 | `Comparator` | sort by date, then amount | the two keys compared |
| 7 | `Optional` | find an account | present / empty, no `null` |
| 8 | Unmodifiable collections | `List.copyOf`: a statement cannot be edited | a refused write |

**7. `stream` · Statements · 6**

| # | Section | Step | Side pane |
| --- | --- | --- | --- |
| 1 | Lambdas | a fraud rule as a `Predicate` | a function as a value |
| 2 | Method references | `Transaction::amount` | the reference ↔ its lambda |
| 3 | `filter` / `map` / `reduce` | **the balance is a fold of the ledger** | the pipeline, element by element |
| 4 | `groupingBy` | monthly statements | stream → buckets by month |
| 5 | Laziness | `anyMatch` stops at the first suspicious transfer | the elements that never ran |
| 6 | When a loop reads better | the same logic both ways | side by side |

**8. `save` · The journal · 6**

| # | Section | Step | Side pane |
| --- | --- | --- | --- |
| 1 | `Path` and `Files` | append each transaction | the append-only journal |
| 2 | Replay | balances rebuilt on start | journal → fold → balances |
| 3 | try-with-resources | an unclosed writer loses the last lines (failure) | the resource's lifecycle |
| 4 | Importing a statement | bad rows rejected with a reason | each row → accepted / rejected |
| 5 | `java.time` | month-end interest; `Instant` vs `LocalDate` | the timeline vs a calendar day |
| 6 | Time zones | 23:30 in New York is tomorrow in UTC | one instant, two dates |

**9. `build` · A real project · 6**

| # | Section | Step | Side pane |
| --- | --- | --- | --- |
| 1 | Packages | `ledger.model`, `ledger.store` | directory = package |
| 2 | The classpath ◆ side pane: class loading | `javac -d`; `NoClassDefFoundError` (failure) | loaders → classpath → `.class` |
| 3 | Maven | `pom.xml`, the standard layout | lifecycle: compile → test → package |
| 4 | Dependencies | add JUnit; `mvn dependency:tree` | our jar → its dependencies |
| 5 | A runnable jar | `java -jar ledger.jar` | the jar's manifest |
| 6 | Access and modules | `module-info` exports | what each package can see |

**10. `trust` · Tests and the JVM · 6**

| # | Section | Step | Side pane |
| --- | --- | --- | --- |
| 1 | A first JUnit test | deposit | arrange → act → assert |
| 2 | `assertThrows` | an overdraft | the expected failure |
| 3 | Parameterized tests | the interest table | one test, a row per case |
| 4 | Testing time | inject a `Clock` | a fixed month end |
| 5 | Logging | `System.Logger`: an audit log | levels → output |
| 6 | ◆ full scene: heap and GC | replay 1M transactions | young / old generations, the real `-Xlog:gc` output beside it |

**11. `concurrent` · Many tellers at once · 9**

| # | Section | Step | Side pane |
| --- | --- | --- | --- |
| 1 | Threads | 100 tellers deposit to one account | threads sharing one heap |
| 2 | **The race** | money lost: the balance is off (real output) | read-modify-write, interleaved |
| 3 | `synchronized` ◆ side pane: happens-before | the race fixed | the monitor; visibility |
| 4 | Atomics | `AtomicLong` / `LongAdder` counters | compare-and-swap |
| 5 | **Deadlock** | A→B and B→A at once; the real `jstack` dump | the wait-for cycle |
| 6 | Lock ordering | lock by account number | the cycle broken |
| 7 | `ExecutorService` and `Future` | a pool of tellers | task queue → worker pool |
| 8 | `ConcurrentHashMap` | the accounts map | per-bin locking vs one lock |
| 9 | Virtual threads | 10,000 transfers, measured | many virtual threads on a few carriers |

**12. `ship` · The service · 5**

| # | Section | Step | Side pane |
| --- | --- | --- | --- |
| 1 | An HTTP API | JDK `HttpServer`: accounts, transfers | request → handler → `Bank` |
| 2 | Idempotency keys | a retried transfer pays twice (failure), then once | key → stored result |
| 3 | `HttpClient` | call the API | client ↔ server |
| 4 | Configuration and jlink | a slim runtime image | full JDK vs slim image |
| 5 | Where next | Spring Boot, JPA and databases, Kafka (our journal is an event log) | each part of the bank → its tool at scale |

## How a section teaches

Objective → mental model (side pane) → the code and its real result → a failure or alternative →
bridge. One step per section; failure is its own step with real output. Narration explains, never
reads code aloud. A detour ◆ is ≤ 120 s and returns to the bank.

## Build order

1. ~~Owner review of the app and scope~~ (2026-10-27: bank, JDK 25, 83 sections).
2. ~~Infra~~ (2026-10-27): python-expense-tracker's frame template (`ide.ts`), the spine replay (Java
   steps + jshell sessions), checks and registry; `scripts/install-jdk.sh`; the app-map scene. The data
   files are written with the steps that create them (Course 8).
3. Course 2 as the pilot → owner review.
4. Courses 1, 3–12 one at a time, each reviewed on its rendered routes, then narrated.
5. Record all 12 courses → assemble and publish the one video.

## Decisions

1. App: `ledger`, a small fictional bank: Syndica Bank.
2. JDK 25 LTS (25.0.4.1), Maven 3.9.16; no preview features.
3. JDK only for the app; JUnit 6 (Jupiter) as the one dependency, from Course 9; Maven, not Gradle.
4. One video, one continuous story: 12 courses, 83 sections, ~2 h 05.
5. Background is just-in-time (◆ detours), never a front-loaded course.
6. Repo: `java-bank` (new).
