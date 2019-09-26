const path = require('path')

module.exports = {
  configFile: '.tipeconfig.json',
  schemaPath: path.join(process.cwd(), 'tipe.json'),
}
