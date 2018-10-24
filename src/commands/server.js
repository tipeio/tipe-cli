import fs from 'fs'
import { schemaFlag } from '../flags'
import { Command, flags } from '@oclif/command'
import { ApolloServer } from 'apollo-server'
import { createSchema } from '@tipe/schema-tools'
import crudResolvers from '../resolvers'
import { getUserArgs } from '../utils/args'

export default class ServerCommand extends Command {
  async run() {
    const { flags } = this.parse(ServerCommand)
    const args = getUserArgs.call(this, flags)
    let typeDefs

    try {
      typeDefs = fs.readFileSync(args.schema, { encoding: 'utf-8' }).toString()
    } catch (e) {
      this.error(`Could not find schema at: "${args.schema}"`)
      return this.exit(1)
    }

    const server = new ApolloServer({
      schema: createSchema({
        typeDefs,
        crudResolvers,
        spec: 'tipe'
      }),
      playground: {
        settings: {
          'editor.theme': 'light',
          'editor.cursorShape': 'block'
        }
      }
    })

    server
      .listen({ port: args.port })
      .then(() => {
        this.log(`🚀 Server ready at http://localhost:${args.port}`)
        this.log(
          `⚽️ Playground ready at http://localhost:${args.port}/graphql`
        )
      })
      .catch(e => {
        this.error(e)
        this.exit(1)
      })
  }
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
