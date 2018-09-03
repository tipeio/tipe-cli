const { getToken } = require('../utilities')
const requiredAuth = {
  pull: true,
  push: true
}

const checkAuth = function(options) {
  const command = options.Command
  if (requiredAuth[command.id]) {
    try {
      getToken()
    } catch (e) {
      this.error(e)
    }
  }
}

module.exports = checkAuth
