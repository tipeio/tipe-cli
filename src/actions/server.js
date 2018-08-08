// const fs = require('fs.promised')
// const path = require('path')
const program = require('commander')
// const prompt = require('../prompt')

// const { store } = require('../utilities')
// const {} = require('../constants')

const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')

program
  .command('server') // <-- your command
  .option(
    '-p, --port <n>',
    'Port server to run',
    port => parseInt(port, 10),
    4000
  )
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

  const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    introspection: true,
    playground: true
  })
  server.applyMiddleware({ app })
  app.listen({ port: options.port }, () => {
    console.log(
      `🚀 Server ready at http://localhost:${options.port}`
    )
    console.log(
      `⚽️ Playground ready at http://localhost:${options.port}/graphql`
    )
  })
}
