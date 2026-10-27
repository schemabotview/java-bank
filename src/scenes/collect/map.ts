import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf } from '../ide'
import { view } from '../fold'
import { files } from '../model/tree'
import { COLLECT } from './files'
import code from '../../../spine/collect/02-map/project/Bank.java?raw'
import session from '../../../spine/collect/02-map/session.txt?raw'

// §2 — HashMap ◆ side pane: buckets. The bucket of each key is jshell's real answer (hashCode,
// spread, & 15 for a 16-bucket table), read from the session, never typed.
const buckets = [...session.matchAll(/^(SB-\d+): (-?\d+), bucket (\d+)$/gm)].map(([, key, hash, bucket]) => ({ key, hash, bucket }))

export const collectMap: SceneModel = ideFrame({
  tree: files(COLLECT, 'Bank.java'),
  editor: { file: 'Bank.java', code, ...view(code, 'Map<String, Account>', 'accounts.put', 0), highlight: [lineOf(code, 'Map<String, Account>'), lineOf(code, 'accounts.get("SB-0002")'), lineOf(code, 'accounts.put')] },
  session,
  side: [
    {
      type: 'group', id: 'lookup', title: 'accounts.get("SB-0002")', icon: 'search', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 'l-hash', title: 'hashCode()', sub: 'a number from the key', icon: 'key' },
        { type: 'item', id: 'l-bucket', title: 'the bucket', sub: 'one of 16', icon: 'boxes' },
        { type: 'item', id: 'l-eq', title: 'equals()', sub: 'inside that bucket only', icon: 'check', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'buckets', title: 'Where each key lands', tone: 'store', columns: ['key', 'hashCode()', 'bucket'], rows:
        buckets.map((b) => ({ id: b.key, cells: [b.key, b.hash, b.bucket] })),
    },
    {
      type: 'table', id: 'ops', title: 'Asked of the map', tone: 'ingest', columns: ['call', 'answer'], rows: [
        ['get("SB-0002")', "Ben's account"],
        { id: 'missing', cells: ['get("SB-0009")', 'null: no such key'], tone: 'consume' },
        ['keySet()', 'no promised order'],
      ],
    },
  ],
  edges: [
    { from: 'l-hash', to: 'l-bucket' },
    { from: 'l-bucket', to: 'l-eq' },
  ],
})
