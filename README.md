# java-bank

**Learn Java by building a bank.** A GraphL concept app: one application, `ledger`, grows from one
file that prints a balance to a tested, packaged transfer service with an HTTP API. Every Java
feature is taught at the moment the bank needs it, in real, executed code on JDK 25. Scenes render
with `@graphlearning/graphl-flow`; the app shell is `@graphlearning/shell`.

Published as **one video: "Learn Java by building a bank: full course, beginner to professional"**
(~2 h 05 min, 12 courses, 83 sections).

**Status:** being authored course by course (see the table in [`CLAUDE.md`](CLAUDE.md)). Scope, sections and diagrams are in
[`COURSE-PLAN.md`](COURSE-PLAN.md).

## Run it

```sh
npm install
npm run dev          # http://localhost:5173  ·  routes are #/<course>-<section>, or #/<sceneId>
```

## Verify a change

```sh
scripts/install-jdk.sh                                # once: OpenJDK 25.0.4.1 and Maven 3.9.16
npm run build && npx tsc --noEmit && npm run check    # check: content + 4K render
npm run check:spine                                   # replays every step on the pinned JDK
npm run shots -- <course or sceneId>                  # 4K PNGs in out/shots/, then look at them
```

## Layout

```
src/content/<course>/    one file per section + the course index
src/scenes/<course>/     declarative scenes (never x/y)
src/scenes/ide.ts        the one IDE frame every IDE section uses
src/scenes/map.ts        the app map: what the bank is made of, by course
src/scenes/lab.ts        a lab command's real output, for concept scenes
spine/<course>/<step>/   the app as real files, one cumulative snapshot per step
scripts/                 spine.py, install-jdk.sh, check-content, check-render, registry, shots
```
