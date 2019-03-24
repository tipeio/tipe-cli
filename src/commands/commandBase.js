import _ from 'lodash'
import Ora from 'ora'
import chalk from 'chalk'
import boxen from 'boxen'
import wrapAnsi from 'wrap-ansi'

export default class TipeCommand {
  logtag = chalk.gray.bold('tipe')

  validate(validCommands, userArgs) {
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
            this.error('nothing we can do for you')
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

  isThere(val) {
    return !_.isUndefined(val) && !_.isNil(val) && !_.isNaN(val)
  }

  log(message) {
    if (message) {
      console.log(`${this.logtag} ${message}`)
    }
  }

  warning(message) {
    if (message) {
      console.log(`${this.logtag} ${chalk.bold.yellow('warn')} ${message}`)
    }
  }

  error(message) {
    if (message) {
      console.log(`${this.logtag} ${chalk.bold.red('error')} ${message}`)
    }

    process.exit(1)
  }

  maxCharsPerLine() {
    return ((process.stdout.columns || 100) * 80) / 100
  }

  indent(count, chr = ' ') {
    return chr.repeat(count)
  }

  indentLines(string, spaces, firstLineSpaces) {
    const lines = Array.isArray(string) ? string : string.split('\n')
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
    string,
    spaces,
    firstLineSpaces,
    charsPerLine = this.maxCharsPerLine()
  ) {
    return this.indentLines(
      wrapAnsi(string, charsPerLine),
      spaces,
      firstLineSpaces
    )
  }

  box(message, title, options) {
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

  successBox(message, title) {
    return this.box(message, title || chalk.green('✔ Tipe Success'), {
      borderColor: 'green'
    })
  }

  warningBox(message, title) {
    return this.box(message, title || chalk.yellow('⚠ Tipe Warning'), {
      borderColor: 'yellow'
    })
  }

  errorBox(message, title) {
    this.box(message, title || chalk.red('✖ Tipe Error'), {
      borderColor: 'red'
    })
    process.exit(1)
  }

  startAction(text) {
    const spinner = new Ora({ text, color: 'magenta' })
    spinner.start()
    this.spinner = spinner

    return spinner
  }

  updateAction(type, text, add = false) {
    if (this.spinner) {
      const method = this.spinner[type]

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
