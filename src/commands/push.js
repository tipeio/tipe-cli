const { Command } = require('@oclif/command')
const fs = require('fs.promised')
const fetch = require('node-fetch')

const { DEV_API_ENDPOINT } = require('../constants')

class PushCommand extends Command {
  async run() {
    const { args } = this.parse(PushCommand)
    const schemaFilePath = args.filePath
    const projectId = args.projectId

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
    fetch(`${DEV_API_ENDPOINT}/schema/${projectId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        schema: schemaFile
      })
    })
      .then(async res => {
        if (res.status === 201) {
          console.log('Success!')
          return
        }
        console.log('Error: Schema not found based on project ID')
        console.log('Error: Unable to push your local schema. Try again.')
      })
      .catch(() => {
        console.log(
          'ERROR: There was a server error, please try again or contact us!'
        )
      })
  }
}

PushCommand.description = `
    Save project schema on Tipe for usage on Tipe dashboard and API
  `

PushCommand.args = [
  {
    name: 'projectId',
    required: true,
    description: 'ID of the project to fetch schema'
  },
  {
    name: 'filePath',
    require: true,
    description: 'Path to graphql file to save'
  }
]

module.exports = PushCommand
