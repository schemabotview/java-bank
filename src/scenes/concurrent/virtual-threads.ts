import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
import { concurrentTree } from './tree'
import code from '../../../spine/concurrent/09-virtual-threads/project/labs/Payments.java?raw'
import session from '../../../spine/concurrent/09-virtual-threads/session.txt?raw'

// §9 — virtual threads: 10000 payments that each wait 10 ms. A pool of 200 platform threads takes
// them 200 at a time; a virtual thread per task waits all at once. Times are the volatile session's.
const time = (label: string) => session.match(new RegExp(`^${label}:\\s+.* in about (\\d+) ms$`, 'm'))?.[1] ?? ''

export const concurrentVirtualThreads: SceneModel = ideFrame({
  tree: concurrentTree('Payments.java', ['Counters.java', 'Interest.java', 'Maps.java', 'Payments.java', 'Tellers.java', 'Transfers.java'], ['Payments.java'], true),
  editor: { file: 'labs/Payments.java', code, ...view(code, 'void main()', undefined, 0), highlight: [...linesFrom(code, 'var virtual', 'virtual threads:'), ...linesFrom(code, 'Thread.sleep(10)', 'shop.deposit')] },
  session,
  side: [
    {
      type: 'group', id: 'mount', bare: true, dir: 'row', children: [
        {
          type: 'group', id: 'vts', title: '10000 virtual threads', icon: 'layers', tone: 'ingest', dir: 'grid', cols: 2, children: [
            { type: 'item', id: 'v1', title: 'payment 1', icon: 'card', chip: true },
            { type: 'item', id: 'v2', title: 'payment 2', icon: 'card', chip: true },
            { type: 'item', id: 'v3', title: '…', icon: 'card', chip: true },
            { type: 'item', id: 'v4', title: 'payment 10000', icon: 'card', chip: true },
          ],
        },
        { type: 'item', id: 'carriers', title: 'a few carrier threads', sub: 'one per core: 4 here', icon: 'cpu', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'times', title: '10000 payments, 10 ms of waiting each', tone: 'ingest', columns: ['ran on', 'took'], rows: [
        { id: 'plat', cells: ['a pool of 200 platform threads', `about ${time('platform pool of 200')} ms`], tone: 'consume' },
        { id: 'virt', cells: ['a virtual thread per payment', `about ${time('virtual threads')} ms`], tone: 'store' },
      ],
    },
    { type: 'note', id: 'why', tone: 'store', text: 'A virtual thread that waits gives its carrier back. Waiting is nearly free, so ten thousand can wait at once, and the code stays plain blocking code.' },
  ],
  edges: [{ from: 'vts', to: 'carriers', label: 'mounted on' }],
})
