import type { SceneModel } from '@graphlearning/graphl-flow'
import { linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { view } from '../fold'
import { project } from '../start/tree'
import code from '../../../spine/decide/03-if-else/project/Bank.java?raw'
import session from '../../../spine/decide/03-if-else/session.txt?raw'

// §3 — if / else: pay out only when the balance covers it. BigDecimal is compared with compareTo,
// because equals also compares the scale (2.0 vs 2.00, the session).
export const decideIfElse: SceneModel = ideFrame2({
  model: 'compareTo picks one path',
  tree: project('active'),
  editor: { file: 'Bank.java', code, ...view(code, 'IO.println(holder', undefined, 0), highlight: linesFrom(code, 'if (withdrawal', '}') },
  session,
  side: [
    {
      type: 'group', id: 'chart', title: 'if (withdrawal.compareTo(balance) > 0)', icon: 'filter', tone: 'ingest', children: [
        { type: 'item', id: 'c-q', title: 'compareTo(…) > 0 ?', sub: 'a boolean: exactly one block runs', icon: 'filter' },
        {
          type: 'group', id: 'paths', bare: true, dir: 'row', children: [
        { type: 'item', id: 'c-yes', title: 'true: refuse', sub: '200.00 > 120.50', icon: 'bell', tone: 'consume' },
        { type: 'item', id: 'c-no', title: 'false: pay out', sub: '40.00, balance 80.50', icon: 'card', tone: 'store' },
          ],
        },
      ],
    },
    {
      type: 'table', id: 'compare', title: 'a.compareTo(b) answers', tone: 'ingest', columns: ['result', 'means'], rows: [
        ['< 0', 'a is smaller'],
        ['0', 'the same amount'],
        { id: 'gt', cells: ['> 0', 'a is larger: refuse'], tone: 'consume' },
      ],
    },
  ],
  edges: [{ from: 'c-q', to: 'c-yes' }, { from: 'c-q', to: 'c-no' }],
})
