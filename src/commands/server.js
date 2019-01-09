import { schemaFlag } from '../utils/flags'
import { flags } from '@oclif/command'

import { TipeCommand } from '../command'

export default class ServerCommand extends TipeCommand {
  async run() {}
}

ServerCommand.description = 'Local sever for testing schema'

ServerCommand.flags = {
  schema: schemaFlag(),
  port: flags.integer({
    char: 'P',
    description: 'port to serve the local API, defaults to 4000',
    default: 4000,
    multiple: false,
    required: false,
    parse: port => parseInt(port)
  }),
  watch: flags.boolean({
    char: 'w',
    description: 'Watch schema file and reload server when its changed',
    required: false,
    default: false
  })
}
