import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf } from '../ide'
import { project } from './tree'
import code from '../../../spine/start/06-runtime-exception/project/Bank.java?raw'
import session from '../../../spine/start/06-runtime-exception/session.txt?raw'

// §6 — a runtime exception: the file compiles (120 / 0 is legal Java), runs lines 4–6, and fails at
// line 7, so line 8 never prints. The stack trace's two lines are the session's.
export const startRuntimeException: SceneModel = ideFrame({
  tree: project('active'),
  editor: { file: 'Bank.java', code, highlight: [lineOf(code, '120 / 0')] },
  session,
  side: [
    {
      type: 'table', id: 'ran', title: 'This time, it compiles and runs', tone: 'ingest', columns: ['line', 'what happened'], rows: [
        { id: 'r4', cells: ['4 – 6', 'printed'], tone: 'store' },
        { id: 'r7', cells: ['7', 'threw ArithmeticException'], tone: 'consume' },
        { id: 'r8', cells: ['8', 'never ran'] },
      ],
    },
    {
      type: 'group', id: 'trace', title: 'Reading the stack trace', icon: 'search', tone: 'consume', children: [
        { type: 'item', id: 's-thread', title: 'Exception in thread "main"', sub: 'the thread that runs main()', icon: 'cpu' },
        { type: 'item', id: 's-type', title: 'java.lang.ArithmeticException', sub: '/ by zero: what went wrong', icon: 'bell' },
        { type: 'item', id: 's-at', title: 'at Bank.main(Bank.java:7)', sub: 'the method, the file, the line', icon: 'file' },
      ],
    },
    {
      type: 'table', id: 'two', title: 'Two kinds of mistake', tone: 'ingest', columns: ['', 'compile error', 'exception'], rows: [
        ['found by', 'javac', 'the running JVM'],
        ['found when', 'before main() starts', 'at the bad line'],
        ['earlier lines', 'never ran', 'already ran'],
      ],
    },
    { type: 'note', id: 'not-the-end', tone: 'consume', text: 'An uncaught exception ends the program. Course 4 catches them with try and catch, and decides what happens next.' },
  ],
  edges: [
    { from: 's-thread', to: 's-type' },
    { from: 's-type', to: 's-at' },
  ],
})
