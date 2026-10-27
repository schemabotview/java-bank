import type { SceneModel } from '@graphlearning/graphl-flow'
import { decideExpressions } from './expressions'
import { decideOverflow } from './overflow'
import { decideIfElse } from './if-else'
import { decideSwitch } from './switch'
import { decideFor } from './for'
import { decideWhile } from './while'
import { decideMethods } from './methods'
import { decidePassByValue } from './pass-by-value'
import { decideTryCatch } from './try-catch'
import { decideThrow } from './throw'

export const decideScenes: Record<string, SceneModel> = {
  'decide-expressions': decideExpressions,
  'decide-overflow': decideOverflow,
  'decide-if-else': decideIfElse,
  'decide-switch': decideSwitch,
  'decide-for': decideFor,
  'decide-while': decideWhile,
  'decide-methods': decideMethods,
  'decide-pass-by-value': decidePassByValue,
  'decide-try-catch': decideTryCatch,
  'decide-throw': decideThrow,
}
