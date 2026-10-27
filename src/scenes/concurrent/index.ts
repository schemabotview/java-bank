import type { SceneModel } from '@graphlearning/graphl-flow'
import { concurrentThreads } from './threads'
import { concurrentRace } from './race'
import { concurrentSynchronized } from './synchronized'
import { concurrentAtomics } from './atomics'
import { concurrentDeadlock } from './deadlock'
import { concurrentLockOrdering } from './lock-ordering'
import { concurrentExecutors } from './executors'
import { concurrentMap } from './concurrent-map'
import { concurrentVirtualThreads } from './virtual-threads'

export const concurrentScenes: Record<string, SceneModel> = {
  'concurrent-threads': concurrentThreads,
  'concurrent-race': concurrentRace,
  'concurrent-synchronized': concurrentSynchronized,
  'concurrent-atomics': concurrentAtomics,
  'concurrent-deadlock': concurrentDeadlock,
  'concurrent-lock-ordering': concurrentLockOrdering,
  'concurrent-executors': concurrentExecutors,
  'concurrent-map': concurrentMap,
  'concurrent-virtual-threads': concurrentVirtualThreads,
}
