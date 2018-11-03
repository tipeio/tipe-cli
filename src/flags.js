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

export const authFlags = {
  projectId: flags.string({
    char: 'p',
    description: 'Tipe project id that this schema belongs to.',
    multiple: false,
    requried: false
  }),
  apiKey: flags.string({
    char: 'a',
    description: 'Tipe API key with write permission.',
    multiple: false,
    requried: false
  })
}
