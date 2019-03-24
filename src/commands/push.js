import path from 'path'
import TipeCommand from './commandBase'
import config from '../config'
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
    this.startAction('Finding Schema')
    const newShapes = require(this.args.schema)

    if (!newShapes || !newShapes.length) {
      this.updateAction('fail', 'Schema does not have Shapes')
      this.error()
    }

    if (this.args.dryRun || this.args['dry-run']) {
      this.updateAction(
        'succeed',
        'Sending Schema to Tipe, Dry run, will not modify schema',
        true
      )
    } else {
      this.updateAction('succeed', 'Sending Schema to Tipe', true)
    }

    const [error, res] = await push(newShapes, this.args)

    if (error) {
      this.updateAction('fail')
      this.error(error.message)
      this.stopAction()
    }

    this.updateAction('succeed', 'Formatting Schema changes', true)
    // this.stopAction()
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
    const title = '✖ Tipe Schema Error'

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

    this.errorBox(message, title)
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
    required: false,
    default: () => config.API_ENDPOINT
  }
}
