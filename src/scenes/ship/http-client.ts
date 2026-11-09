import type { SceneModel } from '@graphlearning/graphl-flow'
import { lineOf } from '../ide'
import { ideFrame2 } from '../frame'
import { view } from '../fold'
import { shipTree } from './tree'
import code from '../../../spine/ship/03-http-client/project/labs/Client.java?raw'
import session from '../../../spine/ship/03-http-client/session.txt?raw'

// §3 — HttpClient: the API called from Java. 100 payments of 0.01, each sent twice under its own
// key on virtual threads: Ana's balance falls by exactly 1.00 (both GETs are the session's).
const balances = [...session.matchAll(/"balance": "([^"]+)"/g)].map(([, b]) => b)

export const shipHttpClient: SceneModel = ideFrame2({
  model: 'A retry with the same key pays once',
  tree: shipTree('Client.java', ['Client.java'], ['Client.java', 'Counters.java', 'Interest.java', 'Maps.java', 'Payments.java', 'Tellers.java', 'Transfers.java']),
  editor: { file: 'labs/Client.java', code, ...view(code, 'void main()', 'String get('), highlight: [lineOf(code, 'pool.submit('), lineOf(code, 'pool.submit(', lineOf(code, 'pool.submit(') + 1)] },
  session,
  side: [
    {
      type: 'group', id: 'call', title: 'One call', icon: 'globe', tone: 'ingest', children: [
        { type: 'item', id: 'c-req', title: 'HttpRequest', sub: 'URI, header, body', icon: 'file' },
        { type: 'item', id: 'c-send', title: 'client.send(…)', sub: 'waits: fine on a virtual thread', icon: 'zap' },
        { type: 'item', id: 'c-resp', title: 'HttpResponse', sub: 'status and body', icon: 'check', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'result', title: '200 requests: 100 keys, twice each', tone: 'store', columns: ['', "Ana's balance"], rows: [
        ['before', balances[0] ?? ''],
        { id: 'after', cells: ['after', balances[1] ?? ''], tone: 'store' },
        ['paid', '1.00: once each'],
      ],
    },
    {
      type: 'table', id: 'keys', title: 'Two sends, one key', tone: 'ingest', columns: ['key', '1st send', '2nd send'], rows: [
        ['pay-0', 'pays 0.01', 'stored reply'],
        ['…', '…', '…'],
        ['pay-99', 'pays 0.01', 'stored reply'],
      ],
    },
  ],
  edges: [
    { from: 'call', to: 'result' },
    { from: 'c-req', to: 'c-send' },
    { from: 'c-send', to: 'c-resp' },
  ],
})
