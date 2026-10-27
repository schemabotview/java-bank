import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
import { project } from '../start/tree'
import code from '../../../spine/hold/06-equals/project/Bank.java?raw'
import session from '../../../spine/hold/06-equals/session.txt?raw'

// §6 — == vs equals: strip() builds a second "Ana", so == (the same object?) is false and equals
// (the same text?) is true — the session's two lines.
export const holdEquals: SceneModel = ideFrame({
  tree: project('active'),
  editor: { file: 'Bank.java', code, ...view(code, 'void main'), highlight: linesFrom(code, 'String login', 'Same text') },
  session,
  side: [
    {
      type: 'group', id: 'two', bare: true, dir: 'row', children: [
        { type: 'table', id: 'names', title: 'names', tone: 'ingest', rows: [{ id: 'holder', cells: ['holder', '●'] }, { id: 'login', cells: ['login', '●'] }] },
        {
          type: 'group', id: 'heap', title: 'the heap', icon: 'memory', tone: 'source', children: [
            { type: 'table', id: 'literal', title: 'a String: the literal', rows: [['"Ana"']] },
            { type: 'table', id: 'stripped', title: 'a String: from strip()', rows: [['"Ana"']] },
          ],
        },
      ],
    },
    {
      type: 'table', id: 'compare', title: 'Two questions', tone: 'ingest', columns: ['asked', 'it compares', 'here'], rows: [
        { id: 'same', cells: ['login == holder', 'the arrows', 'false'], tone: 'consume' },
        { id: 'text', cells: ['login.equals(holder)', 'the text', 'true'], tone: 'store' },
      ],
    },
    { type: 'note', id: 'rule', tone: 'consume', text: 'Compare text with equals, always. == can look right with literals, which Java shares in one pool, and then fail on text the program built.' },
  ],
  edges: [
    { from: 'names.holder', to: 'literal' },
    { from: 'names.login', to: 'stripped' },
  ],
})
