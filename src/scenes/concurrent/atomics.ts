import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
import { concurrentTree } from './tree'
import code from '../../../spine/concurrent/04-atomics/project/labs/Counters.java?raw'
import session from '../../../spine/concurrent/04-atomics/session.txt?raw'

// §4 — atomics: a plain long loses increments; AtomicLong (compare-and-swap) and LongAdder (a cell
// per thread) count exactly. The plain counts are read from the volatile session.
const plain = [...session.matchAll(/^plain long:\s+(\d+)$/gm)].map(([, n]) => n)

export const concurrentAtomics: SceneModel = ideFrame({
  tree: concurrentTree('Counters.java', ['Counters.java', 'Tellers.java'], ['Counters.java']),
  editor: { file: 'labs/Counters.java', code, ...view(code, 'void main()', undefined, 0), highlight: linesFrom(code, 'plain++', 'adder.increment()') },
  session,
  side: [
    {
      type: 'group', id: 'cas', title: 'incrementAndGet(): compare-and-swap', icon: 'zap', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 'c-read', title: 'read 41', icon: 'file' },
        { type: 'item', id: 'c-swap', title: 'set 42 if still 41', sub: 'one CPU instruction', icon: 'cpu', tone: 'store' },
        { type: 'item', id: 'c-retry', title: 'changed? try again', icon: 'workflow' },
      ],
    },
    {
      type: 'table', id: 'counts', title: '100 threads × 1000 increments', tone: 'ingest', columns: ['counter', 'run 1', 'run 2'], rows: [
        { id: 'plain', cells: ['plain long', plain[0] ?? '', plain[1] ?? ''], tone: 'consume' },
        { id: 'atomic', cells: ['AtomicLong', '100000', '100000'], tone: 'store' },
        { id: 'adder', cells: ['LongAdder', '100000', '100000'], tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'pick', title: 'Which to use', tone: 'ingest', columns: ['counter', 'best when'], rows: [
        ['AtomicLong', 'you need the value often'],
        { id: 'adder-use', cells: ['LongAdder', 'many threads add, few read'], tone: 'store' },
      ],
    },
    { type: 'note', id: 'opened', tone: 'store', text: "Account's static opened counter had the same flaw. It is an AtomicInteger now, so two accounts can never get one number." },
  ],
  edges: [
    { from: 'c-read', to: 'c-swap' },
    { from: 'c-swap', to: 'c-retry' },
  ],
})
