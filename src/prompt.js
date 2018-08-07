const prompt = require('prompt')

let start = null

function get (inputs) {
  if (!start) {
    prompt.start()
    start = true
  }
  return new Promise(resolve => {
    prompt.get(inputs, function (err, result) {
      if (err) {
        return resolve([err])
      }
      return resolve([null, result])
    })
  })
}

module.exports = {
  start() {
    start = true
    prompt.start()
  },
  get
}
