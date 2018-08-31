const { Command, flags } = require('@oclif/command')
const fetch = require('node-fetch')
// const fs = require('fs.promised')
const path = require('path')

const { DEV_API_ENDPOINT } = require('.../constants')

class PullCommand extends Command {
  async run() {
    const { args } = this.parse(PullCommand)
    // const { flags } = this.parse(PullCommand)
    // const pathToStoreSchema = flags.path || flags.p
    const projectId = args.projectId
    const schema = await fetch(`${DEV_API_ENDPOINT}/schema/${projectId}`, {
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    })
    this.log(schema)
  }
}

PullCommand.description = 'Fetch a remote project schema'

PullCommand.flags = {
  path: flags.string({
    char: 'p',
    description: 'path to store schema',
    default: `${path.resolve(__dirname)}`
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
