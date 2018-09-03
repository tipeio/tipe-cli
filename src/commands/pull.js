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

    fetch(`${DEV_API_ENDPOINT}/schema/${projectId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(async res => {
        if (res.status === 200) {
          const { data } = await res.json()
          const error = fs.writeFileSync(`${fileName}.graphql`, data)
          if (error) {
            console.log(error)
            return
          }
          console.log('Success!')
          return
        }
        console.log('Error: Schema not found based on project ID')
      })
      .catch(() => {
        console.log(
          'ERROR: There was a server error, please try again or contact us!'
        )
      })
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
