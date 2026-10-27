import type { SceneModel } from '@graphlearning/graphl-flow'
import { holdVariables } from './variables'
import { holdStackAndHeap } from './stack-and-heap'
import { holdCents } from './cents'
import { holdBigDecimal } from './bigdecimal'
import { holdStrings } from './strings'
import { holdEquals } from './equals'
import { holdTextBlocks } from './text-blocks'
import { holdArrays } from './arrays'
import { holdNull } from './null'

export const holdScenes: Record<string, SceneModel> = {
  'hold-variables': holdVariables,
  'hold-stack-and-heap': holdStackAndHeap,
  'hold-cents': holdCents,
  'hold-bigdecimal': holdBigDecimal,
  'hold-strings': holdStrings,
  'hold-equals': holdEquals,
  'hold-text-blocks': holdTextBlocks,
  'hold-arrays': holdArrays,
  'hold-null': holdNull,
}
