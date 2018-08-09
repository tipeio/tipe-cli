const fs = require('fs.promised')
const program = require('commander')
const { createSchema } = require('@tipe/schema-tools')
const resolvers = require('../resolvers')

// const prompt = require('../prompt')
const { ApolloServer } = require('apollo-server')

program
  .command('server <schema>') // <-- your command
  .option(
    '-p, --port <n>',
    'Port server to run',
    port => parseInt(port, 10),
    4000
  )
  .action(action)

function action(schemaFilePath, options) {
  const schemaFile = fs.readFileSync(schemaFilePath).toString()
  let resultSchema

  try {
    resultSchema = createSchema(schemaFile, { ...resolvers })
  } catch (e) {
    console.log(
      "Error: Double check to make sure you're passing a correct graphql schema"
    )
  }

  const server = new ApolloServer({
    schema: resultSchema, // comes from schematools
    playground: true
  })

  server
    .listen({ port: options.port })
    .then(() => {
      console.log(`🚀 Server ready at http://localhost:${options.port}`)
      console.log(
        `⚽️ Playground ready at http://localhost:${options.port}/graphql`
      )
    })
    .catch(e => {
      console.log('Error: ', e)
    })
}
