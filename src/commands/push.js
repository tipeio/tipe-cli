import { groupBy, forEach } from 'lodash'
import { getUserArgs } from '../utils/args'
import { schemaFlag } from '../utils/flags'
import { TipeCommand } from '../command'
import { flags } from '@oclif/command'
import chalk from 'chalk'
import { push } from '../api'

export default class PushCommand extends TipeCommand {
  async run() {
    const { flags } = this.parse(PushCommand)
    this.args = getUserArgs.call(this, flags)
    await this.pushShapes()
  }

  async pushShapes() {
    this.startAction('Validating your shapes')

    const newShapes = require(this.args.schema)

    if (!newShapes || !newShapes.length) {
      this.error('Schema must have Shapes')
    }

    const [error, res] = await push(
      newShapes,
      this.args.projectId,
      this.args.apiKey
    )

    if (error) {
      this.error('Oops, something is not working. We are on it!')
    }

    console.log(res.data)
    // this.logShapeErrors(res.data.errors)
    this.stopAction()
  }

  logShapeErrors(errors) {
    if (errors && errors.length) {
      this.warn('Invalid Shapes\n')
      const errorsByShape = groupBy(errors, 'shape')

      forEach(errorsByShape, (_errors, shape) => {
        this.warn(chalk.underline(chalk.bold(shape)))
        _errors.forEach(e => this.warn(`  * ${e.error}\n`))
        this.warn('\n')
      })
    }
  }
}

PushCommand.flags = {
  schema: schemaFlag(),
  projectId: flags.string({
    char: 'p',
    description: 'Tipe project id that this schema belongs to.',
    multiple: false,
    requried: false
  }),
  apiKey: flags.string({
    char: 'a',
    description: 'Tipe API key with write permission.',
    multiple: false,
    requried: false
  })
}

PushCommand.description = `Push your project's schema to Tipe which will update your API and Content dashboard`
