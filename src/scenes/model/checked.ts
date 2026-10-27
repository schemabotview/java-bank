import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { outputOf } from '../lab'
import { files } from './tree'
import code from '../../../spine/model/10-checked/project/Bank.java?raw'
import session from '../../../spine/model/10-checked/session.txt?raw'
import unreported from '../../../spine/model/10b-unreported/session.txt?raw'

// §10 — a checked exception: InsufficientFundsException extends Exception, so every caller of
// withdraw() must catch it or declare it; the 10b lab drops main's try and the compiler refuses.
const refusal = outputOf(unreported, 'java Bank.java').split('\n')[0].replace(/^Bank\.java:\d+: error: /, '')

export const modelChecked: SceneModel = ideFrame({
  tree: files(['Account.java', 'AccountType.java', 'Bank.java', 'InsufficientFundsException.java', 'InterestPolicy.java', 'Money.java', 'Promotion.java', 'Transaction.java'], 'Bank.java', ['InsufficientFundsException.java']),
  editor: { file: 'Bank.java', code, highlight: linesFrom(code, 'try {', 'declined') },
  session,
  side: [
    {
      type: 'group', id: 'family', bare: true, dir: 'row', children: [
        {
          type: 'group', id: 'checked', title: 'checked: extends Exception', icon: 'shield', tone: 'store', children: [
            { type: 'item', id: 'c-ins', title: 'InsufficientFundsException', sub: 'a normal outcome to plan for', icon: 'bell' },
            { type: 'item', id: 'c-io', title: 'IOException', sub: 'a file that will not open', icon: 'file' },
          ],
        },
        {
          type: 'group', id: 'unchecked', title: 'unchecked: RuntimeException', icon: 'bell', tone: 'consume', children: [
            { type: 'item', id: 'u-arg', title: 'IllegalArgumentException', sub: 'a bug in the caller', icon: 'code' },
            { type: 'item', id: 'u-npe', title: 'NullPointerException', sub: 'a bug, full stop', icon: 'code' },
          ],
        },
      ],
    },
    {
      type: 'table', id: 'rules', title: 'The compiler checks', tone: 'ingest', columns: ['kind', 'a caller must'], rows: [
        { id: 'chk', cells: ['checked', 'catch it, or declare throws'], tone: 'store' },
        { id: 'unchk', cells: ['unchecked', 'nothing: it may just crash'], tone: 'consume' },
      ],
    },
    {
      type: 'table', id: 'today', title: 'The day, in main()', tone: 'ingest', columns: ['transaction', 'outcome'], rows: [
        ['Withdrawal 40.00', 'done: 80.50'],
        { id: 'declined', cells: ['Transfer 500.00', 'declined, caught'], tone: 'consume' },
        ['Deposit 25.10', 'done: 105.60'],
      ],
    },
    { type: 'note', id: 'refused', tone: 'consume', text: `Without the try, main does not compile: ${refusal}.` },
  ],
})
