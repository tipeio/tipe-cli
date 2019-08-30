const prog = require('caporal')
const config = require('./config')

prog
  .version(config.VERSION)
  .command('hello', 'Test command')
  .argument('<message>', 'message to print', prog.STRING)
  .option('--other', 'some flag')
  .action((args, options, logger) => {
    logger.info(args)
    logger.info(options)
  })

prog.parse(process.argv)
