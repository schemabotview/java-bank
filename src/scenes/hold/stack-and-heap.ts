import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { project } from '../start/tree'
import code from '../../../spine/hold/01-variables/project/Bank.java?raw'
import session from '../../../spine/hold/02-stack-and-heap/session.txt?raw'

// §2 — ◆ side pane: primitives vs references. The editor is 3.1's file; the session is the lab's:
// holder.length() works, balance.length() is refused ("double cannot be dereferenced").
export const holdStackAndHeap: SceneModel = ideFrame({
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
        ['the name holds', 'the value itself', 'an arrow to an object'],
        ['for example', 'int, long, double', 'String, BigDecimal'],
        { id: 'methods', cells: ['has methods', 'no: cannot be dereferenced', 'yes: holder.length()'], tone: 'consume' },
      ],
    },
    { type: 'note', id: 'eight', tone: 'ingest', text: 'Java has eight primitive types. Every other type is a reference to an object on the heap.' },
  ],
  edges: [
    { from: 'frame.holder', to: 'ana' },
    { from: 'frame.bank', to: 'syndica' },
  ],
})
