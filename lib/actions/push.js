const { addFlags, getOptions } = require('../utils/options')
const { getUserFile } = require('../utils/paths')
const { push } = require('../utils/api')
const asyncWrap = require('../utils/async')

module.exports = program => {
  let p = program.command('push', 'Push up your templates')
  p = addFlags(p)

  return p
    .option('--dry', 'Dry run', p.BOOL)
    .option('--templates <path>', 'Path to Templates', p.STRING)
    .action(async (args, options, logger) => {
      const finalOptions = getOptions(options, args)

      let templates

      try {
        templates = JSON.parse(getUserFile(finalOptions.templates))
      } catch (e) {
        logger.error(e.message)
        process.exit(1)
      }

      if (templates.templates) {
        const [error, result] = await asyncWrap(push(templates.templates, { ...finalOptions }))
        if (error) {
          logger.error('Could not push templates')
          logger.error(error)
        }
        if (result) {
          if (result.errors) {
            // TODO: pretty print
            return logger.error(JSON.stringify(result.errors, null, 2))
          }
          logger.info('success ✅')
        }
      } else {
        logger.error('No templates')
      }
    })
}
