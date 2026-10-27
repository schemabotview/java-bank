import type { SceneModel } from '@graphlearning/graphl-flow'
import { trustFirstTest } from './first-test'
import { trustAssertThrows } from './assert-throws'
import { trustParameterized } from './parameterized'
import { trustClock } from './clock'
import { trustLogging } from './logging'
import { trustGc } from './gc'

export const trustScenes: Record<string, SceneModel> = {
  'trust-first-test': trustFirstTest,
  'trust-assert-throws': trustAssertThrows,
  'trust-parameterized': trustParameterized,
  'trust-clock': trustClock,
  'trust-logging': trustLogging,
  'trust-gc': trustGc,
}
