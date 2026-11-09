import type { SceneModel } from '@graphlearning/graphl-flow'
import { lineOf } from '../ide'
import { ideFrame2 } from '../frame'
import { project } from './tree'
import code from '../../../spine/start/02-bank/project/Bank.java?raw'
import session from '../../../spine/start/02-bank/session.txt?raw'

// §2 — Bank.java, run with `java Bank.java`: the launcher
// compiles the file in memory and runs main(). 120.50 prints as 120.5: a double keeps the number,
// not how it was typed — the first hint that money is not a double (3.3).
export const startBank: SceneModel = ideFrame2({
  model: 'java compiles the file, then runs main()',
  tree: project('new'),
  editor: { file: 'Bank.java', code, highlight: [lineOf(code, 'open'), lineOf(code, 'balance')] },
  session,
  side: [
    {
      type: 'group', id: 'run', title: 'java Bank.java', icon: 'terminal', tone: 'ingest', children: [
        { type: 'item', id: 'run-file', title: 'Bank.java', sub: 'a compact source file', icon: 'file' },
        { type: 'item', id: 'run-java', title: 'java', sub: 'compiles it in memory, runs main()', icon: 'cpu' },
        { type: 'item', id: 'run-term', title: 'the terminal', sub: 'where IO.println writes', icon: 'screen' },
      ],
    },
    {
      type: 'table', id: 'lines', title: 'Line by line', tone: 'ingest', columns: ['line', 'what happens'], rows: [
        { id: 'l1', cells: ['1', 'a comment: skipped'] },
        { id: 'l3', cells: ['3', 'main(): the start'] },
        { id: 'l4', cells: ['4', 'prints the banner'], tone: 'store' },
        { id: 'l5', cells: ['5', 'prints the balance'], tone: 'store' },
        { id: 'l6', cells: ['6', 'main() ends: so does it'] },
      ],
    },
    {
      type: 'table', id: 'args', title: 'Line 5 joins two values', tone: 'store', columns: ['value', 'type', 'printed as'], rows: [
        ['"Ana\'s balance: "', 'String', 'as typed'],
        { id: 'amount', cells: ['120.50', 'double', '120.5'], tone: 'consume' },
      ],
    },
  ],
  edges: [
    { from: 'run-file', to: 'run-java' },
    { from: 'run-java', to: 'run-term' },
    { from: 'run', to: 'lines' },
  ],
})
