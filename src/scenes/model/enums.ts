import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { files } from './tree'
import code from '../../../spine/model/05-enums/project/AccountType.java?raw'
import session from '../../../spine/model/05-enums/session.txt?raw'

// §5 — enums: AccountType's two constants are its only instances, each with its terms; a switch over
// it needs no default; valueOf("PREMIUM") throws (the session).
export const modelEnums: SceneModel = ideFrame({
  tree: files(['Account.java', 'AccountType.java', 'Bank.java'], 'AccountType.java', ['AccountType.java']),
  editor: { file: 'AccountType.java', code, highlight: [5, 6] },
  session,
  side: [
    {
      type: 'group', id: 'consts', title: 'enum AccountType: every instance there will ever be', icon: 'boxes', tone: 'ingest', dir: 'row', children: [
        { type: 'table', id: 'checking', title: 'CHECKING', columns: ['term', 'value'], rows: [['monthlyFee', '2.00'], ['monthlyRate', '0'], ['ordinal()', '0']] },
        { type: 'table', id: 'savings', title: 'SAVINGS', tone: 'store', columns: ['term', 'value'], rows: [['monthlyFee', '0'], ['monthlyRate', '0.015'], ['ordinal()', '1']] },
      ],
    },
    {
      type: 'table', id: 'uses', title: 'What an enum gives', tone: 'ingest', columns: ['asked', 'answer'], rows: [
        ['AccountType.values()', 'both, in order'],
        ['switch with no default', 'compiles: every case covered'],
        { id: 'premium', cells: ['valueOf("PREMIUM")', 'IllegalArgumentException'], tone: 'consume' },
      ],
    },
    { type: 'note', id: 'vs-string', tone: 'store', text: 'A String type could be "savngs" and nobody would know. An AccountType can only be one of these two.' },
  ],
})
