const fs = require('fs')
const path = require('path')

beforeAll(done => {
  console.log('hello')
  const pjson = require('./package.json')
  const newPjson = {
    ...pjson,
    oclif: {
      ...pjson.oclif,
      commands: './src/commands'
    }
  }
  try {
    fs.writeFileSync(
      path.join(__dirname, 'package.json'),
      JSON.stringify(newPjson)
    )
  } catch (e) {
    done(e)
  }
  done()
})
afterAll(done => {
  const pjson = require('./package.json')
  const newPjson = {
    ...pjson,
    oclif: {
      ...pjson.oclif,
      commands: './dist/commands'
    }
  }
  try {
    fs.writeFileSync(
      path.join(__dirname, 'package.json'),
      JSON.stringify(newPjson, null, 2)
    )
  } catch (e) {
    done(e)
  }
  done()
})
