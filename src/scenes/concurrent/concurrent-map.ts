import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { concurrentTree } from './tree'
import code from '../../../spine/concurrent/08-concurrent-map/project/labs/Maps.java?raw'
import session from '../../../spine/concurrent/08-concurrent-map/session.txt?raw'

// §8 — ConcurrentHashMap: 100 threads put 10000 keys; a plain HashMap loses some (a different count
// each run, read from the volatile session); ConcurrentHashMap keeps all. Bank's map is one now.
const lost = [...session.matchAll(/^HashMap:\s+(\d+) accounts$/gm)].map(([, n]) => n)

export const concurrentMap: SceneModel = ideFrame({
  tree: concurrentTree('Maps.java', ['Counters.java', 'Interest.java', 'Maps.java', 'Tellers.java', 'Transfers.java'], ['Maps.java'], true),
  editor: { file: 'labs/Maps.java', code, highlight: linesFrom(code, 'Map<String, Integer> plain', 'Map<String, Integer> concurrent') },
  session,
  side: [
    {
      type: 'table', id: 'sizes', title: '10000 puts, from 100 threads', tone: 'ingest', columns: ['map', 'run 1', 'run 2'], rows: [
        { id: 'hm', cells: ['HashMap', lost[0] ?? '', lost[1] ?? ''], tone: 'consume' },
        { id: 'chm', cells: ['ConcurrentHashMap', '10000', '10000'], tone: 'store' },
      ],
    },
    {
      type: 'group', id: 'how', title: 'How ConcurrentHashMap stays right', icon: 'shield', tone: 'store', dir: 'row', children: [
        { type: 'item', id: 'h-empty', title: 'an empty bucket', sub: 'filled by compare-and-swap', icon: 'zap' },
        { type: 'item', id: 'h-full', title: 'a full bucket', sub: 'locked alone, not the map', icon: 'lock' },
      ],
    },
    { type: 'note', id: 'silent', tone: 'consume', text: 'The HashMap threw nothing: two threads wrote into the same bucket at once, and one entry overwrote the other.' },
    { type: 'note', id: 'bank', tone: 'store', text: "Bank's accounts map is a ConcurrentHashMap now: tellers on many threads can open and find accounts at once, and none is lost." },
  ],
})
