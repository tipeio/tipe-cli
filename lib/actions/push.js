const addOptions = require('../utils/options')

module.exports = program => {
  const p = addOptions(program)
  return p
    .command('push', 'Push up your templates')
    .option('--dry', 'Dry run')
    .action((args, options, logger) => {
      logger.info('pushing')
    })
}
