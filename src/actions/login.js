// const fs = require('fs.promised')
// const path = require('path')
const program = require('commander')
const prompt = require('../prompt')

const { store } = require('../utilities')
const { emailSignin } = require('../auth')
// const {} = require('../constants')

program
  .command('login')
  .alias('l')
  .action(action)

async function action(name) {
  // const CURRENT_DIR = process.cwd()
  // const token = getToken(true)

  const [perr, result] = await prompt.get({
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
  if (perr) {
    process.exit(1)
  }
  console.log('Logging in...')
  const [lerr, data] = await emailSignin(result.email, result.password)
  if (lerr) {
    console.log('Error', lerr)
    process.exit(1)
  }
  console.log('User', JSON.stringify(data, null, 2))
  const { token, ...user } = data
  store.set('user', user)
  store.set('token', token)
}
