const { Command } = require('@oclif/command')
const { cli } = require('cli-ux')

const { emailSignup } = require('../api')

class SignupCommand extends Command {
  async run() {
    const email = await cli.prompt('What is your email?', {
      required: true
    })
    const password = await cli.prompt('What is your password?', {
      type: 'hide',
      required: true
    })

    cli.action.start('Signing up...')
    await emailSignup(email, password)
    cli.action.stop()
  }
}

module.exports = SignupCommand
