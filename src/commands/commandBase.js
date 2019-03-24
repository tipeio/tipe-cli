import { cli } from 'cli-ux'
import _ from 'lodash'
import chalk from 'chalk'

export default class TipeCommand {
  logtag = '[tipe]: '

  validate(validCommands, args) {
    return _.reduce(
      args,
      (finalArgs, argValue, argKey) => {
        // console.log('argKey: ', argKey)
        // console.log('argValue: ', argValue)
        if (argKey === '_') {
          return finalArgs
        }

        let flag = validCommands[argKey]
        if (!flag) this.error('bad flag')
        flag = flag.complete ? validCommands[flag.complete] : flag
        console.log('flag: ', flag)
        const parse =
          flag.parse ||
          function(v) {
            return v
          }

        // is there a value - argValue
        // test if value is of flags value type
        // no value and required is true, error
        if (this.isThere(argValue) && flag.required) {
          const flagDefault = flag.default ? flag.default() : null
          if (this.isThere(flagDefault)) {
            this.error('error')
          }
          finalArgs[argKey] = parse(argValue)
        }
        finalArgs[argKey] = parse(argValue)
        return finalArgs
      },
      {}
    )
  }

  isThere(val) {
    return !_.isUndefined(val) && !_.isNil(val) && !_.isNaN(val)
  }

  setArgs(args) {
    console.log('args', args)
  }

  log(message) {
    console.log(`${chalk.cyan(this.logtag)}${message}`)
  }

  warn(message) {
    console.log(`${chalk.yellow(this.logtag)}${message}`)
  }

  error(error, opts = {}) {
    console.error(`${chalk.redBright(this.logtag)}${error}`, opts)
    process.exit(1)
  }

  startAction(message) {
    if (process.env.NODE_ENV !== 'testing') {
      cli.action.start(chalk.magenta(message))
    }
  }

  stopAction(message = '') {
    if (process.env.NODE_ENV !== 'testing') {
      cli.action.stop(chalk.magenta(message))
    }
  }
}
