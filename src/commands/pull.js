const { Command, flags } = require('@oclif/command')
const { cli } = require('cli-ux')
const { pull } = require('../auth')

class PullCommand extends Command {
  async run() {
    const { args } = this.parse(PullCommand)
    const { flags } = this.parse(PullCommand)
    const fileName = flags.fileName
    const projectId = args.projectId

    cli.action.start('Fetching project shcema...')
    await pull(projectId, fileName)
    cli.action.stop()
  }
}

PullCommand.description = 'Fetch a remote project schema'

PullCommand.flags = {
  fileName: flags.string({
    char: 'n',
    description: 'name of new file',
    default: 'tipe'
  })
}

PullCommand.args = [
  {
    name: 'projectId',
    required: true,
    description: 'ID of the project to fetch schema'
  }
]

module.exports = PullCommand
