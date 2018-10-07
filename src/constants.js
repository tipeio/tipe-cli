const pkg = require('../package.json')
const path = require('path')
module.exports = {
  VERSION: pkg.version,
  NAME: pkg.name,
  DESCRIPTION: pkg.description,
  configFile: '.tipe',
  schemaPath: path.join(process.cwd(), 'tipe.graphql'),
  API_ENDPOINT: process.env.TIPE_API_URL
}
