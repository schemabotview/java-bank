import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { project } from '../start/tree'
import code from '../../../spine/decide/05-for/project/Bank.java?raw'
import session from '../../../spine/decide/05-for/session.txt?raw'

// §5 — for loops: the for-each walks the day's transactions, `amount` rebound on each pass; the
// counted for walks the indexes backwards. Every balance is the session's.
export const decideFor: SceneModel = ideFrame({
  tree: project('active'),
  editor: { file: 'Bank.java', code, highlight: linesFrom(code, 'for (BigDecimal amount', '}') },
  session,
  side: [
    {
      type: 'table', id: 'passes', title: 'for (BigDecimal amount : today)', tone: 'ingest', columns: ['pass', 'amount', 'balance after'], rows: [
        { id: 'p1', cells: ['1', '25.10', '145.60'], tone: 'store' },
        { id: 'p2', cells: ['2', '-40.00', '105.60'], tone: 'consume' },
        { id: 'p3', cells: ['3', '12.99', '118.59'], tone: 'store' },
        { id: 'p4', cells: ['4', '-7.25', '111.34'], tone: 'consume' },
      ],
    },
    {
      type: 'table', id: 'counted', title: 'for (int i = …; i >= 0; i--)', tone: 'ingest', columns: ['part', 'runs', 'here'], rows: [
        ['int i = today.length - 1', 'once, first', 'i starts at 3'],
        ['i >= 0', 'before each pass', 'stop below 0'],
        ['i--', 'after each pass', '3, 2, 1, 0'],
      ],
    },
    { type: 'note', id: 'which', tone: 'store', text: 'Use for-each to visit every element. Use the counted for when the index itself matters: backwards, or every other one.' },
  ],
})
