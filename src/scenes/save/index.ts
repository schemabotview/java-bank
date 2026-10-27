import type { SceneModel } from '@graphlearning/graphl-flow'
import { saveFiles } from './files'
import { saveReplay } from './replay'
import { saveTryWithResources } from './try-with-resources'
import { saveImport } from './import'
import { saveJavaTime } from './java-time'
import { saveTimeZones } from './time-zones'

export const saveScenes: Record<string, SceneModel> = {
  'save-files': saveFiles,
  'save-replay': saveReplay,
  'save-try-with-resources': saveTryWithResources,
  'save-import': saveImport,
  'save-java-time': saveJavaTime,
  'save-time-zones': saveTimeZones,
}
