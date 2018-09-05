const pkg = require('../package.json')

module.exports = {
  VERSION: pkg.version,
  NAME: pkg.name,
  DESCRIPTION: pkg.description,
  configFile: '.tipe',
  DEV_API_ENDPOINT: 'http://localhost:3001'
}
