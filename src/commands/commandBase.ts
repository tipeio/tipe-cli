import _ from 'lodash'
import Ora, { Ora as OraInterface } from 'ora'
import chalk from 'chalk'
import boxen from 'boxen'
import wrapAnsi from 'wrap-ansi'
import { CommandFlag, CommandFlagConfig, CommandArgs } from '../../types'

export default class TipeCommand {
  logtag = chalk.gray.bold('tipe')
  spinner: OraInterface

  validate(validCommands: CommandFlagConfig, userArgs: object): any {
    return _.reduce(
      validCommands,
      (finalArgs, flag, flagName) => {
        const value = userArgs[flagName]
        const name = flag.complete || flagName
        const completeFlag = validCommands[flag.complete] || flag
        const flagDefault = completeFlag.default ? completeFlag.default() : null

        const parse =
          completeFlag.parse ||
          function(v) {
            return v
          }

        if (!this.isThere(value)) {
          if (completeFlag.required && !this.isThere(flagDefault)) {
            this.error('Required flag', 'missing defaults and no args passed')
          }

          finalArgs[name] = finalArgs[name] || flagDefault
          return finalArgs
        }

        finalArgs[name] = parse(value)
        return finalArgs
      },
      {}
    )
  }

  isThere(val: string) {
    return !_.isUndefined(val) && !_.isNil(val) && !_.isNaN(val)
  }

  log(message: string) {
    if (message) {
    }
  }

  warning(message: string) {
    if (message) {
    }
  }

  error(errorType: string, message: string) {
    if (message) {
      console.log(`${chalk.yellow(errorType)}: ${chalk.red(message)}`)
    }

    process.exit(1)
  }

  maxCharsPerLine() {
    return ((process.stdout.columns || 100) * 80) / 100
  }

  indent(count: number, chr: string = ' ') {
    return chr.repeat(count)
  }

  indentLines(string: string, spaces: number, firstLineSpaces: number) {
    const lines: Array<string> = Array.isArray(string)
      ? string
      : string.split('\n')
    let s = ''
    if (lines.length) {
      const i0 = this.indent(
        firstLineSpaces === undefined ? spaces : firstLineSpaces
      )
      s = i0 + lines.shift()
    }
    if (lines.length) {
      const i = this.indent(spaces)
      s += '\n' + lines.map(l => i + l).join('\n')
    }
    return s
  }

  foldLines(
    string: string,
    spaces: number,
    firstLineSpaces: number,
    charsPerLine: number = this.maxCharsPerLine()
  ) {
    return this.indentLines(
      wrapAnsi(string, charsPerLine),
      spaces,
      firstLineSpaces
    )
  }

  box(message: string, title: string, options: object) {
    return (
      boxen(
        [
          title || chalk.white('Tipe Message'),
          '',
          chalk.white(this.foldLines(message, 0, 0, this.maxCharsPerLine()))
        ].join('\n'),
        Object.assign(
          {
            borderColor: 'white',
            borderStyle: 'round',
            padding: 1,
            margin: 1
          },
          options
        )
      ) + '\n'
    )
  }

  successBox(message: string, title: string) {
    return this.box(message, title || chalk.green('✔ Tipe Success'), {
      borderColor: 'green'
    })
  }

  warningBox(message: string, title: string) {
    return this.box(message, title || chalk.yellow('⚠ Tipe Warning'), {
      borderColor: 'yellow'
    })
  }

  errorBox(message: string, title: string) {
    this.box(message, title || chalk.red('✖ Tipe Error'), {
      borderColor: 'red'
    })
    process.exit(1)
  }

  startAction(text: string) {
    const spinner: OraInterface = Ora({ text, color: 'magenta' })
    spinner.start()
    this.spinner = spinner

    return spinner
  }

  updateAction(spinnerType: string, text: string, add: boolean = false) {
    if (this.spinner) {
      const method = this.spinner[spinnerType]

      if (method) {
        if (add) {
          method.call(this.spinner)
          this.spinner.text = text
        } else {
          method.call(this.spinner, text)
        }
      }
      return this.spinner
    }
  }

  stopAction() {
    if (this.spinner) {
      this.spinner.stopAndPersist()
      this.spinner = null
    }
  }
}
