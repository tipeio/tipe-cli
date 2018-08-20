const { Command } = require('@oclif/command')

class SchemaCommand extends Command {
  async run() {
    this.log('Hellow world schema command!')
  }
}

module.exports = SchemaCommand
