import type { SceneModel } from '@graphlearning/graphl-flow'
import { lineOf } from '../ide'
import { ideFrame2 } from '../frame'
import { project } from '../start/tree'
import code from '../../../spine/decide/10-throw/project/Bank.java?raw'
import session from '../../../spine/decide/10-throw/session.txt?raw'

// §10 — throw: deposit and withdraw refuse bad requests by THROWING; main decides what a refusal
// prints. NumberFormatException is a kind of IllegalArgumentException, so it is caught first.
const dep = lineOf(code, 'BigDecimal deposit(')
export const decideThrow: SceneModel = ideFrame2({
  model: 'throw stops; catch decides',
  tree: project('active'),
  editor: { file: 'Bank.java', code, show: [[lineOf(code, 'catch (IllegalArgument'), lineOf(code, 'e.getMessage()')], [lineOf(code, 'amount.signum()'), lineOf(code, 'must be positive')], [lineOf(code, 'amount.compareTo(balance)', dep), lineOf(code, 'is more than')]], highlight: [lineOf(code, 'catch (IllegalArgument'), lineOf(code, 'must be positive'), lineOf(code, 'is more than')] },
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
      type: 'group', id: 'kin', title: 'One family, caught in order', icon: 'layers', tone: 'ingest', children: [
        { type: 'item', id: 'k-nfe', title: 'NumberFormatException', sub: 'caught first: the narrower', icon: 'bell', tone: 'store' },
        { type: 'item', id: 'k-iae', title: 'IllegalArgumentException', sub: 'then the wider one', icon: 'bell' },
        { type: 'item', id: 'k-rte', title: 'RuntimeException', icon: 'bell' },
      ],
    },
  ],
  edges: [
    { from: 'k-nfe', to: 'k-iae', label: 'is a' },
    { from: 'k-iae', to: 'k-rte', label: 'is a' },
    { from: 'f-check', to: 'f-throw' },
    { from: 'f-throw', to: 'f-catch' },
  ],
})
