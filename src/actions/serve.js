const boxen = require('boxen')
const logSymbols = require('log-symbols')
const chalk = require('chalk')
const chokidar = require('chokidar')
const { mergeOptions } = require('../utils/config')
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
      let [error, finalOptions] = await asyncWrap(mergeOptions(options))

      if (error) {
        logger.error(logSymbols.error, error.message)
        return process.exit(1)
      }

      let watcher

      if (finalOptions.watch) {
        watcher = chokidar.watch(finalOptions.config, {
          ignored: /(^|[/\\])\../ // ignore dotfiles
        })
      }

      try {
        await startServer(finalOptions, watcher, { logger })
      } catch (e) {
        process.exit(1)
      }

      const url = `http://localhost:${finalOptions.port}`
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
