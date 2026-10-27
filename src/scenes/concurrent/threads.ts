import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { concurrentTree } from './tree'
import code from '../../../spine/concurrent/01-threads/project/labs/Tellers.java?raw'
import session from '../../../spine/concurrent/01-threads/session.txt?raw'

// §1 — threads: four tellers, each its own thread with its own stack, all sharing one Account on
// the heap; join() waits for each. The result is printed after every thread has finished.
export const concurrentThreads: SceneModel = ideFrame({
  tree: concurrentTree('Tellers.java', ['Tellers.java'], ['Tellers.java']),
  editor: { file: 'labs/Tellers.java', code, highlight: [...linesFrom(code, 'Thread t = new Thread', 't.start()'), ...linesFrom(code, 'for (Thread t : tellers)', 't.join()')] },
  session,
  side: [
    {
      type: 'group', id: 'mem', bare: true, dir: 'row', children: [
        {
          type: 'group', id: 'stacks', title: 'one stack each', icon: 'layers', tone: 'ingest', children: [
            { type: 'item', id: 's-main', title: 'main', icon: 'cpu', chip: true },
            { type: 'item', id: 's-1', title: 'teller-1', icon: 'cpu', chip: true },
            { type: 'item', id: 's-2', title: 'teller-2', icon: 'cpu', chip: true },
            { type: 'item', id: 's-4', title: '… teller-4', icon: 'cpu', chip: true },
          ],
        },
        {
          type: 'group', id: 'heap', title: 'one heap, shared', icon: 'memory', tone: 'source', children: [
            { type: 'table', id: 'ana', title: "Ana's Account", rows: [['before', '1000.00'], ['after', '1004.00']] },
          ],
        },
      ],
    },
    {
      type: 'table', id: 'calls', title: 'A thread\'s life', tone: 'ingest', columns: ['call', 'does'], rows: [
        ['new Thread(() -> …, "teller-1")', 'describes the work: runs nothing'],
        { id: 'start', cells: ['t.start()', 'runs it, beside main'], tone: 'store' },
        ['t.join()', 'main waits until it ends'],
      ],
    },
    { type: 'note', id: 'shared', tone: 'consume', text: 'Each thread has its own stack, but they all share the heap: four threads, one Account. Next, a hundred of them.' },
  ],
  edges: [{ from: 'stacks', to: 'heap', label: 'all deposit into' }],
})
