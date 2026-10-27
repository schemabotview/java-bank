import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
import { files } from '../model/tree'
import { COLLECT } from './files'
import code from '../../../spine/collect/03-set/project/Bank.java?raw'
import session from '../../../spine/collect/03-set/session.txt?raw'

// §3 — a Set: flagged accounts. add() answers whether it was new (the second SB-0002 is false);
// contains() is one bucket away, not a walk through every element.
export const collectSet: SceneModel = ideFrame({
  tree: files(COLLECT, 'Bank.java'),
  editor: { file: 'Bank.java', code, ...view(code, 'Set<String> flagged', 'SB-0001 flagged', 0), highlight: linesFrom(code, 'flag SB-0002', 'SB-0001 flagged') },
  session,
  side: [
    {
      type: 'table', id: 'adds', title: 'flagged.add(…) answers', tone: 'ingest', columns: ['added', 'answer', 'set'], rows: [
        ['SB-0002', 'true', '1 element'],
        ['SB-0003', 'true', '2 elements'],
        { id: 'dup', cells: ['SB-0002', 'false: already there', '2 elements'], tone: 'consume' },
      ],
    },
    {
      type: 'table', id: 'contains', title: 'contains("SB-0001"), among n accounts', tone: 'ingest', columns: ['in a', 'looks at', 'n = 1,000,000'], rows: [
        { id: 'list', cells: ['List', 'every element, in turn', 'up to a million'], tone: 'consume' },
        { id: 'hashset', cells: ['HashSet', 'one bucket', 'about one'], tone: 'store' },
      ],
    },
    { type: 'note', id: 'order', tone: 'ingest', text: 'A HashSet keeps no order: SB-0003 printed first. A TreeSet keeps its elements sorted, at a small cost on every add.' },
  ],
})
