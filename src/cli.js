import argv from 'minimist'
import { Push, Offline } from './commands'

const args = argv(process.argv.slice(2))
// console.log('args: ', args)
const command = args._[0]

const commands = {
  push: Push,
  offline: Offline
}

const ValidCommand = commands[command]
const validClass = new ValidCommand(args)
validClass.run()
