import type { SceneModel } from '@graphlearning/graphl-flow'
import { lineOf, linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { project } from '../start/tree'
import code from '../../../spine/hold/04-bigdecimal/project/Bank.java?raw'
import session from '../../../spine/hold/04-bigdecimal/session.txt?raw'

// §4 — BigDecimal: an unscaled integer and a scale, so 120.50 keeps its zero and 1.5% of it is
// exactly 1.80750; HALF_EVEN rounds it to cents. The two constructors are the session's.
export const holdBigDecimal: SceneModel = ideFrame2({
  model: 'BigDecimal: digits and a scale',
  tree: project('active'),
  editor: { file: 'Bank.java', code, highlight: [...linesFrom(code, 'BigDecimal balance', 'BigDecimal interest'), lineOf(code, 'setScale')] },
  session,
  side: [
    {
      type: 'table', id: 'scaled', title: 'value = unscaled × 10^-scale', tone: 'ingest', columns: ['value', 'unscaled', 'scale'], rows: [
        { id: 'balance', cells: ['120.50', '12050', '2'], tone: 'store' },
        { id: 'rate', cells: ['0.015', '15', '3'] },
        { id: 'product', cells: ['1.80750', '180750', '5'], tone: 'store' },
        { id: 'cents', cells: ['1.81', '181', '2'], tone: 'store' },
      ],
    },
    {
      type: 'group', id: 'steps', title: 'Interest, exactly', icon: 'zap', tone: 'store', children: [
        { type: 'item', id: 's-mul', title: 'balance.multiply(rate)', sub: 'scales add: 2 + 3 = 5', icon: 'cpu' },
        { type: 'item', id: 's-round', title: 'setScale(2, HALF_EVEN)', sub: 'to cents; a tie goes to the even digit', icon: 'filter' },
      ],
    },
    {
      type: 'table', id: 'built', title: 'Built from …', tone: 'consume', columns: ['new BigDecimal(…)', 'holds'], rows: [
        { id: 'from-double', cells: ['0.1, a double', '0.1000000000000000055…'], tone: 'consume' },
        { id: 'from-string', cells: ['"0.1", a String', '0.1'], tone: 'store' },
      ],
    },
  ],
  edges: [{ from: 'scaled', to: 'steps' }, { from: 's-mul', to: 's-round' }],
})
