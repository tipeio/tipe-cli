// import _ from 'lodash'
// import { getUserArgs } from '../utils/args'
import { schemaFlag, authFlags } from '../../flags'
import { Command, flags } from '@oclif/command'
// import { cli } from 'cli-ux'
// import fs from 'fs'

export default class MigrateCommand extends Command {
  async run() {
    // const { flags } = this.parse(MigrateCommand)
    // const args = getUserArgs.call(this, flags)
  }
}

MigrateCommand.flags = {
  production: flags.boolean({
    name: 'production',
    char: 'P',
    description:
      'Run the migration against production content and schema for given project. Recommended to run migration without this flag first',
    multiple: false,
    requried: false
  }),
  schema: schemaFlag(),
  ...authFlags
}

MigrateCommand.description =
  'Run the latest content / schema migration for the given project'
