import type { SceneModel } from '@graphlearning/graphl-flow'
import { collectList } from './list'
import { collectMap } from './map'
import { collectSet } from './set'
import { collectIterating } from './iterating'
import { collectGenerics } from './generics'
import { collectSorting } from './sorting'
import { collectOptional } from './optional'
import { collectUnmodifiable } from './unmodifiable'

export const collectScenes: Record<string, SceneModel> = {
  'collect-list': collectList,
  'collect-map': collectMap,
  'collect-set': collectSet,
  'collect-iterating': collectIterating,
  'collect-generics': collectGenerics,
  'collect-sorting': collectSorting,
  'collect-optional': collectOptional,
  'collect-unmodifiable': collectUnmodifiable,
}
