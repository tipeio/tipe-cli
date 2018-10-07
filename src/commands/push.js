import { getUserArgs } from '../utilities'
const { Command, flags } = require('@oclif/command')
const { cli } = require('cli-ux')
const config = require('../constants')
const fs = require('fs')

const { push } = require('../api')

class PushCommand extends Command {
  async run() {
    const { flags } = this.parse(PushCommand)
    const args = getUserArgs.call(this, flags)
    let schema

    try {
      schema = fs.readFileSync(args.schema, { encoding: 'utf-8' }).toString()
    } catch (e) {
      this.error(`Could not find schema at: "${args.schema}"`)
      return this.exit(1)
    }

    cli.action.start('Pushing schema to Tipe...')
    await push(schema, args.projectId, args.apiKey)
    cli.action.stop('Schema has been updated! 🎉')
  }
}

PushCommand.flags = {
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
  }),
  schema: flags.string({
    char: 's',
    description: 'Path to your schema file',
    multiple: false,
    default: config.schemaPath,
    requried: true
  })
}

PushCommand.description = `Push your project's schema to Tipe which will update your API and Content dashboard`

module.exports = PushCommand
