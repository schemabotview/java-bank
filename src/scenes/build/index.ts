import type { SceneModel } from '@graphlearning/graphl-flow'
import { buildPackages } from './packages'
import { buildClasspath } from './classpath'
import { buildMaven } from './maven'
import { buildDependencies } from './dependencies'
import { buildJar } from './jar'
import { buildModules } from './modules'

export const buildScenes: Record<string, SceneModel> = {
  'build-packages': buildPackages,
  'build-classpath': buildClasspath,
  'build-maven': buildMaven,
  'build-dependencies': buildDependencies,
  'build-jar': buildJar,
  'build-modules': buildModules,
}
