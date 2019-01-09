import { groupBy, reduce } from 'lodash'
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
    this.startAction('... 🚀 sending new shapes to Tipe')

    const newShapes = require(this.args.schema)

    if (!newShapes || !newShapes.length) {
      this.error('Schema must have Shapes')
    }

    const [error, res] = await push(
      newShapes,
      this.args.projectId,
      this.args.apiKey
    )

    this.stopAction('done')

    if (error) {
      this.error('Oops, something is not working. We are on it!')
    }

    this.logResponse(res.data)

    // this.logShapeErrors(res.data.errors)
  }

  logResponse({ conflicts, changes, isNew }) {
    if (conflicts && conflicts.length) {
      return this.logConflicts(conflicts)
    }

    if (changes && changes.length) {
      return this.logChanges(changes)
    }

    if (changes && !changes.length) {
      return this.log('No changes, your project is already using this schema.')
    }
  }

  formatChangePath(changePath) {
    return changePath.length > 1 ? changePath.join('.') : changePath[0]
  }

  logChanges(changes) {
    this.log('The following shape changes were successful! 💯')
    const changesByShape = groupBy(changes, c => c.path[0])

    const message = reduce(
      changesByShape,
      (result, shapeChanges, shape) => {
        result += '\n' + chalk.underline(chalk.bold(shape)) + '\n'
        result += shapeChanges.map(
          c => `✅  ${c.type} - ${this.formatChangePath(c.path)}`
        )
        return result + '\n'
      },
      ''
    )

    this.log(message)
  }

  logConflicts(conflicts) {
    this.warn(
      'Cound not make Shape changes. You need to resolve the following issues\n'
    )
    const conflictsByShape = groupBy(conflicts, 'shape')

    const message = reduce(
      conflictsByShape,
      (result, shapeConflicts, shape) => {
        result += '\n' + chalk.underline(chalk.bold(shape)) + '\n'
        result += shapeConflicts.map(s => ` ❌  ${s.error}`).join('\n')
        return result + '\n'
      },
      ''
    )

    this.warn(message)
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
