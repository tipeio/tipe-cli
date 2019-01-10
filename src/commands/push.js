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
    if (this.args.dryRun) {
      this.log('Dry run, will not modify project schema\n')
    } else {
      this.startAction('... 🚀 sending new shapes to Tipe')
    }

    const newShapes = require(this.args.schema)

    if (!newShapes || !newShapes.length) {
      this.error('Schema must have Shapes')
    }

    const [error, res] = await push(newShapes, this.args)

    if (!this.args.dryRun) {
      this.stopAction('done')
    }

    if (error) {
      this.error('Oops, something is not working. We are on it!')
    }

    this.logResponse(res.data)
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
    this.log('List of changes =>')
    const changesByShape = groupBy(changes, c => c.path[0])

    const message = reduce(
      changesByShape,
      (result, shapeChanges, shape) => {
        result +=
          '\n' + chalk.underline(chalk.bold(chalk.magenta(shape))) + '\n'
        result += shapeChanges.map(
          c => `✅  ${chalk.green(c.type)} - ${this.formatChangePath(c.path)}`
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
        result +=
          '\n' + chalk.underline(chalk.bold(chalk.magenta(shape))) + '\n'
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
    description: 'Tipe Secret API key.',
    multiple: false,
    requried: false
  }),
  dryRun: flags.boolean({
    char: 'd',
    description: `Won't apply any changes to your project's schema. Useful to see what changes will be applied or any conflicts.`,
    required: false,
    multiple: false
  })
}

PushCommand.description = `Push your project's schema to Tipe which will update your API and Content dashboard`
