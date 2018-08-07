// const fs = require('fs.promised')
// const path = require('path')
const program = require('commander')
// const prompt = require('../prompt')

// const { store } = require('../utilities')
// const {} = require('../constants')

const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const PORT = 4000;

const app = express();

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!'
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

program
  .command('server') // <-- your command
  .options('--port', 'Port server to run')
  .action(action)

  
async function action(name) {
  const defaultPort = 4000
  const PORT = program.port || defaultPort
  app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}`)
  )
  // const CURRENT_DIR = process.cwd()
}
