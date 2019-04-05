const pkg = require('../package.json')
const path = require('path')

const constants = {
  VERSION: pkg.version,
  NAME: pkg.name,
  DESCRIPTION: pkg.description,
  configFile: '.tiperc',
  migrationsPath: '.tipe-migrations',
  schemaPath: path.join(process.cwd(), '.tipeshapes.js'),
  pushErrors: {
    schemaFileError: 'Schema missing Pages or Shapes'
  }
}

export default constants
