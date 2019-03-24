import axios from 'axios'
import { asyncWrap } from './utils/async'
import config from './config'

export const push = (
  shapes,
  { project, apikey, api = config.API_ENDPOINT, 'dry-run': dryRun }
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
        `/api/${project}/updateshapes`,
        { shapes, dryRun },
        {
          headers: {
            Authorization: apikey
          }
        }
      )
      .then(r => r.data)
  )
}
