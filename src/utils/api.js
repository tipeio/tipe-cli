const axios = require('axios')
const config = require('../config')
const _ = require('lodash')
const { validateTemplates } = require('@tipe/schema')

const createClient = api =>
  axios.create({
    baseURL: api,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'json',
  })

const push = (templates, { project, apikey, dry, api = config.API_ENDPOINT }) => {
  // Validate templates
  const validation = validateTemplates(templates)
  const errors = _.flatten(validation.filter(e => e !== true)).map(error => {
    return {
      code: 200,
      message: `Template format is incorrect. ${error.message} at field "${error.field}"`,
    }
  })

  if (errors.length) {
    return Promise.resolve([errors])
  }

  return createClient(api)
    .post(
      `/api/${project}/updateTemplates`,
      { templates, dry },
      {
        headers: {
          Authorization: apikey,
        },
      },
    )
    .then(r => r.data)
}

module.exports = { push }
