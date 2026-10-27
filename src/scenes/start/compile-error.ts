import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf, terminal } from '../ide'
import { project } from './tree'
import code from '../../../spine/start/05-compile-error/project/Bank.java?raw'
import session from '../../../spine/start/05-compile-error/session.txt?raw'
import semicolon from '../../../spine/start/05b-semicolon/session.txt?raw'

// §5 — a compile error: javac checks every NAME in the file before any of it runs, so line 4, which
// is fine, never prints. The other everyday compile error, a missing `;`, is the 05b lab's real output.
export const startCompileError: SceneModel = ideFrame({
  tree: project('active'),
  editor: { file: 'Bank.java', code, highlight: [lineOf(code, 'prinln')] },
  session,
  side: [
    {
      type: 'group', id: 'check', title: 'Before anything runs', icon: 'search', tone: 'ingest', children: [
        { type: 'item', id: 'c-file', title: 'Bank.java, the whole file', icon: 'file' },
        { type: 'item', id: 'c-javac', title: 'the compiler checks it', sub: 'grammar, then every name and type', icon: 'search' },
        { type: 'item', id: 'c-error', title: 'error at line 6', sub: 'no bytecode, so no line runs', icon: 'bell', tone: 'consume' },
      ],
    },
    {
      type: 'table', id: 'anatomy', title: 'Reading the error', tone: 'consume', columns: ['the terminal says', 'meaning'], rows: [
        ['Bank.java:6: error:', 'where'],
        ['cannot find symbol', 'what is wrong'],
        ['^ under prinln', 'the exact spot'],
        ['symbol: method prinln(String)', 'what it looked for'],
        ['location: class IO', 'where it looked'],
      ],
    },
    { type: 'code', id: 'semicolon', terminal: true, filename: 'the other one: a missing ;', code: terminal(semicolon) },
  ],
  edges: [
    { from: 'c-file', to: 'c-javac' },
    { from: 'c-javac', to: 'c-error' },
  ],
})
