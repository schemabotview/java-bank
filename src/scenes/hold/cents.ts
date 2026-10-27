import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf } from '../ide'
import { project } from '../start/tree'
import code from '../../../spine/hold/03-cents/project/Bank.java?raw'
import session from '../../../spine/hold/03-cents/session.txt?raw'

// §3 — why money is not a double: 0.1 + 0.2 != 0.3 (the session), then cents in a long: exact
// for adding, but integer division drops the 0.75 of a cent the interest is owed (180, not 180.75).
export const holdCents: SceneModel = ideFrame({
  tree: project('active'),
  editor: { file: 'Bank.java', code, highlight: [lineOf(code, 'long balanceCents'), lineOf(code, 'Interest in cents')] },
  session,
  side: [
    {
      type: 'group', id: 'binary', title: 'Why 0.1 is not 0.1', icon: 'cpu', tone: 'consume', children: [
        { type: 'item', id: 'b-dec', title: '0.1, in decimal', sub: 'one tenth: exact', icon: 'file' },
        { type: 'item', id: 'b-bin', title: '0.000110011001100…, in binary', sub: 'the 1100 repeats forever', icon: 'workflow' },
        { type: 'item', id: 'b-double', title: 'a double keeps 53 binary digits', sub: 'the nearest value, not 0.1', icon: 'boxes' },
      ],
    },
    {
      type: 'table', id: 'asked', title: 'Asked in jshell', tone: 'consume', columns: ['typed', 'answer'], rows: [
        ['0.1 + 0.2', '0.30000000000000004'],
        ['0.1 + 0.2 == 0.3', 'false'],
      ],
    },
    {
      type: 'table', id: 'long', title: 'Cents in a long', tone: 'ingest', columns: ['', 'in cents', 'exact?'], rows: [
        { cells: ['the balance', '12050', 'yes'], tone: 'store' },
        { cells: ['adding, subtracting', 'whole numbers', 'yes'], tone: 'store' },
        { id: 'interest', cells: ['12050 × 15 / 1000', '180', 'no: 180.75'], tone: 'consume' },
      ],
    },
  ],
  edges: [
    { from: 'b-dec', to: 'b-bin' },
    { from: 'b-bin', to: 'b-double' },
  ],
})
