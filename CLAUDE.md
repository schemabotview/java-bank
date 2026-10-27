# CLAUDE.md — java-bank

> Workspace invariants live in the workspace `CLAUDE.md`. This file is only what is true here.

## What this repo is

A GraphL concept app: **learn Java by building a bank**, `ledger` (Syndica Bank, fictional), from one
file that prints a balance to a tested, packaged transfer service with an HTTP API, in real, executed
code. A **section** is `(scene, narration)`: one full-screen 16:9 frame, one chapter of the video.

**`COURSE-PLAN.md` is the source of truth**: courses, sections, the app's growth, each side-pane
diagram, and the packaging (one video, 12 courses, 83 sections). Author from it; change it first,
never drift from it.

Engine `@graphlearning/graphl-flow` (^0.4.0), shell `@graphlearning/shell` (^1.0.3), both published
and pinned; no overrides. Sister repo: **python-expense-tracker**, the same course design in Python.
Its infra is ported here; port, do not reinvent.

## Status

Infra in (2026-10-27): toolchain installer, spine replay, IDE frame, checks, the app map. No course
is authored, so `COURSES` is empty; the two scenes so far (`intro-what-we-build`,
`start-bank`, a draft) are checked and shot at the shell's bare scene route. Next: Course 2, the pilot.

## Route contract

`#/` catalog; `#/<courseId>-<sectionId>` a section; `#/<sceneId>` a bare scene; `?capture=1` and
`window.__scene.plan()` come from the shell. Do not reimplement the shell.

## Java: OpenJDK 25.0.4.1 and Maven 3.9.16, every output run

Install with `scripts/install-jdk.sh` (also the cloud environment's setup script). The JDK comes from
Ubuntu's archive (`openjdk-25-jdk-headless`, pinned to its exact build) and Maven from Maven Central,
sha512-checked: adoptium.net and github.com are blocked in the cloud environment. Every banner,
compiler error, stack trace and printed value is replayed, never typed. Timings are rounded and tied
to the build; HotSpot-specific behaviour is labelled HotSpot.

## The spine

`spine/<course>/<NN-step>/` = `project/` (the app at that step) + `session.txt` + `step.json`, replayed
by `scripts/spine.py` (`npm run check:spine`; `--write` regenerates). Scenes import them with `?raw`.
Every step has exactly one of `first`, `from` + `changes` (the section's real diff, checked), or `lab`
(the real output a concept scene shows; `src/scenes/lab.ts` `outputOf` cuts one command's output from
it). Experiments go in jshell, never into `Bank.java`. Paths are normalised to `/home/ana/ledger`.
Highlights are found by text (`lineOf`), never typed as line numbers.

What the replay does that python-expense-tracker's did not:

- **The toolchain is set, not found.** `JAVA_HOME` and `PATH` point at the pin whatever the machine
  says (this container has JDK 21 as `JAVA_HOME` and another Maven ahead on `PATH`).
- **`JAVA_TOOL_OPTIONS` is moved to `MAVEN_OPTS`.** Every JVM prints "Picked up JAVA_TOOL_OPTIONS: …"
  on stderr; the cloud proxy sets it, and it would land in every transcript. Maven still needs the
  proxy, and does not announce `MAVEN_OPTS`.
- **jshell runs on a dumb terminal**, the only mode whose screen is plain text (under xterm its line
  editor redraws in escape codes and never echoes). It prints no continuation prompt there, so the
  replay puts `   ...> ` back on the lines the session marks as continuations.
- **A line is typed only after a NEW prompt.** jshell takes seconds to start; typing on silence, or
  on the previous prompt before the echo arrives, interleaves input with output.
- Session prompts: `$ ` command, `jshell> ` snippet, `   ...> ` continuation, `teller> ` the bank's
  own `Scanner` loop (Course 4 on).
- `volatile` masks digits and identity hashes (`Account@1b6d3586`). `*.class`, `target/` and `out/`
  are never compared.

## Frames

python-expense-tracker's IDE template unchanged: explorer | editor (80 × 23) over terminal (13 lines)
| fixed side pane. `ide.ts` differs only in the language (`java`) and the terminal's error rules: a
javac error, a launcher `error:`, `Exception in thread`, a jshell `|  Exception`/`|  Error:` or a
Maven `[ERROR]` runs red to the next prompt (Java prints nothing after one), and tabs expand to 8
columns, as a stack trace's `\tat` does in a terminal. **Every IDE side pane carries a diagram**, not
a bullet list. No edges between panes. A detour (◆) is a side-pane diagram when it pictures the code
on screen, and a full concept scene when it cannot fit the side pane at ≥ 24px; see `COURSE-PLAN.md`.

## Engine gaps (graphl-flow, not fixable here)

- **Java highlighting is thin.** `highlight.ts`'s keyword set is shared across languages and lacks
  most of Java's: `int`, `long`, `double`, `boolean`, `final`, `record`, `sealed`, `permits`,
  `switch`, `throws`, `package`, `synchronized`… They draw as plain names. `void`, `new`,
  `class`, `public`, `static` and `this` do highlight.
- **No Java-world icons.** No Java/OpenJDK, Maven, JUnit or Spring mark; use lucide keys.

Both are an engine minor release (a keyword set per language; brand keys). Raise them before the
courses that lean on them, not here.

## Checks, before handing over

```sh
npm run build && npx tsc --noEmit && npm run check   # check-content + check-render (4K)
npm run check:spine
npm run shots -- <course or sceneId>                 # then LOOK
```

`check-render` also renders every scene no section uses yet, at its bare route. Checks are a floor,
not proof.

## Invariants

- Never write `x`/`y`; scenes are declarative.
- Stylesheets in order: graphl-flow, shell, `./theme.css` last. `--brand` is Java orange `#f89820`.
- No `file:` installs committed.
- Narration: `.tts` → `.wav` via Colab + Chatterbox only. Audio at `public/audio/<course>/<id>.wav`.
  The recording-stage scripts (`film.mjs`, `thumb-film.mjs`, the Colab notebook, the audio manifest)
  are ported from python-expense-tracker when the first course is narrated.
- The app is JDK only. JUnit arrives with Maven in Course 9.
- `SiteHeader` on the catalog page only.
- The bank's name is Syndica Bank, never a real bank's.

## Working agreement

Author a whole course (scenes, spine, narration), render it, look, then hand over the routes. No
silent scaffolding. Say what was built, verified and left out.
