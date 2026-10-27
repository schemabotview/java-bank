import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf } from '../ide'
import { project } from '../start/tree'
import code from '../../../spine/decide/10-throw/project/Bank.java?raw'
import session from '../../../spine/decide/10-throw/session.txt?raw'

// §10 — throw: deposit and withdraw refuse bad requests by THROWING; main decides what a refusal
// prints. NumberFormatException is a kind of IllegalArgumentException, so it is caught first.
const dep = lineOf(code, 'BigDecimal deposit(')
export const decideThrow: SceneModel = ideFrame({
  tree: project('active'),
  editor: { file: 'Bank.java', code, show: [[19, 24], [dep, lineOf(code, 'is more than') + 1]], highlight: [lineOf(code, 'catch (IllegalArgument'), lineOf(code, 'must be positive'), lineOf(code, 'is more than')] },
  session,
  side: [
    {
      type: 'group', id: 'flow', title: 'deposit -50', icon: 'workflow', tone: 'consume', children: [
        { type: 'item', id: 'f-check', title: 'amount.signum() <= 0', sub: '-50 is negative', icon: 'filter' },
        { type: 'item', id: 'f-throw', title: 'throw new IllegalArgumentException(…)', sub: 'deposit() stops here', icon: 'bell', tone: 'consume' },
        { type: 'item', id: 'f-catch', title: 'catch (IllegalArgumentException e)', sub: 'refused: + e.getMessage()', icon: 'shield', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'family', title: 'One family, caught in order', tone: 'ingest', columns: ['exception', 'is a kind of'], rows: [
        { id: 'nfe', cells: ['NumberFormatException', 'IllegalArgumentException'], tone: 'store' },
        ['IllegalArgumentException', 'RuntimeException'],
      ],
    },
    { type: 'note', id: 'order', tone: 'ingest', text: 'The narrower catch must come first. Swap them, and the compiler refuses: NumberFormatException has already been caught.' },
  ],
  edges: [
    { from: 'f-check', to: 'f-throw' },
    { from: 'f-throw', to: 'f-catch' },
  ],
})
