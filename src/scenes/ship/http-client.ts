import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf } from '../ide'
import { view } from '../fold'
import { shipTree } from './tree'
import code from '../../../spine/ship/03-http-client/project/labs/Client.java?raw'
import session from '../../../spine/ship/03-http-client/session.txt?raw'

// §3 — HttpClient: the API called from Java. 100 payments of 0.01, each sent twice under its own
// key on virtual threads: Ana's balance falls by exactly 1.00 (both GETs are the session's).
const balances = [...session.matchAll(/"balance": "([^"]+)"/g)].map(([, b]) => b)

export const shipHttpClient: SceneModel = ideFrame({
  tree: shipTree('Client.java', ['Client.java'], ['Client.java', 'Counters.java', 'Interest.java', 'Maps.java', 'Payments.java', 'Tellers.java', 'Transfers.java']),
  editor: { file: 'labs/Client.java', code, ...view(code, 'void main()', 'String get('), highlight: [lineOf(code, 'pool.submit('), lineOf(code, 'pool.submit(', lineOf(code, 'pool.submit(') + 1)] },
  session,
  side: [
    {
      type: 'group', id: 'call', title: 'One call', icon: 'globe', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 'c-req', title: 'HttpRequest', sub: 'URI, header, body', icon: 'file' },
        { type: 'item', id: 'c-send', title: 'client.send(…)', sub: 'waits: fine on a virtual thread', icon: 'zap' },
        { type: 'item', id: 'c-resp', title: 'HttpResponse', sub: 'status and body', icon: 'check', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'result', title: '200 requests at once: 100 keys, each sent twice', tone: 'store', columns: ['', "Ana's balance"], rows: [
        ['before', balances[0] ?? ''],
        { id: 'after', cells: ['after', balances[1] ?? ''], tone: 'store' },
        ['paid', '100 × 0.01 = 1.00, once each'],
      ],
    },
    {
      type: 'table', id: 'keys', title: 'Two sends, one key', tone: 'ingest', columns: ['key', 'first send', 'second send'], rows: [
        ['pay-0', 'pays 0.01', 'the stored reply'],
        ['…', '…', '…'],
        ['pay-99', 'pays 0.01', 'the stored reply'],
      ],
    },
    { type: 'note', id: 'end', tone: 'store', text: 'Every layer of the course at once: virtual threads send, the server takes them on virtual threads, keys stop double payments, and the locks keep every cent.' },
  ],
  edges: [
    { from: 'c-req', to: 'c-send' },
    { from: 'c-send', to: 'c-resp' },
  ],
})
