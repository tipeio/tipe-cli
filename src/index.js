#!/usr/bin/env node

const program = require('commander');
const fs = require('fs.promised');

const { getActionFilePaths } = require('./utilities');
const pkg = require('../package.json');

;(async () => {
  const actions = await getActionFilePaths();

  program
  .version(pkg.version);

  actions.forEach(actionPath => require(actionPath))

  // error on unknown commands
  program.on('command:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
  });

  program.parse(process.argv);
})();