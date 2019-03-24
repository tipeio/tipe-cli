import { cli } from 'cli-ux'
import _ from 'lodash'
import chalk from 'chalk'

export default class TipeCommand {
  logtag = '[tipe]: '

  validate(validCommands, userArgs) {
    return _.reduce(
      validCommands,
      (finalArgs, flag, flagName) => {
        const value = userArgs[flagName]
        const name = flag.complete || flagName
        const completeFlag = validCommands[flag.complete] || flag
        const parse =
          completeFlag.parse ||
          function(v) {
            return v
          }

        if (!this.isThere(value) && completeFlag.required) {
          const flagDefault = completeFlag.default
            ? completeFlag.default()
            : null

          if (!this.isThere(flagDefault)) {
            this.error('nothing we can do for you')
          }

          finalArgs[name] = finalArgs[name] || flagDefault
        }

        if (!this.isThere(value)) return finalArgs

        finalArgs[name] = parse(value)
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
