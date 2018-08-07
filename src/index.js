const program = require('commander')
const { getActionFilePaths } = require('./utilities')
const { VERSION, DESCRIPTION } = require('./constants')
;(async () => {
  const actions = await getActionFilePaths()

  program.version(VERSION).description(DESCRIPTION)

  actions.forEach(actionPath => require(actionPath))

  // error on unknown commands
  program.on('command:*', function() {
    console.error(
      'Invalid command: %s\nSee --help for a list of available commands.',
      program.args.join(' ')
    )
    process.exit(1)
  })

  program.parse(process.argv)
})()
