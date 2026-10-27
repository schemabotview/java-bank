import type { Group, Item, SceneModel, SceneNode } from '@graphlearning/graphl-flow'

// The app map: what the bank is made of, each part tagged with the course that builds it. One scene
// function for every use: 1.2 (nothing built yet), the end of a course (its parts lit), 12.5
// (everything). A part not yet built is drawn muted.
export interface MapPart { id: string; title: string; sub: string; icon: string; course: number; courses?: string }

export const PARTS: MapPart[] = [
  { id: 'm-model', title: 'model', sub: 'Account, Money, Transaction', icon: 'card', course: 5 },
  { id: 'm-bank', title: 'Bank', sub: 'accounts by number, the ledger', icon: 'building', course: 6 },
  { id: 'm-statements', title: 'Statements', sub: 'balances and months, as streams', icon: 'chart', course: 7 },
  { id: 'm-journal', title: 'Journal', sub: 'append-only, replayed on start', icon: 'database', course: 8 },
  { id: 'm-transfers', title: 'TransferService', sub: '10,000 at once, no lost cents', icon: 'zap', course: 11 },
  { id: 'm-api', title: 'api', sub: 'HTTP: accounts and transfers', icon: 'globe', course: 12 },
]
export const AROUND: MapPart[] = [
  { id: 'a-first', title: 'Bank.java', sub: 'one file, the first balance', icon: 'file', course: 2, courses: 'courses 2–4' },
  { id: 'a-maven', title: 'Maven', sub: 'pom.xml → ledger.jar', icon: 'package', course: 9 },
  { id: 'a-trust', title: 'tests and the JVM', sub: 'JUnit, logs, the GC', icon: 'shield', course: 10 },
]

const card = (p: MapPart, built: number): Item =>
  ({ type: 'item', id: p.id, title: `${p.title} · ${p.courses ?? `course ${p.course}`}`, sub: p.sub, icon: p.icon, tone: p.course <= built ? 'store' : 'neutral' })

export function appMap({ title, sub, built, output }: { title: string; sub: string; built: number; output?: SceneNode }): SceneModel {
  const inputs: Group = {
    type: 'group', id: 'inputs', title: 'In', icon: 'users', tone: 'source', children: [
      { type: 'item', id: 'in-tellers', title: 'tellers', sub: 'deposit, withdraw, transfer', icon: 'user' },
      { type: 'item', id: 'in-import', title: 'data/import/*.csv', sub: 'a statement, with bad rows', icon: 'file' },
      { type: 'item', id: 'in-http', title: 'HTTP clients', sub: 'POST /transfers', icon: 'network' },
    ],
  }
  const pkg: Group = {
    type: 'group', id: 'pkg', title: 'ledger', sub: 'Syndica Bank, in Java', icon: 'layers', tone: 'ingest', dir: 'grid', cols: 2,
    children: PARTS.map((p) => card(p, built)),
  }
  const outputs: Group = {
    type: 'group', id: 'outputs', title: 'Out', icon: 'screen', tone: 'store', children: output ? [output] : [
      { type: 'item', id: 'out-statement', title: 'monthly statements', sub: 'every account, every month', icon: 'chart' },
      { type: 'item', id: 'out-journal', title: 'data/journal.csv', sub: 'every transaction, kept', icon: 'database' },
      { type: 'item', id: 'out-json', title: 'JSON responses', sub: 'a retried transfer pays once', icon: 'check' },
    ],
  }
  const around: Group = {
    type: 'group', id: 'around', title: built >= 12 ? 'Made professional' : 'Around the code', icon: 'settings', tone: built >= 10 ? 'store' : 'neutral', dir: 'row',
    children: AROUND.map((p) => card(p, built)),
  }
  return {
    title, sub,
    nodes: [{ type: 'group', id: 'flow', bare: true, dir: 'row', children: [inputs, pkg, outputs] }, around],
    edges: [{ from: 'inputs', to: 'pkg', label: 'requests' }, { from: 'pkg', to: 'outputs', label: 'results' }],
  }
}
