import type { SceneModel } from '@graphlearning/graphl-flow'
import { lineOf } from '../ide'
import { ideFrame2 } from '../frame'
import { outputOf } from '../lab'
import { files } from '../model/tree'
import { WITH_PAGE } from './files'
import code from '../../../spine/collect/05-generics/project/Page.java?raw'
import session from '../../../spine/collect/05-generics/session.txt?raw'
import wrong from '../../../spine/collect/05b-wrong-type/session.txt?raw'

// §5 — generics: one Page<T> serves entries and accounts; the 05b lab asks for a Page<Account> of
// the ledger, and the compiler refuses (its message read from the lab).
const refusal = outputOf(wrong, 'java Bank.java').split('\n')[0].replace(/^Bank\.java:\d+: error: /, '').replace(/: inference.*/, '')

export const collectGenerics: SceneModel = ideFrame2({
  model: 'TODO',
  tree: files(WITH_PAGE, 'Page.java', ['Page.java']),
  editor: { file: 'Page.java', code, highlight: [lineOf(code, 'record Page<T>'), lineOf(code, 'static <T> Page<T> of')] },
  session,
  side: [
    {
      type: 'group', id: 'one', bare: true, dir: 'row', children: [
        { type: 'item', id: 'tmpl', title: 'Page<T>', sub: 'T: any type, named later', icon: 'layers' },
        {
          type: 'group', id: 'uses', title: 'used as', tone: 'store', children: [
            { type: 'item', id: 'u-entry', title: 'Page<Entry>', sub: 'a statement page', icon: 'file' },
            { type: 'item', id: 'u-acct', title: 'Page<Account>', sub: 'a page of accounts', icon: 'users' },
          ],
        },
      ],
    },
    {
      type: 'table', id: 'checks', title: 'What T buys', tone: 'ingest', columns: ['', 'without generics', 'Page<T>'], rows: [
        ['items() gives', 'Objects: cast them', 'Entries, typed'],
        { id: 'wrong', cells: ['a wrong list', 'a crash, later', 'a compile error'], tone: 'store' },
      ],
    },
  ],
  edges: [{ from: 'tmpl', to: 'uses' }],
})
