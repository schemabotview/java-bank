import type { SceneModel } from '@graphlearning/graphl-flow'
import { outputOf } from '../lab'
import code from '../../../spine/trust/06-gc/project/GcLab.java?raw'
import session from '../../../spine/trust/06-gc/session.txt?raw'

// §6 — ◆ full scene: the heap and the GC. A million entries replayed under -Xmx256m with -Xlog:gc.
// Every number shown is read from the lab's session: they change on every run (a volatile step).
const ran = outputOf(session, 'java -Xmx256m -Xlog:gc:file=gc.log GcLab')
const head = outputOf(session, 'head -4 gc.log')
const pauses = outputOf(session, "grep -c 'Pause Young' gc.log")
const first = head.split('\n')[1] ?? ''
const parts = first.match(/^\[(.*?)\]\[info\]\[gc\] (GC\(\d+\)) (Pause Young \(Normal\)) \(G1 Evacuation Pause\) (\S+) (\S+)$/)

export const trustGc: SceneModel = {
  title: 'The heap and the garbage collector',
  sub: 'a million entries, replayed under -Xmx256m, with -Xlog:gc: HotSpot, G1',
  nodes: [
    {
      type: 'group', id: 'top', bare: true, dir: 'row', children: [
        {
          type: 'group', id: 'lab', badge: 1, title: 'The lab', sub: 'GcLab.java', icon: 'file', tone: 'ingest', children: [
            { type: 'code', id: 'src', filename: 'GcLab.java', lang: 'java', code, highlight: [code.split('\n').findIndex((l) => l.includes('dies young')) + 1, code.split('\n').findIndex((l) => l.includes('lives long')) + 1] },
          ],
        },
        {
          type: 'group', id: 'heap', badge: 2, title: 'The heap, in generations', sub: 'most objects die young', icon: 'memory', tone: 'store', children: [
            {
              type: 'group', id: 'young', title: 'Young', tone: 'store', dir: 'row', children: [
                { type: 'item', id: 'eden', title: 'Eden', sub: 'every new object', icon: 'boxes' },
                { type: 'item', id: 'surv', title: 'Survivor', sub: 'lived through a GC', icon: 'layers' },
              ],
            },
            { type: 'item', id: 'old', title: 'Old', sub: 'lived through several: the entries', icon: 'database' },
          ],
        },
      ],
    },
    {
      type: 'group', id: 'bottom', bare: true, dir: 'row', children: [
        {
          type: 'group', id: 'log', badge: 3, title: 'What G1 did', sub: 'head -4 gc.log', icon: 'activity', tone: 'ingest', children: [
            { type: 'code', id: 'gclog', terminal: true, filename: 'gc.log', code: head },
            {
              type: 'table', id: 'line', columns: ['part', 'of the first pause', 'means'], rows: [
                ['uptime', parts?.[1] ?? '', 'since the JVM started'],
                ['pause', parts?.[3] ?? '', 'a young collection'],
                { id: 'sizes', cells: ['heap', parts?.[4] ?? '', 'used before -> after (size)'], tone: 'store' },
                ['time', parts?.[5] ?? '', 'the program stood still'],
              ],
            },
          ],
        },
        {
          type: 'group', id: 'result', badge: 4, title: 'The run', icon: 'screen', tone: 'store', children: [
            { type: 'code', id: 'out', terminal: true, filename: 'terminal', code: `$ java -Xmx256m -Xlog:gc:file=gc.log GcLab\n${ran}` },
            { type: 'table', id: 'count', rows: [[`${pauses} young pauses`, 'in this run']] },
            { type: 'note', id: 'young-note', text: 'The split strings die in Eden and cost almost nothing. The entries survive and move to Old.' },
          ],
        },
      ],
    },
  ],
  edges: [
    { from: 'lab', to: 'heap', label: 'allocates' },
    { from: 'heap', to: 'log', label: '-Xlog:gc' },
  ],
}
