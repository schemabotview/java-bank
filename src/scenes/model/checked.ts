import type { SceneModel } from '@graphlearning/graphl-flow'
import { linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { outputOf } from '../lab'
import { files } from './tree'
import code from '../../../spine/model/10-checked/project/Bank.java?raw'
import session from '../../../spine/model/10-checked/session.txt?raw'
import unreported from '../../../spine/model/10b-unreported/session.txt?raw'

// §10 — a checked exception: InsufficientFundsException extends Exception, so every caller of
// withdraw() must catch it or declare it; the 10b lab drops main's try and the compiler refuses.
const refusal = outputOf(unreported, 'java Bank.java').split('\n')[0].replace(/^Bank\.java:\d+: error: /, '')

export const modelChecked: SceneModel = ideFrame2({
  model: 'Checked: the compiler makes you plan',
  tree: files(['Account.java', 'AccountType.java', 'Bank.java', 'InsufficientFundsException.java', 'InterestPolicy.java', 'Money.java', 'Promotion.java', 'Transaction.java'], 'Bank.java', ['InsufficientFundsException.java']),
  editor: { file: 'Bank.java', code, highlight: linesFrom(code, 'try {', 'declined') },
  session,
  side: [
    {
      type: 'group', id: 'family', bare: true, dir: 'row', children: [
        {
          type: 'group', id: 'checked', title: 'checked: …Exception', icon: 'shield', tone: 'store', children: [
            { type: 'item', id: 'c-ins', title: 'InsufficientFunds', sub: 'plan for it', icon: 'bell' },
            { type: 'item', id: 'c-io', title: 'IOException', sub: 'a missing file', icon: 'file' },
          ],
        },
        {
          type: 'group', id: 'unchecked', title: 'unchecked', icon: 'bell', tone: 'consume', children: [
            { type: 'item', id: 'u-arg', title: 'IllegalArgument', sub: 'a caller’s bug', icon: 'code' },
            { type: 'item', id: 'u-npe', title: 'NullPointer', sub: 'a bug', icon: 'code' },
          ],
        },
      ],
    },
    {
      type: 'table', id: 'rules', title: 'The compiler checks', tone: 'ingest', columns: ['kind', 'a caller must'], rows: [
        { id: 'chk', cells: ['checked', 'catch or throws'], tone: 'store' },
        { id: 'unchk', cells: ['unchecked', 'nothing'], tone: 'consume' },
      ],
    },
    { type: 'item', id: 'refused', title: 'without the try: no compile', sub: refusal, icon: 'bell', tone: 'consume' },
    {
      type: 'table', id: 'today', title: 'The day, in main()', tone: 'ingest', columns: ['transaction', 'outcome'], rows: [
        ['Withdrawal 40.00', 'done: 80.50'],
        { id: 'declined', cells: ['Transfer 500.00', 'declined, caught'], tone: 'consume' },
        ['Deposit 25.10', 'done: 105.60'],
      ],
    },
  ],
  edges: [
    { from: 'family', to: 'rules' },
    { from: 'rules', to: 'refused' },
  ],
})
