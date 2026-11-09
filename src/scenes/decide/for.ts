import type { SceneModel } from '@graphlearning/graphl-flow'
import { linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { project } from '../start/tree'
import code from '../../../spine/decide/05-for/project/Bank.java?raw'
import session from '../../../spine/decide/05-for/session.txt?raw'

// §5 — for loops: the for-each walks the day's transactions, `amount` rebound on each pass; the
// counted for walks the indexes backwards. Every balance is the session's.
export const decideFor: SceneModel = ideFrame2({
  model: 'for-each visits every element',
  tree: project('active'),
  editor: { file: 'Bank.java', code, highlight: linesFrom(code, 'for (BigDecimal amount', '}') },
  session,
  side: [
    { type: 'item', id: 'today', title: 'today: a BigDecimal[4]', sub: 'one pass per element, in order', icon: 'layers', tone: 'source' },
    {
      type: 'table', id: 'passes', title: 'for (BigDecimal amount : today)', tone: 'ingest', columns: ['pass', 'amount', 'balance'], rows: [
        { id: 'p1', cells: ['1', '25.10', '145.60'], tone: 'store' },
        { id: 'p2', cells: ['2', '-40.00', '105.60'], tone: 'consume' },
        { id: 'p3', cells: ['3', '12.99', '118.59'], tone: 'store' },
        { id: 'p4', cells: ['4', '-7.25', '111.34'], tone: 'consume' },
      ],
    },
    {
      type: 'table', id: 'counted', title: 'for (int i = …; i >= 0; i--)', tone: 'ingest', columns: ['part', 'runs', 'here'], rows: [
        ['int i = …', 'once', 'i = 3'],
        ['i >= 0', 'each pass', 'until -1'],
        ['i--', 'after each', '3, 2, 1, 0'],
      ],
    },
  ],
  edges: [{ from: 'today', to: 'passes' }],
})
