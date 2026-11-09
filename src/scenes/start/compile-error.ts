import type { SceneModel } from '@graphlearning/graphl-flow'
import { lineOf, terminal } from '../ide'
import { ideFrame2 } from '../frame'
import { project } from './tree'
import code from '../../../spine/start/05-compile-error/project/Bank.java?raw'
import session from '../../../spine/start/05-compile-error/session.txt?raw'
import semicolon from '../../../spine/start/05b-semicolon/session.txt?raw'

// §5 — a compile error: javac checks every NAME in the file before any of it runs, so line 4, which
// is fine, never prints. The other everyday compile error, a missing `;`, is the 05b lab's real output.
export const startCompileError: SceneModel = ideFrame2({
  model: 'javac checks the whole file first',
  tree: project('active'),
  editor: { file: 'Bank.java', code, highlight: [lineOf(code, 'prinln')] },
  session,
  side: [
    {
      type: 'group', id: 'check', title: 'Before anything runs', icon: 'search', tone: 'ingest', children: [
        { type: 'item', id: 'c-file', title: 'Bank.java, the whole file', icon: 'file' },
        { type: 'item', id: 'c-javac', title: 'the compiler checks it', sub: 'grammar, then names and types', icon: 'search' },
        { type: 'item', id: 'c-error', title: 'error at line 6', sub: 'no bytecode, so no line runs', icon: 'bell', tone: 'consume' },
      ],
    },
    {
      type: 'table', id: 'anatomy', title: 'Reading the error', tone: 'consume', columns: ['the terminal says', 'meaning'], rows: [
        ['Bank.java:6: error:', 'where'],
        ['cannot find symbol', 'what'],
        ['^ under prinln', 'the spot'],
        ['symbol: method prinln…', 'sought'],
        ['location: class IO', 'looked in'],
      ],
    },
    { type: 'code', id: 'semicolon', terminal: true, filename: 'the other one: a missing ;', code: terminal(semicolon) },
  ],
  edges: [
    { from: 'c-file', to: 'c-javac' },
    { from: 'c-javac', to: 'c-error' },
  ],
})
