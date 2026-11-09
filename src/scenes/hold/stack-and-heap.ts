import type { SceneModel } from '@graphlearning/graphl-flow'
import { linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { project } from '../start/tree'
import code from '../../../spine/hold/01-variables/project/Bank.java?raw'
import session from '../../../spine/hold/02-stack-and-heap/session.txt?raw'

// §2 — ◆ side pane: primitives vs references. The editor is 3.1's file; the session is the lab's:
// holder.length() works, balance.length() is refused ("double cannot be dereferenced").
export const holdStackAndHeap: SceneModel = ideFrame2({
  model: 'Primitives hold values; references point',
  tree: project('active'),
  editor: { file: 'Bank.java', code, highlight: linesFrom(code, 'String holder', 'double balance') },
  session,
  side: [
    {
      type: 'group', id: 'memory', bare: true, dir: 'row', children: [
        {
          type: 'table', id: 'frame', title: "main()'s frame: the stack", tone: 'ingest', columns: ['name', 'holds'], rows: [
            { id: 'balance', cells: ['balance', '120.5'], tone: 'store' },
            { id: 'accounts', cells: ['accounts', '1'], tone: 'store' },
            { id: 'holder', cells: ['holder', '●'] },
            { id: 'bank', cells: ['bank', '●'] },
          ],
        },
        {
          type: 'group', id: 'heap', title: 'the heap', icon: 'memory', tone: 'source', children: [
            { type: 'table', id: 'ana', title: 'a String', rows: [['"Ana"'], ['length() → 3']] },
            { type: 'table', id: 'syndica', title: 'a String', rows: [['"Syndica Bank"']] },
          ],
        },
      ],
    },
    {
      type: 'table', id: 'kinds', title: 'Two kinds of type', tone: 'ingest', columns: ['', 'primitive', 'reference'], rows: [
        ['holds', 'the value', 'an arrow'],
        ['e.g.', 'int, double', 'String'],
        { id: 'methods', cells: ['methods', 'none', 'holder.length()'], tone: 'consume' },
      ],
    },
  ],
  edges: [
    { from: 'frame.holder', to: 'ana' },
    { from: 'frame.bank', to: 'syndica' },
  ],
})
