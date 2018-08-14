// const fs = require('fs.promised')
// const path = require('path')
const program = require('commander')
const fetch = require('node-fetch')
const prompt = require('../prompt')

const { store } = require('../utilities')
const { emailSignup } = require('../auth')
// const {} = require('../constants')

program.command('signup').action(action)

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
  console.log('Signing up...')
  const [lerr, data] = await emailSignup(result.email, result.password)
  if (lerr) {
    console.log('Error', lerr)
    process.exit(1)
  }
  console.log('User', JSON.stringify(data, null, 2))
  const { token, ...user } = data
  store.set('user', user)
  store.set('token', token)
}
