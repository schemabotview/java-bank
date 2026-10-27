import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf, linesFrom } from '../ide'
import { shipTree } from './tree'
import code from '../../../spine/ship/02-idempotency/project/src/main/java/ledger/Server.java?raw'
import session from '../../../spine/ship/02-idempotency/session.txt?raw'

// §2 — idempotency keys: the same transfer sent twice pays twice; sent twice with one key, it pays
// once and both replies match. Ana's balances are the session's.
const after = [...session.matchAll(/"SB-0001": "([^"]+)"/g)].map(([, b]) => b)

export const shipIdempotency: SceneModel = ideFrame({
  tree: shipTree('Server.java'),
  editor: { file: 'src/main/java/ledger/Server.java', code, show: [[lineOf(code, '// Idempotency-Key'), lineOf(code, 'final Map<String, Reply> done')], [lineOf(code, 'void transfer('), lineOf(code, 'send(ex, reply)') + 1]], highlight: linesFrom(code, 'String key = ex.getRequestHeaders()', 'done.computeIfAbsent') },
  session,
  side: [
    {
      type: 'table', id: 'sent', title: 'One transfer of 25.00, sent four times', tone: 'ingest', columns: ['sent', 'Ana after', ''], rows: [
        ['no key', after[0] ?? '', 'paid'],
        { id: 'twice', cells: ['no key, a retry', after[1] ?? '', 'PAID AGAIN'], tone: 'consume' },
        ['key t-7', after[2] ?? '', 'paid'],
        { id: 'once', cells: ['key t-7, a retry', after[3] ?? '', 'the same reply'], tone: 'store' },
      ],
    },
    {
      type: 'group', id: 'map', title: 'done: key → reply', icon: 'key', tone: 'store', dir: 'row', children: [
        { type: 'item', id: 'k-new', title: 'a new key', sub: 'pay(), store the reply', icon: 'zap' },
        { type: 'item', id: 'k-seen', title: 'a key seen before', sub: 'the stored reply, no payment', icon: 'shield', tone: 'store' },
      ],
    },
    { type: 'note', id: 'why', tone: 'consume', text: 'A network can lose the reply after the money moved. The client cannot know, so it retries. Without a key, every retry is another payment.' },
  ],
  edges: [{ from: 'k-new', to: 'k-seen', label: 'then' }],
})
