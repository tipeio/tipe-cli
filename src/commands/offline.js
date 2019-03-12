import { TipeCommand } from '../command'
import { schemaFlag, portFlag } from '../utils/flags'
import { createServer } from '../utils/offline'
import { getUserArgs } from '../utils/args'
import { prepareShapes } from '@tipe/schema'
const DEFAULT_PORT = 4001

export default class OfflineCommand extends TipeCommand {
  run() {
    const { flags } = this.parse(OfflineCommand)
    this.args = getUserArgs.call(this, flags, false)

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
        const port = this.args.port || DEFAULT_PORT
        this.server = await startServer(port)

        this.log(`offline API @ http://localhost:${port}`)
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

OfflineCommand.flags = {
  ...schemaFlag,
  ...portFlag
}

OfflineCommand.description =
  'Start a local API with mock cotent based off your shapes.'
