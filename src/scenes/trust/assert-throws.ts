import type { SceneModel } from '@graphlearning/graphl-flow'
import { linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { view } from '../fold'
import { buildTree } from '../build/tree'
import code from '../../../spine/trust/02-assert-throws/project/src/test/java/ledger/model/AccountTest.java?raw'
import session from '../../../spine/trust/02-assert-throws/session.txt?raw'

// §2 — assertThrows: the overdraft must throw InsufficientFundsException, with the exact message,
// and leave the balance untouched — three claims, one test.
export const trustAssertThrows: SceneModel = ideFrame2({
  model: 'TODO',
  tree: buildTree({ active: 'AccountTest.java', pom: true, output: 'target', tests: ['AccountTest.java'] }),
  editor: { file: 'src/test/java/ledger/model/AccountTest.java', code, ...view(code, 'void anOverdraft', undefined, 0), highlight: linesFrom(code, 'var refused = assertThrows', 'assertEquals(Money.eur("80.00")') },
  session,
  side: [
    {
      type: 'group', id: 'flow', title: 'assertThrows(type, () -> …)', icon: 'shield', tone: 'ingest', children: [
        { type: 'item', id: 'f-run', title: 'runs the lambda', sub: 'ben.withdraw(100.00)', icon: 'zap' },
        { type: 'item', id: 'f-catch', title: 'catches what it throws', sub: 'fails if nothing, or the wrong type', icon: 'filter' },
        { type: 'item', id: 'f-give', title: 'hands the exception back', sub: 'to check its message', icon: 'check', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'claims', title: 'One test, three claims', tone: 'store', columns: ['assert', 'that'], rows: [
        ['assertThrows', 'the overdraft is refused'],
        ['assertEquals(message)', 'it names both amounts'],
        ['assertEquals(balance)', 'nothing was taken: 80.00'],
      ],
    },
  ],
  edges: [
    { from: 'f-run', to: 'f-catch' },
    { from: 'f-catch', to: 'f-give' },
  ],
})
