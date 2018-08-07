// const fs = require('fs.promised')
// const path = require('path')
const program = require('commander')
const prompt = require('../prompt')

// const { store } = require('../utilities')
// const {} = require('../constants')

program
  .command('login')
  .alias('l')
  .action(action)

async function action(name) {
  // const CURRENT_DIR = process.cwd()
  // const token = getToken(true)

  const [err, result] = await prompt.get({
    properties: {
      email: {
        pattern: /.+@.+/,
        message: 'Email must be a valid email',
        required: true
      },
      password: {
        hidden: true
      }
    }
  })
  if (err) {
    process.exit(1)
  }

  console.log('Logging in...', result.email, result.password)
}
