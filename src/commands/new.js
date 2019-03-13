import { TipeCommand } from '../command'
import { writeSchema } from '../utils/new'

export class NewCommand extends TipeCommand {
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

NewCommand.description = 'Scaffold a new basic schema for your project'
