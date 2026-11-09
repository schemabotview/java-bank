import type { SceneModel } from '@graphlearning/graphl-flow'
import { lineOf } from '../ide'
import { ideFrame2 } from '../frame'
import { view } from '../fold'
import { files } from './tree'
import code from '../../../spine/model/04-static/project/Account.java?raw'
import session from '../../../spine/model/04-static/session.txt?raw'

// §4 — static: ONE counter on the class, shared by every account; each object keeps its own number.
// final fields can be set once, in the constructor. The numbers are the session's.
export const modelStatic: SceneModel = ideFrame2({
  model: 'static: one per class, not per object',
  tree: files(['Account.java', 'Bank.java'], 'Account.java'),
  editor: { file: 'Account.java', code, ...view(code, 'class Account', 'this.number'), highlight: [lineOf(code, 'private static int opened'), lineOf(code, 'opened++'), lineOf(code, 'this.number')] },
  session,
  side: [
    {
      type: 'group', id: 'shared', bare: true, dir: 'row', children: [
        { type: 'table', id: 'cls', title: 'class Account', tone: 'ingest', rows: [{ id: 'opened', cells: ['static opened', '3'], tone: 'store' }] },
        {
          type: 'group', id: 'heap', title: 'three objects', icon: 'memory', tone: 'source', children: [
            { type: 'table', id: 'a1', rows: [['SB-0001', 'Ana']] },
            { type: 'table', id: 'a2', rows: [['SB-0002', 'Ben']] },
            { type: 'table', id: 'a3', rows: [['SB-0003', 'Chen']] },
          ],
        },
      ],
    },
    {
      type: 'table', id: 'kinds', title: 'static or not', tone: 'ingest', columns: ['', 'belongs to', 'called as'], rows: [
        ['opened', 'the class', 'Account.…'],
        ['holder()', 'each object', 'ana.…'],
      ],
    },
  ],
  edges: [{ from: 'cls.opened', to: 'a1' }, { from: 'cls.opened', to: 'a2' }, { from: 'cls.opened', to: 'a3' }],
})
