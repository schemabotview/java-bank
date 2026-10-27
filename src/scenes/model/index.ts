import type { SceneModel } from '@graphlearning/graphl-flow'
import { modelClass } from './class'
import { modelEncapsulation } from './encapsulation'
import { modelConstructors } from './constructors'
import { modelStatic } from './static'
import { modelEnums } from './enums'
import { modelRecords } from './records'
import { modelEquals } from './equals'
import { modelInterfaces } from './interfaces'
import { modelSealed } from './sealed'
import { modelChecked } from './checked'

export const modelScenes: Record<string, SceneModel> = {
  'model-class': modelClass,
  'model-encapsulation': modelEncapsulation,
  'model-constructors': modelConstructors,
  'model-static': modelStatic,
  'model-enums': modelEnums,
  'model-records': modelRecords,
  'model-equals': modelEquals,
  'model-interfaces': modelInterfaces,
  'model-sealed': modelSealed,
  'model-checked': modelChecked,
}
