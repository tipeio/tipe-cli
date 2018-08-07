const fs = require('fs.promised');
const path = require('path');
const program = require('commander');

const {  } = require('../utilities');
const {  } = require('../constants');

program
  .command('login')
  .action(action);

async function action(name) {
  const CURRENT_DIR = process.cwd();

  console.log('hello world')
}
