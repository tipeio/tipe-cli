import path from 'path'
import TipeCommand from './commandBase'
import { groupBy, reduce } from 'lodash'
import chalk from 'chalk'
import { push } from '../api'

export default class Push extends TipeCommand {
  constructor(args) {
    super()
    this.args = this.validate(Push.validCommands, args)
  }
  run() {
    this.pushShapes()
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

Push.validCommands = {
  p: {
    complete: 'project'
  },
  project: {
    type: 'string',
    required: false,
    default: () => process.env.TIPE_PROJECT
  },
  s: {
    complete: 'schema'
  },
  schema: {
    type: 'string',
    required: false,
    parse: schemaPath => path.join(process.cwd(), schemaPath),
    default: () => path.join(process.cwd(), '.tipeshapes.js')
  },
  a: {
    complete: 'apikey'
  },
  apikey: {
    type: 'string',
    required: false,
    default: () => process.env.TIPE_APIKEY
  },
  d: {
    complete: 'dry-run'
  },
  'dry-run': {
    type: 'boolean',
    required: false,
    default: () => false
  },
  A: {
    complete: 'api'
  },
  api: {
    type: 'string',
    required: true
    // default: () => config.API_ENDPOINT
  }
}
