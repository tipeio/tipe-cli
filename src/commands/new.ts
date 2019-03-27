import path from 'path'
import TipeCommand from './commandBase'
import { CommandFlagConfig, CommandArgs } from '../../types'
import { writeSchema } from '../utils/new'

export default class NewCommand extends TipeCommand {
  args: CommandArgs
  log: any
  description: string = 'Scaffold a new basic schema for your project'
  validCommands: CommandFlagConfig = {
    p: {
      complete: 'port'
    },
    port: {
      type: 'number',
      required: false,
      default: () => 5000
    },
    s: {
      complete: 'schema'
    },
    schema: {
      type: 'string',
      required: false,
      parse: schemaPath => path.join(process.cwd(), schemaPath),
      default: () => path.join(process.cwd(), '.tipeshapes.js')
    }
  }

  constructor(args: object) {
    super()
    this.args = this.validate(this.validCommands, args)
  }
  async run() {
    await this.saveSchema()
    this.log('New schema => ./tipeshapes.js')
    this.log('run the "tipe push" command when you')
    this.log('Run the offline API with "tipe offline"')
  }

  async saveSchema() {
    const [e] = await writeSchema('blog')

    if (e) {
      return this.error('Could not create shapes')
    }
  }
}
