import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { files } from './tree'
import code from '../../../spine/model/01-class/project/Account.java?raw'
import session from '../../../spine/model/01-class/session.txt?raw'

// §1 — a class: Account is a blueprint; `new Account()` makes objects, each with its own fields.
// Ben's -420.00 is the session's: nothing yet stops a direct write.
export const modelClass: SceneModel = ideFrame({
  tree: files(['Account.java', 'Bank.java'], 'Account.java', ['Account.java']),
  editor: { file: 'Account.java', code },
  session,
  side: [
    {
      type: 'group', id: 'objects', bare: true, dir: 'row', children: [
        { type: 'table', id: 'cls', title: 'class Account', tone: 'ingest', rows: [['String holder'], ['BigDecimal balance'], ['deposit(amount)']] },
        {
          type: 'group', id: 'heap', title: 'objects, on the heap', icon: 'memory', tone: 'source', children: [
            { type: 'table', id: 'ana', title: 'ana', tone: 'store', columns: ['field', 'value'], rows: [['holder', '"Ana"'], ['balance', '145.60']] },
            { type: 'table', id: 'ben', title: 'ben', tone: 'consume', columns: ['field', 'value'], rows: [['holder', '"Ben"'], ['balance', '-420.00']] },
          ],
        },
      ],
    },
    {
      type: 'table', id: 'terms', title: 'The words', tone: 'ingest', columns: ['word', 'means'], rows: [
        ['class', 'the blueprint: fields and methods'],
        ['object', 'one thing built from it, by new'],
        ['field', 'a variable each object has'],
        ['method', 'code that works on its own object'],
      ],
    },
    { type: 'note', id: 'open', tone: 'consume', text: 'ben.balance = … writes straight into the object. Nothing stops a balance of -420.00.' },
  ],
  edges: [
    { from: 'cls', to: 'heap', label: 'new, twice' },
  ],
})
