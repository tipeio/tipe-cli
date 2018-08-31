const { Command, flags } = require('@oclif/command')
const fs = require('fs.promised')
const path = require('path')
const { ApolloServer } = require('apollo-server')
const { createSchema } = require('@tipe/schema-tools')
const resolvers = require('../resolvers')

class ServerCommand extends Command {
  async run() {
    const { args } = this.parse(ServerCommand)
    const { flags } = this.parse(ServerCommand)
    const port = flags.port || flags.p || 4000
    const schemaFilePath = args.filePath
    let resultSchema

    try {
      const schemaFile = fs.readFileSync(schemaFilePath).toString()
      resultSchema = createSchema({
        spec: 'tipe',
        typeDefs: schemaFile,
        crudResolvers: Object.assign({}, resolvers)
      })
    } catch (e) {
      this.log(
        "Error: Double check to make sure you're passing a correct graphql schema"
      )
      this.log(e)
      return
    }

    const server = new ApolloServer({
      schema: resultSchema, // comes from schematools
      playground: {
        settings: {
          'editor.theme': 'light',
          'editor.cursorShape': 'block'
        }
      }
    })

    server
      .listen({ port })
      .then(() => {
        console.log(`🚀 Server ready at http://localhost:${port}`)
        console.log(`⚽️ Playground ready at http://localhost:${port}/graphql`)
      })
      .catch(e => {
        console.log('Error: ', e)
      })
  }
}

ServerCommand.description = 'Local sever for testing schema'

ServerCommand.flags = {
  port: flags.string({
    char: 'p',
    description: 'port of server, defaults to 4000'
  })
}

ServerCommand.args = [
  {
    name: 'filePath',
    description: 'path to graphql file',
    default: `${path.resolve(
      path.join(__dirname, '../examples/tipe-schema-example.graphql')
    )}`
  }
]

module.exports = ServerCommand
