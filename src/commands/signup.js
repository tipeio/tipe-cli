const { Command } = require('@oclif/command')
const cli = require('cli-ux')

const { store, validateEmail } = require('../utilities')
const { emailSignup } = require('../auth')

class SignupCommand extends Command {
  async run() {
    const email = await cli.prompt('What is your email?', {
      required: true
    })
    const password = await cli.prompt('What is your password?', {
      type: 'hide',
      required: true
    })

    if (validateEmail(email)) {
      this.log('Email must be valid, try again.')
      process.exit(1)
    }

    cli.action.start('Signing up...')
    const [error, data] = await emailSignup(email, password)
    if (error) {
      this.log(`Error: ${error}`)
      process.exit(1)
    }
    cli.action.stop(`User: ${JSON.stringify(data, null, 2)}`)
    const { token, ...user } = data
    store.set('user', user)
    store.set('token', token)
  }
}

module.exports = SignupCommand
