import { flags } from '@oclif/command'
import path from 'path'
import config from './constants'

export const schemaFlag = flags.build({
  char: 's',
  description: 'Path to your schema file',
  multiple: false,
  default: config.schemaPath,
  requried: true,
  parse: relPath => path.join(process.cwd(), relPath)
})
