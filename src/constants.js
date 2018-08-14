const path = require('path')
const pkg = require('../package.json')
const TEMPLATES_PATH = path.join(__dirname, '../templates')

module.exports = {
  VERSION: pkg.version,
  NAME: pkg.name,
  STORE_NAME: 'tipe',
  DESCRIPTION: pkg.description,
  TEMPLATES_PATH,
  ACTION_PATH: path.join(__dirname, './actions'),
  AUTH_ENDPOINT: 'http://localhost:3000/api/auth'
}
