/**
 * Example file
 */

const { Command } = require('@oclif/command')
// const cli = require('cli-ux')

class ExampleCommnd extends Command {
  async run() {
    this.log('Hello World')
  }
}

module.exports = ExampleCommnd
