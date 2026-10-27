import type { Course } from '../types'
import { installAJdk } from './01-install-a-jdk'
import { bankJava } from './02-bank-java'
import { whatJavaDoes } from './03-what-java-does'
import { jshell } from './04-jshell'
import { compileErrors } from './05-compile-errors'
import { runtimeException } from './06-runtime-exception'

export const start: Course = {
  id: 'start',
  title: 'The first program',
  sections: [installAJdk, bankJava, whatJavaDoes, jshell, compileErrors, runtimeException],
}
