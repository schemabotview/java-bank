import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { files } from './tree'
import code from '../../../spine/model/01-class/project/Account.java?raw'
import session from '../../../spine/model/01-class/session.txt?raw'

// §1 — a class: Account is a blueprint; `new Account()` makes objects, each with its own fields.
// Ben's -420.00 is the session's: nothing yet stops a direct write.
export const modelClass: SceneModel = ideFrame2({
  model: 'A class is a blueprint; new makes objects',
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
        ['class', 'the blueprint'],
        ['object', 'one built by new'],
        ['field', 'each object’s own'],
        ['method', 'works on its object'],
      ],
    },
  ],
  edges: [
    { from: 'cls', to: 'ana' },
    { from: 'cls', to: 'ben' },
  ],
})
