import type { SceneModel } from '@graphlearning/graphl-flow'

// §5 — where next: each part of Syndica Bank, beside the tool that does the same job at scale. A
// concept scene: nothing is run, so it shows no output.
const pairs: [string, string, string, string, string, string][] = [
  ['p-api', 'Server: JDK HttpServer', 'request → handler → JSON', 't-spring', 'Spring Boot', 'routing, JSON, validation, security'],
  ['p-journal', 'Journal: a CSV file', 'append-only, replayed on start', 't-kafka', 'Apache Kafka', 'an event log many services read'],
  ['p-store', 'accounts in a Map', 'rebuilt from the journal', 't-db', 'PostgreSQL, through JPA', 'transactions, queries, indexes'],
  ['p-tests', 'JUnit tests', 'Account, Money, the calendar', 't-tc', 'Testcontainers', 'tests against a real database'],
  ['p-ship', 'a jlink runtime', 'three modules, a fraction of the JDK', 't-docker', 'a container image', 'run the same anywhere'],
]
const ICONS: Record<string, string> = { 'p-api': 'server', 'p-journal': 'file', 'p-store': 'database', 'p-tests': 'check', 'p-ship': 'package', 't-spring': 'globe', 't-kafka': 'kafka', 't-db': 'postgresql', 't-tc': 'shield', 't-docker': 'docker' }

export const shipWhereNext: SceneModel = {
  title: 'Where next',
  sub: 'every part of Syndica Bank, and the tool that does its job at scale',
  dir: 'row',
  nodes: [
    {
      type: 'group', id: 'ours', title: 'What you built', icon: 'layers', tone: 'ingest', children:
        pairs.map(([id, title, sub]) => ({ type: 'item' as const, id, title, sub, icon: ICONS[id] })),
    },
    {
      type: 'group', id: 'scale', title: 'At scale', icon: 'globe', tone: 'store', children:
        pairs.map(([, , , id, title, sub]) => ({ type: 'item' as const, id, title, sub, icon: ICONS[id] })),
    },
  ],
  edges: pairs.map(([from, , , to]) => ({ from, to })),
}
