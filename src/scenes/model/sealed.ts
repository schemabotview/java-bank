import type { SceneModel } from '@graphlearning/graphl-flow'
import { linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { view } from '../fold'
import { outputOf } from '../lab'
import { files } from './tree'
import code from '../../../spine/model/09-sealed/project/Account.java?raw'
import session from '../../../spine/model/09-sealed/session.txt?raw'
import unhandled from '../../../spine/model/09b-unhandled/session.txt?raw'

// §9 — a sealed interface and pattern matching: the switch in apply() takes each record apart and
// needs no default; the 09b lab adds a Fee record and the same switch stops compiling.
const refusal = outputOf(unhandled, 'javac Account.java').split('\n')[0].replace(/^Account\.java:\d+: error: /, '')

export const modelSealed: SceneModel = ideFrame2({
  model: 'A sealed family: the switch must cover it',
  tree: files(['Account.java', 'AccountType.java', 'Bank.java', 'InterestPolicy.java', 'Money.java', 'Promotion.java', 'Transaction.java'], 'Account.java', ['Transaction.java']),
  editor: { file: 'Account.java', code, ...view(code, 'void apply', 'void earnWith', 0), highlight: linesFrom(code, 'case Transaction.Deposit', 'case Transaction.Transfer') },
  session,
  side: [
    {
      type: 'group', id: 'tree', title: 'sealed interface Transaction', icon: 'layers', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 't-dep', title: 'Deposit', sub: '(Money amount)', icon: 'card', tone: 'store' },
        { type: 'item', id: 't-wd', title: 'Withdrawal', sub: '(Money amount)', icon: 'card' },
        { type: 'item', id: 't-tr', title: 'Transfer', sub: '(String to, Money amount)', icon: 'network' },
      ],
    },
    {
      type: 'table', id: 'pattern', title: 'case Transfer(_, Money amount)', tone: 'store', columns: ['part', 'does'], rows: [
        ['…Transfer', 'only a Transfer'],
        ['(_, Money amount)', 'takes it apart'],
        ['-> withdraw(…)', 'uses a piece'],
      ],
    },
    { type: 'item', id: 'fee', title: 'add record Fee: apply() no longer compiles', sub: refusal, icon: 'bell', tone: 'consume' },
  ],
  edges: [{ from: 't-tr', to: 'pattern', label: 'one of exactly three' }],
})
