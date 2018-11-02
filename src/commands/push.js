import _ from 'lodash'
import { getUserArgs } from '../utils/args'
import { schemaFlag } from '../flags'
import { checkForSchemaConflicts } from '../api'
import { Command, flags } from '@oclif/command'
import { cli } from 'cli-ux'
import fs from 'fs'

const { push } = require('../api')

export default class PushCommand extends Command {
  async run() {
    const { flags } = this.parse(PushCommand)
    const args = getUserArgs.call(this, flags)
    let schema

    try {
      // TODO: support graphql import
      schema = fs.readFileSync(args.schema, { encoding: 'utf-8' }).toString()
    } catch (e) {
      this.error(`Could not find schema at: "${args.schema}"`)
      return this.exit(1)
    }
    cli.action.start('Checking for schema conflicts')

    const [error, res] = await checkForSchemaConflicts(
      args.projectId,
      args.apiKey,
      schema
    )

    if (error) {
      cli.action.stop('could not get current schema')
      this.error(error)
      return process.exit(1)
    }

    const { hasConflicts, conflicts } = res.body.data

    if (hasConflicts) {
      cli.action.stop('Content will require a migration due to conflicts: ')
      _.forEach(conflicts, (conflictMeta, conFlictName) => {
        if (conflictMeta.length) {
          this.log(conFlictName)
          conflictMeta.forEach(meta => this.log(meta))
          this.log('\n')
        }
      })
      return
    }

    cli.action.start('Updating schema on Tipe')
    await push(schema, args.projectId, args.apiKey)
    cli.action.stop('Schema, API, and Dashboard has been updated! 🎉')
  }
}

PushCommand.flags = {
  schema: schemaFlag(),
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

PushCommand.description = `Push your project's schema to Tipe which will update your API and Content dashboard`
