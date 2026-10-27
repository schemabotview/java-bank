import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { outputOf } from '../lab'
import { shipTree } from './tree'
import code from '../../../spine/ship/04-jlink/project/src/main/java/module-info.java?raw'
import session from '../../../spine/ship/04-jlink/session.txt?raw'

// §4 — configuration and jlink: a runtime with only the modules the bank requires; the port comes
// from -Dledger.port. Modules and sizes are read from the session (sizes: a volatile step).
const modules = outputOf(session, 'runtime/bin/java --list-modules').split('\n')
const sizes = outputOf(session, 'du -sh runtime /usr/lib/jvm/java-25-openjdk-amd64').split('\n').map((l) => l.split(/\s+/))

export const shipJlink: SceneModel = ideFrame({
  tree: shipTree('module-info.java', [], ['Client.java', 'Counters.java', 'Interest.java', 'Maps.java', 'Payments.java', 'Tellers.java', 'Transfers.java'], true),
  editor: { file: 'src/main/java/module-info.java', code, highlight: [3] },
  session,
  side: [
    {
      type: 'group', id: 'link', title: 'jlink --add-modules ledger', icon: 'package', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 'l-graph', title: 'ledger requires …', sub: 'followed to the end', icon: 'workflow' },
        { type: 'item', id: 'l-out', title: 'runtime/', sub: 'a JVM with those modules only', icon: 'boxes', tone: 'store' },
      ],
    },
    { type: 'table', id: 'mods', title: 'runtime/bin/java --list-modules', tone: 'store', columns: ['module'], rows: modules.map((m, i) => ({ id: `m${i}`, cells: [m] })) },
    { type: 'table', id: 'sizes', title: 'du -sh', tone: 'ingest', columns: ['folder', 'size'], rows: sizes.map(([size, path], i) => ({ id: `s${i}`, cells: [path.replace('/usr/lib/jvm/', ''), size], tone: i === 0 ? 'store' as const : undefined })) },
    { type: 'note', id: 'config', tone: 'ingest', text: 'Configuration from outside: -Dledger.port=9090 moves the server, with no new build. The same jar runs on a laptop and in production.' },
  ],
  edges: [{ from: 'l-graph', to: 'l-out' }],
})
