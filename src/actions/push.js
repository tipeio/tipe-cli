const { addFlags } = require('../utils/options')
const { getUserConfig } = require('../utils/config')
const { push } = require('../utils/api')
const asyncWrap = require('../utils/async')
const logSymbols = require('log-symbols')

module.exports = program => {
  let p = program.command('push', 'Push up your templates')
  p = addFlags(p)

  return p
    .option('--dry -d', 'Dry run', program.BOOL, false)
    .option('--config -c <path>', 'Path to tipe config', program.STRING, null, true)
    .action(async (args, options, logger) => {
      let allOptions
      try {
        allOptions = await getUserConfig()
      } catch (e) {
        logger.error(logSymbols.error, e.message)
        process.exit(1)
      }

      if (allOptions.config.templates) {
        const [error, result] = await asyncWrap(push(allOptions.config.templates, { ...allOptions.config }))
        if (error) {
          logger.error('Could not push templates')
          logger.error(error)
        }
        if (result) {
          if (result.errors) {
            // TODO: pretty print
            return logger.error(logSymbols.error, JSON.stringify(result.errors, null, 2))
          }
          logger.info(logSymbols.success, 'success')
        }
      } else {
        logger.error(logSymbols.error, 'No templates')
      }
    })
}
