const prog = require('caporal')
const config = require('./config')
const actions = require('./actions')

prog.version(config.VERSION)

actions.forEach(action => action(prog))

prog.parse(process.argv)
