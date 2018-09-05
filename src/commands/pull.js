const { Command, flags } = require('@oclif/command')
const { cli } = require('cli-ux')
const { pull } = require('../api')

class PullCommand extends Command {
  async run() {
    const { flags } = this.parse(PullCommand)
    const fileName = flags.fileName

    cli.action.start('Fetching project shcema...')
    await pull(fileName)
    cli.action.stop()
  }
}

PullCommand.description = 'Fetch a remote project schema, based on API key'

PullCommand.flags = {
  fileName: flags.string({
    char: 'n',
    description: 'name of new file',
    default: 'tipe'
  })
}

module.exports = PullCommand
