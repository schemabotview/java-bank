import type { SceneModel } from '@graphlearning/graphl-flow'
import { startBank } from './bank'

export const startScenes: Record<string, SceneModel> = {
  'start-bank': startBank,
}
