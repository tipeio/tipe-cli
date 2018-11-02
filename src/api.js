import got from 'got'
import { asyncWrap } from './utils/async'

const { API_ENDPOINT } = require('./constants')

export const checkForSchemaConflicts = (project, apiKey) => {
  return asyncWrap(
    got(`/api/${project}/conflicts`, {
      baseUrl: API_ENDPOINT,
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey
      }
    })
  )
}

export const push = (schema, project, apiKey) => {
  return asyncWrap(
    got(`/api/${project}/schema`, {
      baseUrl: API_ENDPOINT,
      method: 'POST',
      json: true,
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
