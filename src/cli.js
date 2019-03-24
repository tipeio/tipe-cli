#!/usr/bin/env node

import argv from 'minimist'
import { Push, Offline, NewCommand, Help } from './commands'

const args = argv(process.argv.slice(2))
const command = args._[0]

if (command === 'help') {
  console.log(Help())
  process.exit(0)
}

const commands = {
  push: Push,
  offline: Offline,
  new: NewCommand
}

const ValidCommand = commands[command]

const validClass = new ValidCommand(args)
validClass.run()
