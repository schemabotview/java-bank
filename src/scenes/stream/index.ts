import type { SceneModel } from '@graphlearning/graphl-flow'
import { streamLambdas } from './lambdas'
import { streamMethodRefs } from './method-refs'
import { streamFold } from './fold'
import { streamGrouping } from './grouping'
import { streamLaziness } from './laziness'
import { streamLoopOrStream } from './loop-or-stream'

export const streamScenes: Record<string, SceneModel> = {
  'stream-lambdas': streamLambdas,
  'stream-method-refs': streamMethodRefs,
  'stream-fold': streamFold,
  'stream-grouping': streamGrouping,
  'stream-laziness': streamLaziness,
  'stream-loop-or-stream': streamLoopOrStream,
}
