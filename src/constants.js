const pkg = require('../package.json')
const path = require('path')
module.exports = {
  VERSION: pkg.version,
  NAME: pkg.name,
  DESCRIPTION: pkg.description,
  configFile: '.tiperc',
  migrationsPath: '.tipe-migrations',
  schemaPath: path.join(process.cwd(), 'tipe.graphql')
}
