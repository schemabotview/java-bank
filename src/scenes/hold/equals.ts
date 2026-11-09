import type { SceneModel } from '@graphlearning/graphl-flow'
import { linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { view } from '../fold'
import { project } from '../start/tree'
import code from '../../../spine/hold/06-equals/project/Bank.java?raw'
import session from '../../../spine/hold/06-equals/session.txt?raw'

// §6 — == vs equals: strip() builds a second "Ana", so == (the same object?) is false and equals
// (the same text?) is true — the session's two lines.
export const holdEquals: SceneModel = ideFrame2({
  model: '== compares arrows; equals compares text',
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
      type: 'table', id: 'compare', title: 'Two questions', tone: 'ingest', columns: ['asked', 'compares', 'here'], rows: [
        { id: 'same', cells: ['login == holder', 'arrows', 'false'], tone: 'consume' },
        { id: 'text', cells: ['login.equals(holder)', 'text', 'true'], tone: 'store' },
      ],
    },
  ],
  edges: [
    { from: 'names.holder', to: 'literal' },
    { from: 'names.login', to: 'stripped' },
  ],
})
