import path from 'path'
import chalk from 'chalk'
import TipeCommand from './commandBase'
import { CommandFlagConfig, CommandArgs } from '../../types'
import { createServer } from '../utils/offline'
import { prepareShapes } from '@tipe/schema'

export default class Offline extends TipeCommand {
  args: CommandArgs
  server: any
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

  run() {
    this.startServer(this.args.schema)
  }

  getShapes() {
    const newShapes = require(this.args.schema)
    const { errors, shapes } = prepareShapes(newShapes)

    if (errors && errors.length) {
      return this.logSchemaErorrs(errors)
    }

    return shapes
  }

  logSchemaErorrs(errors) {
    this.error(JSON.stringify(errors))
  }

  async startServer(schema?: string) {
    if (!this.server) {
      const shapes = this.getShapes()
      const startServer = createServer(shapes)

      try {
        this.server = await startServer(this.args.port)

        // this.log(`offline API @ http://localhost:${this.args.port}`)
        // this.log('If you are using @tipe/sdk, make sure to enable offline mode')
        const message = [
          `listening on: ${chalk.magenta(
            'http://localhost:' + this.args.port
          )}`,
          `If you are using ${chalk.magenta(
            '@tipe/sdk'
          )}, make sure to enable offline mode`
        ].join('\n')

        process.stdout.write(
          this.successBox(message, 'Tipe offline API started 🐈')
        )
      } catch (e) {
        this.error('Could not start server')
      }
    } else {
      this.warning('offline API already started')
    }
  }

  closeServer() {
    if (this.server) {
      this.server.close()
    }
  }
}
