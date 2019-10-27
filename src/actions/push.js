const { addFlags } = require('../utils/options')
const { mergeOptions, getUserConfig } = require('../utils/config')
const { push } = require('../utils/api')
const { formatTemplateErrors } = require('../utils/templates')
const asyncWrap = require('../utils/async')
const logSymbols = require('log-symbols')

module.exports = program => {
  let p = program.command('push', 'Push up your templates')
  p = addFlags(p)

  return p
    .option('--dry -d', 'Dry run', program.BOOL, false)
    .option(
      '--config -c <path>',
      'Path to tipe config',
      program.STRING,
      null,
      true
    )
    .action(async (args, options, logger) => {
      let finalOptions
      try {
        finalOptions = await mergeOptions(options)
      } catch (e) {
        logger.error(logSymbols.error, e.message)
        return process.exit(1)
      }

      const userConfig = getUserConfig(options.config)

      if (!userConfig || !userConfig.templates) {
        logger.error(logSymbols.error, 'No templates')
        return process.exit(1)
      }

      const [error, result] = await asyncWrap(
        push(userConfig.templates, finalOptions)
      )

      if (error) {
        logger.error('Could not push templates')
        logger.error(error)
      }

      if (result) {
        if (result.errors) {
          // TODO: pretty print
          return logger.info(formatTemplateErrors(result.errors))
        }

        logger.info(logSymbols.success, 'success')
      }
    })
}
