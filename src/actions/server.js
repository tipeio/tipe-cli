const fs = require('fs.promised')
const program = require('commander')
const schemaTools = require('@tipe/schema-tools')
const resolvers = require('../resolvers')

// const prompt = require('../prompt')

const express = require('express')
const { ApolloServer } = require('apollo-server-express')

program
  .command('server <schema>') // <-- your command
  .option(
    '-p, --port <n>',
    'Port server to run',
    port => parseInt(port, 10),
    4000
  )
  .action(action)

async function action(schemaFilePath, options) {
  const schemaFile = fs.readfile(schemaFilePath)
  console.log(schemaFile)
  const app = express()
  const server = new ApolloServer({
    schema: '', // comes from schematools
    introspection: true,
    playground: true
  })
  server.applyMiddleware({
    app
  })

  app.listen({ port: options.port }, () => {
    console.log(`🚀 Server ready at http://localhost:${options.port}`)
    console.log(
      `⚽️ Playground ready at http://localhost:${options.port}/graphql`
    )
  })
}
