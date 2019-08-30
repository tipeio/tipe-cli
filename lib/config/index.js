const { merge } = require('lodash')
const pkg = require('../../package.json')

process.env.NODE_ENV = process.env.NODE_ENV || 'developement'

const env = process.env.NODE_ENV
const base = {
  env,
  VERSION: pkg.version,
  NAME: pkg.name,
  DESCRIPTION: pkg.description,
}

let envConfig = {
  API_ENDPOINT: 'default',
}

switch (env) {
  case 'prod':
  case 'production':
    envConfig = require('./production')
    break
  case 'local':
  case 'dev':
  case 'development':
    require('dotenv').config()
    envConfig = require('./development')
    break
  case 'test':
  case 'testing':
    require('dotenv').config()
    envConfig = require('./test')
    break
  default:
    envConfig = require('./development')
}

module.exports = merge({}, base, envConfig)
