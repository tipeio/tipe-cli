// const fs = require('fs.promised')
// const path = require('path')
const program = require('commander')
// const prompt = require('../prompt')

// const { store } = require('../utilities')
// const {} = require('../constants')

const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const defaultPort = 4000

program
  .command('server') // <-- your command
  .option('-p, --port <n>', 'Port server to run', port => parseInt(port, 10), defaultPort)
  .action(action)

  
async function action(options) {
  const app = express()

  const typeDefs = gql`
    type Query {
      hello: String
    }
  `

  const resolvers = {
    Query: {
      hello: () => 'Hello world!'
    }
  }

  const server = new ApolloServer({ typeDefs, resolvers })
  server.applyMiddleware({ app })
  app.listen({ port: options.port }, () =>
    console.log(`🚀 Server ready at http://localhost:${options.port}`)
  )
}
