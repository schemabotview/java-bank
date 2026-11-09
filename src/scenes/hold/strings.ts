import type { SceneModel } from '@graphlearning/graphl-flow'
import { lineOf } from '../ide'
import { ideFrame2 } from '../frame'
import { project } from '../start/tree'
import code from '../../../spine/hold/05-strings/project/Bank.java?raw'
import session from '../../../spine/hold/05-strings/session.txt?raw'

// §5 — strings: indexed characters, and immutable — toUpperCase() makes a NEW String; holder still
// reads "Ana" afterwards (the session). substring(3) is "0001".
export const holdStrings: SceneModel = ideFrame2({
  model: 'Indexed, and immutable',
  tree: project('active'),
  editor: { file: 'Bank.java', code, highlight: [lineOf(code, 'String account'), lineOf(code, '.formatted(')] },
  session,
  side: [
    {
      type: 'table', id: 'cells', title: 'account: characters by index, and substring(3)', tone: 'ingest', columns: ['0', '1', '2', '3', '4', '5', '6'], rows: [
        ['S', 'B', '-', '0', '0', '0', '1'],
        { id: 'sub', cells: ['', '', '', '↑', '↑', '↑', '↑'], tone: 'store' },
      ],
    },
    {
      type: 'group', id: 'immutable', bare: true, dir: 'row', children: [
        { type: 'table', id: 'names', title: 'names', tone: 'ingest', rows: [{ id: 'holder', cells: ['holder', '●'] }] },
        {
          type: 'group', id: 'heap', title: 'the heap', icon: 'memory', tone: 'source', children: [
            { type: 'table', id: 'ana', title: 'a String', rows: [['"Ana"']] },
            { type: 'table', id: 'upper', title: 'a NEW String', tone: 'store', rows: [['"ANA"']] },
          ],
        },
      ],
    },
  ],
  edges: [
    { from: 'names.holder', to: 'ana' },
    { from: 'ana', to: 'upper', label: 'toUpperCase()' },
  ],
})
