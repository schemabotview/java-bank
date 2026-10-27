import type { SceneModel } from '@graphlearning/graphl-flow'
import { startJdk } from './jdk'
import { startBank } from './bank'
import { startWhatJavaDoes } from './what-java-does'
import { startJshell } from './jshell'
import { startCompileError } from './compile-error'
import { startRuntimeException } from './runtime-exception'

export const startScenes: Record<string, SceneModel> = {
  'start-jdk': startJdk,
  'start-bank': startBank,
  'start-what-java-does': startWhatJavaDoes,
  'start-jshell': startJshell,
  'start-compile-error': startCompileError,
  'start-runtime-exception': startRuntimeException,
}
