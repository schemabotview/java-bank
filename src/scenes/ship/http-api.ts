import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
import { shipTree } from './tree'
import code from '../../../spine/ship/01-http-api/project/src/main/java/ledger/Server.java?raw'
import session from '../../../spine/ship/01-http-api/session.txt?raw'

// §1 — an HTTP API on the JDK's own server (module jdk.httpserver), one virtual thread per request.
// Every response is the session's curl output.
export const shipHttpApi: SceneModel = ideFrame({
  tree: shipTree('Server.java', ['Server.java', 'serve']),
  editor: { file: 'src/main/java/ledger/Server.java', code, ...view(code, 'void main()', 'static String json', 0), highlight: linesFrom(code, 'HttpServer http = HttpServer.create', 'http.start()') },
  session,
  side: [
    {
      type: 'group', id: 'flow', title: 'GET /accounts/SB-0001', icon: 'globe', tone: 'ingest', children: [
        { type: 'item', id: 'f-curl', title: 'curl', sub: 'any HTTP client, anywhere', icon: 'terminal' },
        { type: 'item', id: 'f-server', title: 'HttpServer :8080', sub: 'a virtual thread per request', icon: 'server' },
        { type: 'item', id: 'f-handler', title: 'account(exchange)', sub: 'finds the Account', icon: 'code' },
        { type: 'item', id: 'f-json', title: 'a JSON reply', sub: '200, or 404 for SB-0009', icon: 'file', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'routes', title: 'The API', tone: 'ingest', columns: ['request', 'reply'], rows: [
        ['GET /accounts/{number}', 'the account, or 404'],
        { id: 'post', cells: ['POST /transfers', 'paid, or 409 declined'], tone: 'store' },
      ],
    },
    { type: 'note', id: 'journal', tone: 'store', text: "Every transfer is two journal lines. The journal now flushes each line: a server is stopped, not closed, and 8.3's buffer would be lost." },
  ],
  edges: [
    { from: 'f-curl', to: 'f-server' },
    { from: 'f-server', to: 'f-handler' },
    { from: 'f-handler', to: 'f-json' },
  ],
})
