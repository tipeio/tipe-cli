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

export const push = (shapes, project, apiKey) => {
  return asyncWrap(
    api
      .post(
        `/api/${project}/updateshapes`,
        { shapes },
        {
          headers: {
            Authorization: apiKey
          }
        }
      )
      .then(r => r.data)
  )
}
