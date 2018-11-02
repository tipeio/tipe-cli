import got from 'got'
import { asyncWrap } from './utils/async'

const { API_ENDPOINT } = require('./constants')

export const pull = fileName => {}

export const fetchRawSchema = (project, apiKey) => {
  return asyncWrap(
    got(`/project/${project}`, {
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
    got(`/${project}/schema`, {
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
