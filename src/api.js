import got from 'got'
import { asyncWrap } from './utils/async'

const { API_ENDPOINT } = require('./constants')

export const pull = fileName => {}

export const push = (schema, project, apiKey) => {
  return asyncWrap(
    got(`/${project}/schema`, {
      baseUrl: API_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey
      },
      body: {
        schema
      }
    })
  )
}
