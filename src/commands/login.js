const { Command } = require('@oclif/command')
const { cli } = require('cli-ux')

const { emailSignin } = require('../auth')

class LoginCommand extends Command {
  async run() {
    const email = await cli.prompt('What is your email?', {
      required: true
    })
    const password = await cli.prompt('What is your password?', {
      type: 'hide',
      required: true
    })

    cli.action.start('logging in...')
    await emailSignin(email, password)
    cli.action.stop()
  }
}

module.exports = LoginCommand
