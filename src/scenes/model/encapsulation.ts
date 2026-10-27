import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf } from '../ide'
import { view } from '../fold'
import { files } from './tree'
import code from '../../../spine/model/02-encapsulation/project/Account.java?raw'
import session from '../../../spine/model/02-encapsulation/session.txt?raw'

// §2 — encapsulation: private fields, a constructor to fill them, and methods as the only way in.
// main's direct write no longer compiles (the session's two errors).
export const modelEncapsulation: SceneModel = ideFrame({
  tree: files(['Account.java', 'Bank.java'], 'Account.java'),
  editor: { file: 'Account.java', code, ...view(code, 'class Account', undefined, 0), highlight: [lineOf(code, 'private String holder'), lineOf(code, 'private BigDecimal balance')] },
  session,
  side: [
    {
      type: 'group', id: 'wall', title: 'The invariant wall', icon: 'shield', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 'outside', title: 'Bank.main()', sub: 'outside the class', icon: 'user' },
        { type: 'item', id: 'methods', title: 'deposit, withdraw, balance()', sub: 'the only ways in', icon: 'key', tone: 'store' },
        { type: 'item', id: 'inside', title: 'private balance', sub: 'never below zero', icon: 'lock' },
      ],
    },
    {
      type: 'table', id: 'access', title: 'Who can see a member', tone: 'ingest', columns: ['marked', 'visible to'], rows: [
        { id: 'private', cells: ['private', 'this class only'], tone: 'store' },
        ['(nothing)', 'classes in the same package'],
        ['public', 'every class'],
      ],
    },
    {
      type: 'table', id: 'read', title: 'Read, but never write', tone: 'store', columns: ['method', 'gives back'], rows: [
        ['holder()', 'the holder'],
        ['balance()', 'the balance: a BigDecimal, which cannot be changed'],
      ],
    },
    { type: 'note', id: 'refused', tone: 'consume', text: 'ben.balance = … now fails to compile: balance has private access in Account. withdraw() refuses too much, and nothing else can touch the balance.' },
  ],
  edges: [
    { from: 'outside', to: 'methods' },
    { from: 'methods', to: 'inside' },
  ],
})
