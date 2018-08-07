// const fs = require('fs.promised')
// const path = require('path')
const program = require('commander')
// const prompt = require('../prompt')

// const { store } = require('../utilities')
// const {} = require('../constants')

program
  .command('server') // <-- your command
  .action(action)

async function action(name) {
  // const CURRENT_DIR = process.cwd()
  console.log('Hello World')
}
