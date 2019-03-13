import axios from 'axios'
import { asyncWrap } from './utils/async'
import config from './config'

export const push = (
  shapes,
  { projectId, apiKey, api = config.API_ENDPOINT, dryRun = false }
) => {
  const http = axios.create({
    baseURL: api,
    headers: {
      'Content-Type': 'application/json'
    },
    responseType: 'json'
  })

  return asyncWrap(
    http
      .post(
        `/api/${projectId}/updateshapes`,
        { shapes, dryRun },
        {
          headers: {
            Authorization: apiKey
          }
        }
      )
      .then(r => r.data)
  )
}
