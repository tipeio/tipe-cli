import axios from 'axios'
import { asyncWrap } from './utils/async'
import config from './config'

const api = axios.create({
  baseURL: config.API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json'
  },
  responseType: 'json'
})

export const push = (shapes, { projectId, apiKey, dryRun = false }) => {
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
