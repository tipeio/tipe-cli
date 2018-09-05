const { Command } = require('@oclif/command')
const { cli } = require('cli-ux')
const fs = require('fs')

const { push } = require('../api')

class PushCommand extends Command {
  async run() {
    const { args } = this.parse(PushCommand)
    const schemaFilePath = args.filePath
    let schemaFile

    try {
      schemaFile = fs.readFileSync(schemaFilePath).toString()
    } catch (err) {
      this.log(
        "Error: Double check to make sure you're passing a correct graphql schema"
      )
      this.log(err)
      return
    }

    cli.action.start('Saving project shcema...')
    await push(schemaFile)
    cli.action.stop()
  }
}

PushCommand.description = `
    Save project schema on Tipe for usage on Tipe dashboard and API
  `

PushCommand.args = [
  {
    name: 'filePath',
    require: true,
    description: 'Path to graphql file to save'
  }
]

module.exports = PushCommand
