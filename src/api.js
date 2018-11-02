import got from 'got'
import { asyncWrap } from './utils/async'
import config from './config'

export const checkForSchemaConflicts = (project, apiKey, schema) => {
  return asyncWrap(
    got(`/api/${project}/conflicts`, {
      baseUrl: config.API_ENDPOINT,
      method: 'POST',
      json: true,
      body: {
        schema
      },
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
      baseUrl: config.API_ENDPOINT,
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
