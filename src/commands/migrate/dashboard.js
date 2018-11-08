// import _ from 'lodash'
import { getUserArgs } from '../../utils/args'
import { schemaFlag, authFlags } from '../../flags'
import { Command } from '@oclif/command'
// import { cli } from 'cli-ux'
// import fs from 'fs'

export default class MigrateDashboardCommand extends Command {
  async run() {
    const { flags } = this.parse(MigrateDashboardCommand)
    const args = getUserArgs.call(this, flags)
    console.log(args)
  }
}

MigrateDashboardCommand.flags = {
  schema: schemaFlag(),
  ...authFlags
}

MigrateDashboardCommand.description =
  'Migrate the dashboard to the latest schema. This will allow your content team to create new new content against your new schema. Will not affect current content or the API.'
