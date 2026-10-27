import type { SceneModel } from '@graphlearning/graphl-flow'
import { shipHttpApi } from './http-api'
import { shipIdempotency } from './idempotency'
import { shipHttpClient } from './http-client'
import { shipJlink } from './jlink'
import { shipWhereNext } from './where-next'

export const shipScenes: Record<string, SceneModel> = {
  'ship-http-api': shipHttpApi,
  'ship-idempotency': shipIdempotency,
  'ship-http-client': shipHttpClient,
  'ship-jlink': shipJlink,
  'ship-where-next': shipWhereNext,
}
