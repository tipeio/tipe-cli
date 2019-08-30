const axios = require('axios')
const config = require('../config')

const createClient = api =>
  axios.create({
    baseURL: api,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'json',
  })

const push = (templates, { project, apikey, api = config.API_ENDPOINT, 'dry-run': dryRun }) =>
  createClient(api)
    .post(
      `/api/${project}/updatetemplates`,
      { templates, dryRun },
      {
        headers: {
          Authorization: apikey,
        },
      },
    )
    .then(r => r.data)

module.exports = { push }
