const path = require('path')
const fs = require('fs')

const resolveToUser = file => path.resolve(process.cwd(), file)

const getUserFile = file =>
  fs.readFileSync(resolveToUser(file), { encoding: 'utf-8' })

module.exports = {
  getUserFile,
  resolveToUser
}
