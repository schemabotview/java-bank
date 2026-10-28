#!/usr/bin/env node
// The YouTube thumbnail for the single full-course film (scripts/out/film.mp4).
//
// Not the shell's `graphl-thumb`: that template is a PER-COURSE poster (58% scene + panel), and a
// cropped 16:9 video frame turns to mush at the ~168px the mobile feed actually renders. A film
// cover needs poster grammar — few elements, enormous type, one focal object.
//
// The card is REAL: every line, number and bytecode op is cut out of ONE spine session.txt — the
// same replayed output the scenes use — so the cover cannot promise output the course does not
// produce. A line that is not in that session is a hard error, never a fallback.
//
// One session per card, never mixed. Pasting `javac` above numbers another command printed would
// advertise output that command did not produce: the failure mode this whole script exists to
// avoid.

import { mkdirSync, readFileSync, existsSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join, dirname, isAbsolute } from 'node:path'
import { execFile } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

const run = promisify(execFile)
const repoDir = process.cwd()
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const FFMPEG = ['/opt/homebrew/bin/ffmpeg', '/usr/local/bin/ffmpeg'].find(existsSync) ?? 'ffmpeg'

const SCALE = 2
const W = 1280 * SCALE
const H = 720 * SCALE

// ── the real output ─────────────────────────────────────────────────────────────────────────────
const SESSIONS = {
  jvm:   join(repoDir, 'spine', 'start', '03-what-java-does', 'session.txt'),
  api:   join(repoDir, 'spine', 'ship', '01-http-api', 'session.txt'),
  money: join(repoDir, 'spine', 'hold', '03-cents', 'session.txt'),
}

const linesOf = (f) => readFileSync(f, 'utf8').split('\n').map((l) => l.trimEnd())

/**
 * Cut the whole compile-and-run story out of §2.3 — one session that happens to hold every label
 * the canonical Java picture needs: the source file, the class file javac wrote, the bytecode
 * javap disassembled, what the program printed, and how many classes the JVM loaded to print it.
 */
function realJvm() {
  const L = linesOf(SESSIONS.jvm)
  const cmd = L.find((l) => /^\$ javac /.test(l))
  if (!cmd) throw new Error(`no javac command in ${SESSIONS.jvm}`)
  const src = cmd.replace(/^\$ javac\s+/, '')
  const cls = src.replace(/\.java$/, '.class')
  if (!L.includes(cls)) throw new Error(`javac's output ${cls} is not in the session's ls`)

  // `         0: ldc           #7                  // String Syndica Bank: open`
  const ops = L.flatMap((l) => {
    const m = l.match(/^\s+\d+:\s+(\S+)\s+(#\d+)\s+\/\/\s+(.+)$/)
    return m ? [{ op: m[1], ref: m[2], note: m[3] }] : []
  })
  // The pair that prints: a constant loaded, then the call that consumes it. The invoke must be the
  // one AFTER this ldc — the first invoke in the class is the constructor's `super()`, which has
  // nothing to do with the String beside it.
  const at = ops.findIndex((o) => o.op === 'ldc' && /^String /.test(o.note))
  const ldc = ops[at]
  const call = ops.slice(at + 1).find((o) => /^invoke/.test(o.op))
  if (!ldc || !call) throw new Error('no `ldc String` followed by an invoke in the javap output')
  // `// Method java/lang/IO.println:(Ljava/lang/Object;)V` → `IO.println`
  const callee = (call.note.match(/([A-Za-z]+)\.([A-Za-z]+):/) ?? [, '', call.note]).slice(1, 3).join('.')

  // What `java Bank` printed, in order, up to the next command.
  const i = L.findIndex((l) => new RegExp(`^\\$ java ${src.replace(/\.java$/, '')}$`).test(l))
  if (i < 0) throw new Error(`no plain \`java ${src.replace(/\.java$/, '')}\` run in the session`)
  const out = []
  for (let j = i + 1; j < L.length && !/^\$ /.test(L[j]); j++) if (L[j]) out.push(L[j])
  if (!out.length) throw new Error('the java run printed nothing in the session')

  // `417` — the class+load count, and the two sources the session names.
  const count = L.find((l) => /^\d+$/.test(l))
  if (!count) throw new Error('no class-load count in the session')
  const loaded = L.flatMap((l) => {
    const m = l.match(/^(\S+) source: (\S+)$/)
    return m ? [{ name: m[1], from: m[2] }] : []
  })
  const app = loaded.find((x) => x.from.startsWith('file:'))
  const jdk = loaded.find((x) => x.from.startsWith('jrt:'))
  if (!app || !jdk) throw new Error('the session does not name both a file: and a jrt: class source')

  return { cmd: cmd.replace(/^\$ /, ''), src, cls, ldc, call, callee, out, count, app, jdk }
}

/** Cut the finished service out of §12.1: the real curl, and the JSON the server replied. */
function realApi() {
  const L = linesOf(SESSIONS.api)
  const i = L.findIndex((l) => /^\$ curl .*\/transfers\s*$/.test(l))
  if (i < 0) throw new Error(`no POST to /transfers in ${SESSIONS.api}`)
  const cmd = L[i].replace(/^\$ /, '')
  const reply = L[i + 1]
  if (!reply || !reply.startsWith('{')) throw new Error('the transfer call printed no JSON reply')

  // Every GET on an account, with what the server answered — the balances the transfer moved.
  const gets = []
  for (let j = 0; j < L.length; j++) {
    const m = L[j].match(/^\$ curl -s \S*\/accounts\/(\S+)$/)
    if (!m) continue
    const body = L[j + 1] ?? ''
    const holder = body.match(/"holder":\s*"([^"]+)"/)
    const balance = body.match(/"balance":\s*"([^"]+)"/)
    const error = body.match(/"error":\s*"([^"]+)"/)
    gets.push({ account: m[1], holder: holder?.[1] ?? null, balance: balance?.[1] ?? null, error: error?.[1] ?? null })
  }
  if (!gets.length) throw new Error('no account lookups in the session')
  const paid = reply.match(/"paid":\s*"([^"]+)"/)
  if (!paid) throw new Error('the transfer reply does not name what it paid')
  return { cmd, reply, gets, paid: paid[1] }
}

/**
 * Cut the float surprise out of §3.3 — the two jshell lines everyone's first money bug is made of.
 * jshell echoes a snippet's value as `$N ==> value`, so expression and answer are both the
 * session's own text; nothing is paraphrased.
 */
function realMoney() {
  const L = linesOf(SESSIONS.money)
  const start = L.findIndex((l) => /^\$ jshell/.test(l))
  if (start < 0) throw new Error(`no jshell command in ${SESSIONS.money}`)
  const cmd = L[start].replace(/^\$ /, '')
  const steps = []
  for (let i = start + 1; i < L.length && !/^\$ /.test(L[i]); i++) {
    const m = L[i].match(/^jshell> (.+)$/)
    if (!m || m[1].startsWith('/')) continue
    const echo = (L[i + 1] ?? '').match(/^\$\d+ ==> (.+)$/)
    if (echo) steps.push({ expr: m[1], out: echo[1] })
  }
  const hero = steps.find((s) => /^0\.30{5,}/.test(s.out))
  if (!hero) throw new Error('no float-surprise line (0.1 + 0.2) in the jshell session')
  const fixed = steps.find((s) => s.out === 'false')
  if (!fixed) throw new Error('no `== 0.3` comparison in the jshell session')
  return { cmd, steps, hero, fixed }
}

// ── the page ────────────────────────────────────────────────────────────────────────────────────
const fontFace = (fam, weight, file) => {
  const b64 = readFileSync(join(repoDir, 'node_modules', '@fontsource', fam, 'files', file)).toString('base64')
  return `@font-face{font-family:'${fam === 'ibm-plex-mono' ? 'IBM Plex Mono' : 'IBM Plex Sans'}';`
    + `font-weight:${weight};font-style:normal;font-display:block;`
    + `src:url(data:font/woff2;base64,${b64}) format('woff2')}`
}

// The scene engine's tone palette (@graphlearning/graphl-flow), copied from its dark table — the
// card is dark in every theme, so the dark row is always the right one. Using these instead of
// invented colours means the cover is painted with the same six tones the scenes are.
const TONE = {
  neutral: { accent: '#9aa4b2', tint: '#181b20' },
  ingest:  { accent: '#4f8ff7', tint: '#111d2e' },
  store:   { accent: '#37b877', tint: '#122419' },
  serve:   { accent: '#c98bff', tint: '#1e1428' },
  consume: { accent: '#f0656f', tint: '#2a1416' },
  infra:   { accent: '#f0902f', tint: '#241c12' },
}

// `--brand` in src/theme.css is Java orange #f89820; the dark theme uses it exactly, so the cover
// and the app are the same colour. The other two move it only as far as their ground demands.
const THEMES = {
  dark:  { badgeInk: '#12161c', bg: '#12161c', card: '#1a1d23', ink: '#ffffff', accent: '#f89820',
           rule: 'rgba(255,255,255,.13)', glow: 'radial-gradient(125% 115% at 10% 8%, #3a2a12 0%, #12161c 62%)' },
  ember: { badgeInk: '#140f0a', bg: '#140f0a', card: '#241a12', ink: '#ffffff', accent: '#ffb24d',
           rule: 'rgba(255,255,255,.12)', glow: 'radial-gradient(130% 110% at 86% 14%, #6b3a0c 0%, #140f0a 60%)' },
  light: { badgeInk: '#ffffff', bg: '#f6f4f1', card: '#1a1612', ink: '#17110d', accent: '#c9690f',
           rule: 'rgba(0,0,0,.12)', glow: 'radial-gradient(120% 120% at 10% 8%, #ffffff 0%, #ece6df 70%)' },
}

/**
 * The repo's own mark — NOT the Java steaming-cup logo, and not a cup of our own either. "Java" is
 * an Oracle trademark; Oracle's policy reserves the logo to Oracle and its licensees, and a
 * lookalike cup would be the "confusingly similar" case every trademark policy forbids. Naming the
 * language in the title and the narration is nominative use and is fine; wearing its mark is not.
 *
 * So: a pair of braces. It is the most recognisable thing on a Java screen, it is punctuation, and
 * punctuation belongs to nobody.
 */
function bracesSvg(t, theme) {
  // No tile behind it: a white slab would be the brightest thing on the cover and pull the eye off
  // the headline. The braces sit straight on the background — white on the dark themes, the accent
  // on the light one, where white would vanish.
  const ink = theme === 'light' ? t.accent : '#ffffff'
  // One brace, drawn as a path, then mirrored — so the pair cannot drift out of symmetry.
  const brace = 'M 25 6 C 14 6 16 24 16 27 C 16 30 8 30 8 32 C 8 34 16 34 16 37 C 16 40 14 58 25 58'
  return `<svg class="logo" viewBox="0 0 64 64" role="img" aria-label="Java — GraphL"
    xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="${ink}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
      <path d="${brace}"/>
      <path d="${brace}" transform="translate(64,0) scale(-1,1)"/>
    </g>
  </svg>`
}

/**
 * Duke — the Java mascot — NOT Oracle's steaming-cup logo. Sun open-sourced Duke in 2006 and the
 * artwork lives in the OpenJDK project under BSD-3-Clause, a COPYRIGHT licence that says yes. That
 * is the pandas situation in the sister data-science repo, not the Python/Spark one.
 *
 * It is not retyped here either: graphl-flow bundles the mark as BRAND `openjdk`, carrying its
 * source (the OpenJDK duke repo's `vector/Agent.svg`) and its licence, so the cover draws the same
 * geometry the scenes do. If the engine ever drops it, the render fails rather than inventing one.
 *
 * BSD-3-Clause grants the copyright, not the trademark. Duke still reads as Java's mark, so it is
 * used here illustratively — naming the language the course teaches — and never as this course's
 * own identity, which stays the GraphL wordmark and the FULL COURSE badge.
 */
function dukeSvg(t, theme) {
  const engine = readFileSync(
    join(repoDir, 'node_modules', '@graphlearning', 'graphl-flow', 'dist', 'index.js'), 'utf8')
  const at = engine.indexOf('slug: "openjdk"')
  if (at < 0) throw new Error('graphl-flow no longer bundles the `openjdk` brand mark — check the engine')
  const d = engine.slice(at, at + 4000).match(/path:\s*"([^"]{40,})"/)?.[1]
  if (!d) throw new Error('no path on graphl-flow\'s `openjdk` brand mark')
  // The engine's own rule (BRAND_MIN_CONTRAST): a mark that would vanish against the surface draws
  // in ink instead of its brand colour. Duke's hex is #000000, which disappears on the dark decks.
  const ink = theme === 'light' ? '#000000' : '#ffffff'
  return `<svg class="logo duke" viewBox="0 0 24 24" role="img" aria-label="Duke, the Java mascot"
    xmlns="http://www.w3.org/2000/svg"><path d="${d}" fill="${ink}"/></svg>`
}

const markSvg = (mark, t, theme) => (mark === 'duke' ? dukeSvg(t, theme) : bracesSvg(t, theme))

/**
 * The picture every Java programmer carries in their head — source, compiler, bytecode, JVM — but
 * drawn from THIS session, not copied from a textbook. The file names are javac's, the two ops are
 * javap's own disassembly of this class, the printed lines are what `java Bank` really printed, and
 * the class count and both class sources are the `-Xlog:class+load` run's. So the diagram that says
 * "Java" at a glance is also a true report of the first program in the course.
 */
function jvmSvg(j, t) {
  const VW = 1000, VH = 500
  const mono = 'IBM Plex Mono, monospace'
  const sans = 'IBM Plex Sans, system-ui, sans-serif'

  // Source / bytecode / runtime take the engine's ingest / store / serve tones — the same three a
  // scene uses for "what comes in", "what is kept" and "what runs".
  const SRC = TONE.ingest, CLS = TONE.store, JVM = TONE.serve, INNER = TONE.neutral

  const label = (x, y, s, { size = 27, fill = '#ffffff', weight = 600, family = sans, anchor = 'start' } = {}) =>
    `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}"
       font-family="${family}" text-anchor="${anchor}">${esc(s)}</text>`

  const box = (x, y, w, h, tone, r = 16) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${tone.tint}"
       stroke="${tone.accent}" stroke-width="2.6"/>`

  // Geometry first, so nothing can be nudged into a neighbour: three equal boxes, two equal gaps.
  const GAP = 104
  const CW = (VW - 2 * GAP) / 3
  const BH = 300, TOP = (VH - BH) / 2, MID = TOP + BH / 2
  const colX = [0, CW + GAP, 2 * (CW + GAP)]

  // The step's command rides ABOVE the box row, not inside the gap: the gap is only as wide as the
  // arrow needs, and `java Bank` is wider than that. Above the boxes the row is empty, so a label
  // longer than its gap overlaps nothing.
  const arrow = (x1, x2, text) => {
    const h = 16
    return `<line x1="${x1}" y1="${MID}" x2="${x2}" y2="${MID}" stroke="${TONE.neutral.accent}"
        stroke-width="3" opacity=".7"/>
      <polygon points="${x2},${MID} ${x2 - h},${MID - h * 0.44} ${x2 - h},${MID + h * 0.44}"
        fill="${TONE.neutral.accent}"/>
      ${label((x1 + x2) / 2, TOP - 26, text, { size: 27, family: mono, weight: 400,
        anchor: 'middle', fill: TONE.neutral.accent })}`
  }

  // Title, one subtitle, and an optional inner panel of real output. The panel's type is SIZED to
  // its longest line (IBM Plex Mono advances exactly 0.6em), so a longer line shrinks the block
  // instead of running out of the box — the session's text is never cut to fit.
  const PAD = 22, INNER_PAD = 14
  const card = (x, tone, { title, titleFamily = mono, sub, subFamily = sans, lines = [], lineFill }) => {
    const cx = x + CW / 2
    // Same rule for the subtitle, against a sans advance measured off IBM Plex Sans at weight 400.
    const subSize = Math.min(22, Math.floor((CW - 2 * PAD)
      / ((subFamily === mono ? 0.602 : 0.54) * sub.length)))
    const head = box(x, TOP, CW, BH, tone)
      + label(cx, TOP + (lines.length ? 70 : 150), title,
          { size: 36, family: titleFamily, fill: tone.accent, anchor: 'middle' })
      + label(cx, TOP + (lines.length ? 112 : 194), sub,
          { size: subSize, family: subFamily, weight: 400, anchor: 'middle', fill: 'rgba(255,255,255,.58)' })
    if (!lines.length) return head
    const room = CW - 2 * PAD - 2 * INNER_PAD
    const size = Math.min(26, Math.floor(room / (0.602 * Math.max(...lines.map((l) => l.length)))))
    const h = lines.length > 1 ? 140 : 94
    const y0 = TOP + 150 + (h - (lines.length - 1) * 54) / 2 + size / 3
    return head + box(x + PAD, TOP + 150, CW - 2 * PAD, h, INNER, 12)
      + lines.map((l, i) => label(cx, y0 + i * 54, l,
          { size, family: mono, weight: 400, anchor: 'middle', fill: lineFill })).join('')
  }

  const source = card(colX[0], SRC, { title: j.src, sub: 'the file you write' })
  const bytecode = card(colX[1], CLS, {
    title: j.cls, sub: 'bytecode, not native',
    lines: [`${j.ldc.op} ${j.ldc.ref}`, `${j.call.op} ${j.call.ref}`],
    lineFill: 'rgba(255,255,255,.82)',
  })
  const jvm = card(colX[2], JVM, {
    title: 'JVM', titleFamily: sans, sub: `${j.count} classes loaded`, subFamily: mono,
    lines: j.out.slice(0, 2), lineFill: TONE.store.accent,
  })

  const links = arrow(colX[0] + CW + 6, colX[1] - 10, 'javac')
    + arrow(colX[1] + CW + 6, colX[2] - 10, `java ${j.cls.replace(/\.class$/, '')}`)

  return `<svg class="plot" viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg">${links}${source}${bytecode}${jvm}</svg>`
}

function pageHtml({ jvm, api, money, theme, head1, head2, badge, mark }) {
  const t = THEMES[theme]
  const fonts = [
    fontFace('ibm-plex-sans', 700, 'ibm-plex-sans-latin-700-normal.woff2'),
    fontFace('ibm-plex-sans', 600, 'ibm-plex-sans-latin-600-normal.woff2'),
    fontFace('ibm-plex-mono', 600, 'ibm-plex-mono-latin-600-normal.woff2'),
    fontFace('ibm-plex-mono', 400, 'ibm-plex-mono-latin-400-normal.woff2'),
  ].join('')

  const nRows = api ? api.gets.length : money ? money.steps.length : 0

  // One grid for either table, so every column lines up and nothing can collide.
  const cells = api
    ? api.gets.map((g) => `<span class="k">${esc(g.account)}</span>`
        + `<span class="v">${esc(g.holder ?? '—')}</span>`
        + `<span class="n"${g.error ? ` style="color:${TONE.consume.accent}"` : ''}>`
        + `${esc(g.error ? g.error : g.balance)}</span>`).join('')
    : money
      ? money.steps.map((s) => {
          const hot = s === money.hero
          return `<span class="k">${esc(s.expr)}</span>`
            + `<span class="v">==&gt;</span>`
            + `<span class="n" style="color:${hot ? TONE.consume.accent : t.accent}">${esc(s.out)}</span>`
        }).join('')
      : ''

  return `<style>
  ${fonts}
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:${W}px;height:${H}px;overflow:hidden}
  body{background:${t.bg};background-image:${t.glow};
       font-family:'IBM Plex Sans',system-ui,sans-serif;color:${t.ink};
       display:flex;align-items:stretch;gap:${40 * SCALE}px;padding:${46 * SCALE}px ${50 * SCALE}px}

  .left{flex:0 0 auto;max-width:${540 * SCALE}px;display:flex;flex-direction:column;justify-content:center}
  .logo{width:${96 * SCALE}px;height:${96 * SCALE}px;display:block;margin-bottom:${14 * SCALE}px;
        align-self:flex-start}
  .duke{width:${112 * SCALE}px;height:${112 * SCALE}px;margin-bottom:${6 * SCALE}px;margin-left:${-6 * SCALE}px}
  .h{font-weight:700;line-height:.85;letter-spacing:-.05em;font-size:${116 * SCALE}px;white-space:nowrap}
  .h2{color:${t.accent}}
  .badge{align-self:flex-start;margin-top:${26 * SCALE}px;padding:${11 * SCALE}px ${24 * SCALE}px;
         background:${t.accent};border-radius:${12 * SCALE}px;
         font-weight:700;font-size:${34 * SCALE}px;letter-spacing:.06em;color:${t.badgeInk}}

  .card{flex:1;min-width:0;background:${t.card};border:${1 * SCALE}px solid ${t.rule};
        border-radius:${18 * SCALE}px;padding:${26 * SCALE}px ${30 * SCALE}px ${24 * SCALE}px;
        display:flex;flex-direction:column;box-shadow:0 ${22 * SCALE}px ${64 * SCALE}px rgba(0,0,0,.5)}
  .dots{display:flex;gap:${9 * SCALE}px;margin-bottom:${16 * SCALE}px}
  .dots i{width:${13 * SCALE}px;height:${13 * SCALE}px;border-radius:50%}
  .cmd{font-family:'IBM Plex Mono',monospace;font-size:${25 * SCALE}px;color:rgba(255,255,255,.62);
       margin-bottom:${16 * SCALE}px;white-space:nowrap}
  .cmd b{color:#6ee787;font-weight:400}

  .stat{font-family:'IBM Plex Mono',monospace;font-weight:600;color:#fff;
        font-size:${40 * SCALE}px;letter-spacing:-.02em;white-space:nowrap}
  .stat em{font-style:normal;color:${t.accent}}
  .statsub{font-family:'IBM Plex Mono',monospace;font-size:${25 * SCALE}px;
           color:rgba(255,255,255,.55);margin-top:${6 * SCALE}px;white-space:nowrap}

  .rows{flex:1;display:grid;align-content:center;grid-template-columns:auto auto 1fr;
        column-gap:${20 * SCALE}px;row-gap:${(nRows <= 2 ? 34 : 22) * SCALE}px;
        font-family:'IBM Plex Mono',monospace;font-weight:600;
        font-size:${(nRows <= 2 ? 40 : 32) * SCALE}px;color:#fff}
  .k{letter-spacing:-.02em;color:rgba(255,255,255,.88);white-space:nowrap}
  .v{color:rgba(255,255,255,.45);font-weight:400;white-space:nowrap}
  .n{text-align:right;white-space:nowrap;color:rgba(255,255,255,.9)}
  .foot{font-family:'IBM Plex Mono',monospace;font-size:${23 * SCALE}px;white-space:nowrap;
        color:rgba(255,255,255,.4);letter-spacing:.04em}
  .plotwrap{flex:1;min-height:0;display:flex;margin:${14 * SCALE}px 0 ${10 * SCALE}px}
  .plot{width:100%;height:100%;display:block;overflow:visible}
</style>
<div class="left">
  ${markSvg(mark, t, theme)}
  <div class="h">${esc(head1)}</div>
  ${head2.split(/\s+/).map((w) => `<div class="h h2">${esc(w)}</div>`).join('')}
  <div class="badge">${esc(badge)}</div>
</div>
<div class="card">
  <div class="dots"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i></div>
  <div class="cmd">$ <b>${esc(jvm ? jvm.cmd : api ? api.cmd : money.cmd)}</b></div>
  ${jvm
    ? `<div class="stat"><em>${esc(jvm.src)}</em> → <em>${esc(jvm.cls)}</em> → JVM</div>
       <div class="statsub">${esc(jvm.count)} classes loaded · ${esc(jvm.callee)} from ${esc(jvm.jdk.from)}</div>
       <div class="plotwrap">${jvmSvg(jvm, t)}</div>
       <div class="foot">write once · compiled to bytecode · run by the JVM</div>`
    : api
      ? `<div class="stat">transfer <em>${esc(api.paid)}</em></div>
         <div class="statsub">${esc(api.reply)}</div>
         <div class="rows">${cells}</div>
         <div class="foot">the bank you build · a real HTTP service</div>`
      : `<div class="stat">money is <em>not</em> a double</div>
         <div class="statsub">the first bug every ledger has</div>
         <div class="rows">${cells}</div>
         <div class="foot">jshell · the surprise this course starts from</div>`}
</div>`
}

// ── render ──────────────────────────────────────────────────────────────────────────────────────
async function main() {
  const argv = process.argv.slice(2)
  const opt = { theme: 'dark', out: 'output/thumbnails/film.png', source: 'jvm', mark: 'braces',
                head1: 'LEARN', head2: 'JAVA', badge: 'FULL COURSE' }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--theme') opt.theme = argv[++i]
    else if (a === '--out') opt.out = argv[++i]
    else if (a === '--head1') opt.head1 = argv[++i]
    else if (a === '--head2') opt.head2 = argv[++i]
    else if (a === '--badge') opt.badge = argv[++i]
    else if (a === '--source') opt.source = argv[++i]
    else if (a === '--mark') opt.mark = argv[++i]
    else { console.error(`unknown argument: ${a}`); process.exit(2) }
  }
  if (!THEMES[opt.theme]) { console.error(`unknown theme: ${opt.theme} (have: ${Object.keys(THEMES).join(', ')})`); process.exit(2) }
  if (!['braces', 'duke'].includes(opt.mark)) {
    console.error(`unknown mark: ${opt.mark} (have: braces, duke)`); process.exit(2)
  }
  if (!SESSIONS[opt.source]) {
    console.error(`unknown source: ${opt.source} (have: ${Object.keys(SESSIONS).join(', ')})`); process.exit(2)
  }

  const jvm = opt.source === 'jvm' ? realJvm() : null
  const api = opt.source === 'api' ? realApi() : null
  const money = opt.source === 'money' ? realMoney() : null
  if (jvm) {
    console.log(`Real compile+run from spine: $ ${jvm.cmd}`)
    console.log(`  ${jvm.src} → ${jvm.cls} → ${jvm.count} classes loaded`)
    console.log(`  ${jvm.ldc.op} ${jvm.ldc.ref} // ${jvm.ldc.note}`)
    console.log(`  ${jvm.call.op} ${jvm.call.ref} // ${jvm.call.note}`)
    console.log(`  ${jvm.app.name} from ${jvm.app.from} · ${jvm.jdk.name} from ${jvm.jdk.from}`)
    for (const l of jvm.out) console.log(`  printed: ${l}`)
  } else if (api) {
    console.log(`Real service from spine: $ ${api.cmd}`)
    console.log(`  ${api.reply}`)
    for (const g of api.gets) console.log(`  ${g.account}  ${g.holder ?? '—'}  ${g.balance ?? g.error}`)
  } else {
    console.log(`Real jshell from spine: $ ${money.cmd}`)
    for (const s of money.steps) console.log(`  ${s.expr}  ==>  ${s.out}`)
  }

  const requireFromRepo = createRequire(join(repoDir, 'package.json'))
  const { default: puppeteer } = await import(pathToFileURL(requireFromRepo.resolve('puppeteer')).href)

  const browser = await puppeteer.launch({ headless: true,
    defaultViewport: { width: W, height: H, deviceScaleFactor: 1 }, args: [`--window-size=${W},${H}`] })
  try {
    const page = await browser.newPage()
    await page.setContent(pageHtml({ jvm, api, money, ...opt }), { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    // The real command must appear in full — never truncated — so fit it by shrinking, not cutting.
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('.h,.cmd,.stat,.statsub,.foot,.rows')) {
        const room = el.clientWidth - 1        // the element's OWN content box
        if (el.scrollWidth <= room) continue   // already fits — leave it alone
        const px = parseFloat(getComputedStyle(el).fontSize)
        // one bounded step, never a loop: a loop can chase a width that moves with the font
        el.style.fontSize = `${Math.max(10, Math.floor(px * (room / el.scrollWidth) * 0.98))}px`
      }
    })
    await sleep(250)

    // A thumbnail that silently clips its own text is worse than one that fails loudly.
    const overflow = await page.evaluate(() => {
      const bad = []
      for (const sel of ['.rows', '.card', '.left', 'body']) {
        const el = document.querySelector(sel)
        if (el && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1)) {
          bad.push(`${sel} ${el.scrollWidth}x${el.scrollHeight} > ${el.clientWidth}x${el.clientHeight}`)
        }
      }
      for (const el of document.querySelectorAll('.k,.v,.n,.cmd,.h,.badge,.stat,.statsub')) {
        const r = el.getBoundingClientRect()
        if (r.right > window.innerWidth + 1 || r.bottom > window.innerHeight + 1) {
          bad.push(`clipped: "${el.textContent.trim().slice(0, 20)}" right=${Math.round(r.right)}`)
        }
      }
      return bad
    })
    if (overflow.length) throw new Error(`layout overflows:\n  ${overflow.join('\n  ')}`)

    const out = isAbsolute(opt.out) ? opt.out : join(repoDir, opt.out)
    mkdirSync(dirname(out), { recursive: true })
    const big = join(tmpdir(), `thumb-film-${Date.now()}.png`)
    await page.screenshot({ path: big })
    await run(FFMPEG, ['-y', '-loglevel', 'error', '-i', big, '-vf', 'scale=1280:720:flags=lanczos', out])
    rmSync(big, { force: true })
    console.log(`\n✅ ${out}  (${opt.theme})`)
  } finally {
    await browser.close()
  }
}

main().catch((e) => { console.error('\n✗', e.message); process.exit(1) })
