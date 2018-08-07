const path = require('path')
const TEMPLATES_PATH = path.join(__dirname, '../templates')
module.exports = {
  TEMPLATES_PATH,
  ACTION_PATH: path.join(__dirname, './actions')
}
