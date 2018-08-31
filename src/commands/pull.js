const { Command, flags } = require('@oclif/command')
const fetch = require('node-fetch')
const fs = require('fs.promised')

const { DEV_API_ENDPOINT } = require('../constants')

class PullCommand extends Command {
  async run() {
    const { args } = this.parse(PullCommand)
    const { flags } = this.parse(PullCommand)
    const fileName = flags.fileName
    const projectId = args.projectId

    const schema = await fetch(`${DEV_API_ENDPOINT}/schema/${projectId}`, {
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        if (res.status === 200) {
          return res.json()
        }
        console.log('Error: Schema not found based on project ID')
      })
      .catch(() => {
        console.log('ERROR: Server Error!')
      })

    const error = fs.writeFileSync(`${fileName}.graphql`, schema.data)
    if (error) {
      this.log(error)
      return
    }
    this.log('Success!')
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
