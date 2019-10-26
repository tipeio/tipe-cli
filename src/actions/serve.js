const boxen = require('boxen')
const logSymbols = require('log-symbols')
const chalk = require('chalk')

const { getUserConfig } = require('../utils/config')
const asyncWrap = require('../utils/async')
const { startServer } = require('../server')

module.exports = program => {
  const p = program.command('serve', 'Push up your templates')

  return p
    .option('--port <port>', 'Port for offline mock API', program.INT, 8300)
    .option(
      '--config -c <path>',
      'Path to config file',
      program.STRING,
      'tipe.js'
    )
    .option(
      '--watch -w <watch>',
      'Watch tipe.js for changes',
      program.BOOL,
      true
    )
    .action(async (__, options, logger) => {
      let [error, allOptions] = await asyncWrap(getUserConfig())

      if (error) {
        logger.error(logSymbols.error, error.message)
        return process.exit(1)
      }

      if (!allOptions.config.templates) {
        logger.error(logSymbols.error, 'Missing templates')
        return process.exit(1)
      }
      // pass templates into options
      options.templates = allOptions.config.templates
      startServer(options)

      const url = `http://localhost:${options.port}`
      const message = `${chalk.magenta.bold(
        'Tipe'
      )} offline mock API\n\n${chalk.white.underline(url)}`

      console.log(
        boxen(message, {
          padding: 1,
          margin: 1,
          borderColor: 'green',
          borderStyle: 'single'
        })
      )
    })
}
