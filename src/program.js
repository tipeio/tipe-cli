#!/usr/bin/env node
import program from 'commander'
import { Offline, Push } from './commands'

const push = new Push()
const offline = new Offline()

program
  .version('0.1.0')
  .command('push')
  .option('-d', '--dry-run')
  .option('-s', '--schema')
  .option('-p', '--project')
  .option('-a', '--apikey')
  .option('-A', '--api')
  .action(push.run.bind(push))

program
  .command('offline')
  .option('-s', '--schema')
  .option('-p', '--port')
  .action(offline.run.bind(offline))

program.parse(process.argv)
