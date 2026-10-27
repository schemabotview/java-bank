import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { concurrentTree } from './tree'
import code from '../../../spine/concurrent/07-executors/project/labs/Interest.java?raw'
import session from '../../../spine/concurrent/07-executors/session.txt?raw'

// §7 — ExecutorService and Future: 1000 interest calculations as tasks for a pool of 4 workers;
// each submit() returns a Future, and get() waits for its answer.
export const concurrentExecutors: SceneModel = ideFrame({
  tree: concurrentTree('Interest.java', ['Counters.java', 'Interest.java', 'Tellers.java', 'Transfers.java'], ['Interest.java'], true),
  editor: { file: 'labs/Interest.java', code, highlight: linesFrom(code, 'try (ExecutorService pool', 'total = total.plus') },
  session,
  side: [
    {
      type: 'group', id: 'pool', title: 'Executors.newFixedThreadPool(4)', icon: 'boxes', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 'p-tasks', title: '1000 tasks', sub: 'submit(() -> …)', icon: 'layers' },
        { type: 'item', id: 'p-queue', title: 'a queue', sub: 'tasks wait here', icon: 'workflow' },
        { type: 'item', id: 'p-workers', title: '4 worker threads', sub: 'take the next task', icon: 'cpu', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'future', title: 'Future<Money>: an answer, later', tone: 'ingest', columns: ['call', 'does'], rows: [
        ['pool.submit(task)', 'returns at once, with a Future'],
        { id: 'get', cells: ['future.get()', 'waits for the answer'], tone: 'store' },
        ['try (pool) { … }', 'close(): waits, then stops the workers'],
      ],
    },
    { type: 'table', id: 'result', title: 'The answer', tone: 'store', columns: ['tasks', 'interest due'], rows: [['1000 × 1000.00 at 1.5%', '15000.00 EUR']] },
    { type: 'note', id: 'why', tone: 'store', text: 'Four threads for a thousand jobs, not a thousand threads: a platform thread is expensive, so a pool reuses a few.' },
  ],
  edges: [
    { from: 'p-tasks', to: 'p-queue' },
    { from: 'p-queue', to: 'p-workers' },
  ],
})
