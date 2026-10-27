import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { files } from './tree'
import code from '../../../spine/model/07-equals/project/Bank.java?raw'
import session from '../../../spine/model/07-equals/session.txt?raw'

// §7 — equals and hashCode: an Account is an ENTITY (equal only to itself), Money a VALUE (equal by
// what it holds). jshell's Key vs RKey: a class without equals counts one key twice in a HashSet.
export const modelEquals: SceneModel = ideFrame({
  tree: files(['Account.java', 'AccountType.java', 'Bank.java', 'Money.java'], 'Bank.java'),
  editor: { file: 'Bank.java', code, highlight: linesFrom(code, 'Set<Money> amounts', 'distinct amounts') },
  session,
  side: [
    {
      type: 'table', id: 'kinds', title: 'Two kinds of object', tone: 'ingest', columns: ['', 'entity: Account', 'value: Money'], rows: [
        ['equal when', 'it is the same object', 'it holds the same thing'],
        ['here', 'Ana ≠ her twin: false', '10 = 10.00: true'],
        ['equals from', 'Object: identity', 'the record: its fields'],
      ],
    },
    {
      type: 'table', id: 'set', title: 'Two equal keys in a HashSet', tone: 'consume', columns: ['type', 'size'], rows: [
        { id: 'key', cells: ['class Key, no equals', '2: a duplicate'], tone: 'consume' },
        { id: 'rkey', cells: ['record RKey', '1'], tone: 'store' },
      ],
    },
    {
      type: 'group', id: 'hash', title: 'How a HashSet looks', icon: 'search', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 'h-code', title: 'hashCode()', sub: 'picks the bucket', icon: 'key' },
        { type: 'item', id: 'h-eq', title: 'equals()', sub: 'checks inside it', icon: 'check' },
      ],
    },
    { type: 'note', id: 'contract', tone: 'consume', text: 'Override equals and you must override hashCode, so equal objects land in the same bucket. A record writes both.' },
  ],
  edges: [{ from: 'h-code', to: 'h-eq' }],
})
