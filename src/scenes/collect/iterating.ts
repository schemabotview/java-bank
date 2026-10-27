import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
import { files } from '../model/tree'
import { COLLECT } from './files'
import code from '../../../spine/collect/04-iterating/project/Bank.java?raw'
import session from '../../../spine/collect/04-iterating/session.txt?raw'

// §4 — iterating safely: removing from the map inside a for-each throws
// ConcurrentModificationException (caught here only to show it); the iterator's own remove() works.
export const collectIterating: SceneModel = ideFrame({
  tree: files(COLLECT, 'Bank.java'),
  editor: { file: 'Bank.java', code, ...view(code, 'open("Dee"', 'accounts.keySet())', 0), highlight: [...linesFrom(code, 'for (Account a', 'accounts.remove'), ...linesFrom(code, 'Iterator<Account> it', 'it.remove()')] },
  session,
  side: [
    {
      type: 'group', id: 'broken', title: 'for (Account a : accounts.values()) … remove', icon: 'bell', tone: 'consume', children: [
        { type: 'item', id: 'b-it', title: 'the for-each uses an Iterator', sub: 'it remembers the map\'s change count', icon: 'workflow' },
        { type: 'item', id: 'b-rm', title: 'accounts.remove(…)', sub: 'the map changes behind its back', icon: 'zap' },
        { type: 'item', id: 'b-cme', title: 'next() sees the count moved', sub: 'ConcurrentModificationException', icon: 'bell', tone: 'consume' },
      ],
    },
    {
      type: 'table', id: 'ways', title: 'Removing while you walk', tone: 'ingest', columns: ['way', 'works?'], rows: [
        { id: 'map', cells: ['accounts.remove(…) in a for-each', 'no: the loop breaks'], tone: 'consume' },
        { id: 'it', cells: ['it.remove() on the iterator', 'yes: they stay in step'], tone: 'store' },
      ],
    },
    { type: 'note', id: 'concurrent', tone: 'ingest', text: 'Concurrent here means "while iterating", not threads. With threads, Course 11 needs a different map altogether.' },
  ],
  edges: [
    { from: 'b-it', to: 'b-rm' },
    { from: 'b-rm', to: 'b-cme' },
  ],
})
