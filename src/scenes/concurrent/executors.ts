import type { SceneModel } from '@graphlearning/graphl-flow'
import { linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { concurrentTree } from './tree'
import code from '../../../spine/concurrent/07-executors/project/labs/Interest.java?raw'
import session from '../../../spine/concurrent/07-executors/session.txt?raw'

// §7 — ExecutorService and Future: 1000 interest calculations as tasks for a pool of 4 workers;
// each submit() returns a Future, and get() waits for its answer.
export const concurrentExecutors: SceneModel = ideFrame2({
  model: 'A pool of workers takes tasks from a queue',
  tree: concurrentTree('Interest.java', ['Counters.java', 'Interest.java', 'Tellers.java', 'Transfers.java'], ['Interest.java'], true),
  editor: { file: 'labs/Interest.java', code, highlight: linesFrom(code, 'try (ExecutorService pool', 'total = total.plus') },
  session,
  side: [
    {
      type: 'group', id: 'pool', title: 'Executors.newFixedThreadPool(4)', icon: 'boxes', tone: 'ingest', children: [
        { type: 'item', id: 'p-tasks', title: '1000 tasks', sub: 'submit(() -> …)', icon: 'layers' },
        { type: 'item', id: 'p-queue', title: 'a queue', sub: 'tasks wait here', icon: 'workflow' },
        { type: 'item', id: 'p-workers', title: '4 worker threads', sub: 'take the next task', icon: 'cpu', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'future', title: 'Future<Money>: an answer, later', tone: 'ingest', columns: ['call', 'does'], rows: [
        ['submit(task)', 'a Future, at once'],
        { id: 'get', cells: ['future.get()', 'waits for it'], tone: 'store' },
        ['try (pool) { … }', 'waits, then stops'],
      ],
    },
    { type: 'table', id: 'result', title: 'The answer', tone: 'store', columns: ['tasks', 'interest due'], rows: [['1000 × 1.5%', '15000.00 EUR']] },
  ],
  edges: [
    { from: 'pool', to: 'future' },
    { from: 'p-tasks', to: 'p-queue' },
    { from: 'p-queue', to: 'p-workers' },
  ],
})
