import axios from 'axios'
import { asyncWrap } from './utils/async'
import config from './config'

export const push = (
  shapes,
  { projectId, apiKey, url = config.API_ENDPOINT, dryRun = false }
) => {
  const api = axios.create({
    baseURL: url,
    headers: {
      'Content-Type': 'application/json'
    },
    responseType: 'json'
  })

  return asyncWrap(
    api
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
