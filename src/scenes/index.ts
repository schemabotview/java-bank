import type { SceneModel } from '@graphlearning/graphl-flow'
import { introScenes } from './intro'
import { startScenes } from './start'
import { holdScenes } from './hold'
import { decideScenes } from './decide'
import { modelScenes } from './model'
import { collectScenes } from './collect'
import { streamScenes } from './stream'
import { saveScenes } from './save'
import { buildScenes } from './build'
import { trustScenes } from './trust'
import { concurrentScenes } from './concurrent'
import { shipScenes } from './ship'

// Scene registry. Sections reference scenes by id; a graphl-flow scene carries no id of its own, so
// the id is the key here. Scenes are grouped by course (one folder each, mirroring src/content),
// each folder exporting a Record; ids are globally unique, and a duplicate THROWS rather than
// letting one course's scene shadow another's. A scene no section uses yet is still reachable at
// the shell's bare scene route, `#/<sceneId>` (`npm run shots -- <sceneId>`).
const GROUPS: Record<string, SceneModel>[] = [introScenes, startScenes, holdScenes, decideScenes, modelScenes, collectScenes, streamScenes, saveScenes, buildScenes, trustScenes, concurrentScenes, shipScenes]

export const SCENES: Record<string, SceneModel> = {}
for (const group of GROUPS)
  for (const [id, scene] of Object.entries(group)) {
    if (id in SCENES) throw new Error(`scene id "${id}" is registered twice`)
    SCENES[id] = scene
  }

export function getScene(id: string): SceneModel | undefined {
  return SCENES[id]
}
