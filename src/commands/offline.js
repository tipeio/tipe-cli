import TipeCommand from './commandBase'
import { createServer } from '../utils/offline'
import { prepareShapes } from '@tipe/schema'

export default class OfflineCommand extends TipeCommand {
  run(dir, cmd) {
    this.args = cmd
    console.log('dir: ', dir)
    console.log('this.args: ', this.args)

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
