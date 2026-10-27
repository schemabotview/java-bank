import type { SceneModel } from '@graphlearning/graphl-flow'
import { appMap } from '../map'

// 1.2 — what we'll build: the whole bank, nothing built yet.
export const introScenes: Record<string, SceneModel> = {
  'intro-what-we-build': appMap({ title: "What we'll build: Syndica Bank's ledger", sub: 'from one balance to a transfer service, one Java feature at a time', built: 0 }),
}
