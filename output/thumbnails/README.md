# Thumbnails

`film.png` — the thumbnail for the single full-course video (`scripts/out/film.mp4`).
A copy of `film-dark.png`. Rebuild any variant with:

```sh
npm run thumb:film -- --theme dark --source jvm --out output/thumbnails/film-dark.png
```

Variants kept for comparison: `film-dark.png` (shipped), `film-duke.png` (the same cover with
Duke instead of the braces, below), `film-ember.png` (warmer amber), `film-light.png` (stands out
in a dark feed), `film-api.png` and `film-money.png` (the other sources, below).

## The mark: braces today, Duke available

There are **three** different Java marks and they do not have the same answer.

| | answer |
| --- | --- |
| The word "Java" in the title, narration and description | **yes** — nominative use; the customary attribution line is noted below |
| Oracle's steaming-cup Java logo | **no** — Oracle's mark, licensed through Oracle's own programmes; a cup of our own would be the "confusingly similar" case |
| **Duke, the Java mascot** | **yes, with a notice** — Sun open-sourced Duke in 2006 and the artwork lives in the OpenJDK project under **BSD-3-Clause**, a copyright licence that says yes |

`film.png` ships the braces today. `film-duke.png` is the same cover with Duke, one flag away:

```sh
npm run thumb:film -- --mark duke --out output/thumbnails/film.png
```

Duke is not vendored or retyped — `@graphlearning/graphl-flow` bundles him as the BRAND mark
`openjdk` with his source (`hg.openjdk.java.net/duke/.../vector/Agent.svg`) and licence recorded, so
the cover draws the same Duke the scenes do and the render fails if the engine ever drops him. He is
drawn in ink rather than his own `#000000`, which is the engine's own `BRAND_MIN_CONTRAST` rule: a
mark that would vanish against the surface takes the ink colour. **Read `NOTICE-duke.txt` before
publishing with this mark** — BSD-3-Clause asks for the upstream copyright line, and that line has
to be copied from upstream rather than approximated.

At feed size Duke carries more identity than the braces, which read as generic punctuation. That is
the argument for switching; the argument against is that braces need no notice from anyone.

## Why the braces, when we do ship them

The braces are a drawn glyph of our own, outlined, standing straight on the
background with no tile behind it (a white tile would have been the brightest object on the cover
and would have pulled the eye off the headline). It is the most recognisable thing on a Java
screen, it is punctuation, and punctuation belongs to nobody. White on the dark themes, the accent
colour on the light one, where white would vanish.

If the owner wants belt-and-braces attribution, the customary line —
*"Java is a registered trademark of Oracle and/or its affiliates"* — belongs in the video
description, not on the cover. It is **not** in `output/film-description.txt` today; adding it is
one line in `scripts/concept.json`.

**The sister repos answer differently, and correctly so.** python-expense-tracker carries the real
PSF Python logo with its ™ (and a note to ask the PSF before monetising); the data-science repo
carries the pandas logo outright, because pandas publishes it under BSD-3-Clause; spark-ecommerce-
analytics carries no project mark at all, because the ASF permits a project logo essentially only
as a hyperlink to its own site. Copyright and trademark are different questions and every project
answers for itself — do not copy any of these decisions across without reading that project's
policy.

## The three sources, all real

Every line, number and bytecode op on the card is parsed out of **one** spine `session.txt` — the
same replayed output the scenes use. One session per card, never mixed: pasting `javac` above
numbers another command printed would advertise output that command did not produce.

`--source jvm` (default, shipped) renders `spine/start/03-what-java-does/session.txt`, which
happens to hold every label the canonical Java picture needs:

- `javac Bank.java`, and the `Bank.class` the session's own `ls` lists;
- two real ops from `javap -c Bank` — `ldc #7` (the String) and the `invokestatic #9` that consumes
  it. The invoke is the one **after** that `ldc`; the first invoke in the class is the
  constructor's `super()` and has nothing to do with the String beside it;
- what `java Bank` actually printed: `Syndica Bank: open` / `Ana's balance: 120.5`;
- `417` classes loaded, from the real `-Xlog:class+load` run, and the two sources it names —
  `Bank` from `file:/home/ana/ledger/`, `java.lang.IO` from `jrt:/java.base`.

So the diagram every Java programmer already carries in their head — **source → javac → bytecode →
JVM** — is drawn from this course's first program rather than copied from a textbook. The `417` is
the quiet point of the card: printing two lines loaded 417 classes, and the course goes on to show
why.

`--source api` renders `spine/ship/01-http-api/session.txt`: the finished service, its real
`curl -s -d 'from=SB-0001&to=SB-0002&amount=25' localhost:8080/transfers`, the JSON it replied, and
the three account lookups around it — including `SB-0009`, which the server answers with
`no account SB-0009`. The payoff rather than the mechanism; kept if the pipeline underperforms.

`--source money` renders `spine/hold/03-cents/session.txt`: `0.1 + 0.2 ==> 0.30000000000000004` and
`0.1 + 0.2 == 0.3 ==> false`, straight out of jshell. It is the strongest *hook* of the three at
feed size — a long red `0.30000000000000004` still reads at 168px where a table becomes texture —
but it says "floating point", not "Java" and not "bank".

## The colours are the engine's

Nothing on the card is painted with an invented colour. The boxes take their tones from
`@graphlearning/graphl-flow`'s own palette — the same six the scenes use — copied into `TONE` in
`scripts/thumb-film.mjs` (the dark row, since the card is dark in every theme):

| Box | Tone | Accent | Tint |
| --- | --- | --- | --- |
| `Bank.java` — what comes in | `ingest` | `#4f8ff7` | `#111d2e` |
| `Bank.class` — what is kept | `store` | `#37b877` | `#122419` |
| JVM — what runs | `serve` | `#c98bff` | `#1e1428` |
| the inner panels | `neutral` | `#9aa4b2` | `#181b20` |
| what the program printed | `store` | `#37b877` | — |
| the float surprise, the unknown account | `consume` | `#f0656f` | — |

The headline accent is `--brand` from `src/theme.css`, Java orange `#f89820`, unchanged — so the
cover and the app are literally the same colour. `ember` and `light` move it only as far as their
ground demands (`#ffb24d` and `#c9690f`).

## Why not `npm run thumb` (the shell's `graphl-thumb`)

That template is a **per-course** poster: 58% of a scene plus a text panel. A scene is a 16:9 video
frame, and cropped to 58% it turns to unreadable mush at the ~168px wide the YouTube mobile feed
actually renders — the only size that decides a thumbnail. `scripts/thumb-film.mjs` uses poster
grammar instead: few elements, enormous type, one focal object. Every change was checked by
downscaling to 168px, not at 1280px. At that size what survives is LEARN / JAVA, the badge, the
orange `Bank.java → Bank.class → JVM` line, and the blue-green-purple pipeline as a *shape* — which
is the one picture that says "Java" without a word being read.

## Guards

A line that is not in the session is a hard error, never a fallback, so no invented figure can
reach the cover: no `javac`, no `Bank.class` in the `ls`, no `ldc`-then-invoke pair, no class-load
count, or no `file:`/`jrt:` sources and the render **fails**. The renderer also asserts that no
element overflows its box, and text is **shrunk to fit, never truncated** — the long `curl` line,
the jshell table, and the mono lines inside each diagram box, which are sized against IBM Plex
Mono's exact 0.6em advance. The headline splits one word per line and shrinks against the left
column's max width, so a longer concept name cannot push the card off the canvas.
