import { merge } from 'lodash'

process.env.NODE_ENV = process.env.NODE_ENV || 'developement'

const env = process.env.NODE_ENV
const base = {
  env
}

let envConfig = {}

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

export default merge({}, base, envConfig)
