import { flags } from '@oclif/command'
import path from 'path'
import config from '../constants'

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
    requried: false,
    env: 'TIPE_PROJECT_ID'
  }),
  apiKey: flags.string({
    char: 'a',
    description: 'Tipe API key with write permission.',
    multiple: false,
    requried: false,
    env: 'TIPE_API_KEY'
  })
}

export const commonFlags = {
  dryRun: flags.boolean({
    char: 'd',
    description: `Won't apply any changes to your project's schema. Useful to see what changes will be applied or any conflicts.`,
    required: false,
    multiple: false
  }),
  api: flags.string({
    char: 'A',
    description: 'Tipe API endpoint url',
    multiple: false,
    required: false,
    hidden: true,
    default: config.API_ENDPOINT
  })
}
