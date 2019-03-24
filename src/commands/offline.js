import path from 'path'
import TipeCommand from './commandBase'
import { createServer } from '../utils/offline'
import { prepareShapes } from '@tipe/schema'

export default class Offline extends TipeCommand {
  constructor(args) {
    super()
    this.args = this.validate(Offline.validCommands, args)
  }

  run() {
    this.startServer(this.args.schema)
  }

  getShapes() {
    console.log('this.args.schema: ', this.args.schema)
    console.log('this.args: ', this.args)
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

  async startServer() {
    if (!this.server) {
      const shapes = this.getShapes()
      const startServer = createServer(shapes)

      try {
        this.server = await startServer(this.args.port)

        this.log(`offline API @ http://localhost:${this.args.port}`)
        this.log('If you are using @tipe/sdk, make sure to enable offline mode')
      } catch (e) {
        this.error('Could not start server')
      }
    } else {
      this.warn('offline API already started')
    }
  }

  closeServer() {
    if (this.server) {
      this.server.close()
    }
  }
}

Offline.validCommands = {
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
