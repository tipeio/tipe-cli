const path = require('path')
const pkg = require('../package.json')
const TEMPLATES_PATH = path.join(__dirname, '../templates')

module.exports = {
  VERSION: pkg.version,
  NAME: pkg.name,
  DESCRIPTION: pkg.description,
  TEMPLATES_PATH,
  ACTION_PATH: path.join(__dirname, './actions'),
  DEV_API_ENDPOINT: 'http://localhost:3001'
}
