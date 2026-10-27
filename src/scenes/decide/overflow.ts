import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
import { project } from '../start/tree'
import code from '../../../spine/decide/02-overflow/project/Bank.java?raw'
import session from '../../../spine/decide/02-overflow/session.txt?raw'

// §2 — integer overflow: 3,000,000,000 cents does not fit in an int's 32 bits, so it wraps to a
// negative number silently; a long holds it; Math.addExact refuses (the session).
export const decideOverflow: SceneModel = ideFrame({
  tree: project('active'),
  editor: { file: 'Bank.java', code, ...view(code, 'void main'), highlight: linesFrom(code, 'int deposit', 'as a long') },
  session,
  side: [
    {
      type: 'group', id: 'wheel', title: 'An int is a 32-bit wheel', icon: 'cpu', tone: 'consume', children: [
        { type: 'item', id: 'w-max', title: '2,147,483,647', sub: 'Integer.MAX_VALUE: the top of the wheel', icon: 'chart' },
        { type: 'item', id: 'w-plus', title: '+ 1', sub: 'one more step round', icon: 'zap' },
        { type: 'item', id: 'w-min', title: '-2,147,483,648', sub: 'Integer.MIN_VALUE: round to the bottom', icon: 'bell', tone: 'consume' },
      ],
    },
    {
      type: 'table', id: 'answers', title: '1,500,000,000 + 1,500,000,000', tone: 'ingest', columns: ['as', 'answer'], rows: [
        { id: 'int', cells: ['int', '-1294967296, silently'], tone: 'consume' },
        { id: 'long', cells: ['long', '3000000000'], tone: 'store' },
        { id: 'exact', cells: ['Math.addExact', 'ArithmeticException'], tone: 'store' },
      ],
    },
    { type: 'note', id: 'rule', tone: 'consume', text: 'An int counts to about 21 million euros in cents. A long reaches 92 quadrillion: count money in long, or in BigDecimal.' },
  ],
  edges: [
    { from: 'w-max', to: 'w-plus' },
    { from: 'w-plus', to: 'w-min' },
  ],
})
