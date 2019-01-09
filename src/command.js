import { Command } from '@oclif/command'
import { cli } from 'cli-ux'
import chalk from 'chalk'

export class TipeCommand extends Command {
  logtag = '[tipe]: '

  log(message) {
    super.log(chalk.cyanBright(`${this.logtag}${message}`))
  }

  warn(message) {
    super.log(chalk.yellow(`${this.logtag}${message}`))
  }

  error(error, opts = {}) {
    super.error(chalk.redBright(`${this.logtag}${error}`), opts)
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
