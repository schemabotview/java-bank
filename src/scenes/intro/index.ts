import type { SceneModel } from '@graphlearning/graphl-flow'
import { appMap } from '../map'
import s1 from '../../../spine/intro/01-java/session.txt?raw'

// Course 1 — Java, and what we'll build. Two concept scenes: Java answering for itself (the intro
// lab, replayed on the course's JDK), and the bank's map before anything is built. 1.2 is rebuilt to
// show the FINISHED bank's real output once Course 12 exists (the payoff first, as in Python's).
const java1: SceneModel = {
  title: 'Java',
  sub: 'a typed, compiled language on a virtual machine: thirty years old, and running the world’s money',
  dir: 'row',
  nodes: [
    {
      type: 'group', id: 'core', title: 'Java 25', icon: 'cpu', tone: 'ingest', children: [
        { type: 'code', id: 'asked', terminal: true, filename: 'terminal', code: s1.trim() },
        { type: 'item', id: 'cap', title: 'This course', icon: 'card', tone: 'store', bullets: ['one bank, from a first line', 'only the JDK, then JUnit'] },
      ],
    },
    {
      type: 'group', id: 'uses', title: 'What runs on the JVM', icon: 'globe', tone: 'store', spread: true, dir: 'grid', cols: 2, children: [
        { type: 'item', id: 'u-bank', title: 'banks and payments', sub: 'core ledgers, card networks', icon: 'building', tone: 'store' },
        { type: 'item', id: 'u-web', title: 'web backends', sub: 'Spring Boot, Quarkus', icon: 'server', tone: 'store' },
        { type: 'item', id: 'u-android', title: 'Android apps', sub: 'Java and Kotlin', icon: 'screen' },
        { type: 'item', id: 'u-kafka', title: 'event streams', sub: 'Apache Kafka', icon: 'kafka' },
        { type: 'item', id: 'u-data', title: 'big data', sub: 'Spark, Flink, Hadoop', icon: 'spark' },
        { type: 'item', id: 'u-search', title: 'search', sub: 'Elasticsearch, Lucene', icon: 'search' },
      ],
    },
  ],
  edges: [{ from: 'core', to: 'uses' }],
}

export const introScenes: Record<string, SceneModel> = {
  'intro-java': java1,
  'intro-what-we-build': appMap({ title: "What we'll build: Syndica Bank's ledger", sub: 'from one balance to a transfer service, one Java feature at a time', built: 0 }),
}
