const { configFile } = require('./constants')
const fs = require('fs')

function getToken(noError) {
  let token = process.env.TIPE_TOKEN
  if (!token) {
    try {
      token = fs.readFileSync(configFile).toString()
    } catch (e) {
      token = null
    }
  }
  if (!noError && !token) {
    throw new Error(
      'Environment variable TIPE_TOKEN needs to be set or set in your .tipe config file.'
    )
  }
  return token
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

module.exports = {
  getToken,
  validateEmail
}
