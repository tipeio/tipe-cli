const fetch = require('node-fetch')
const { DEV_API_ENDPOINT } = require('./constants')
const { store } = require('./utilities')
const fs = require('fs.promised')

async function pull(projectId, fileName) {
  return fetch(`${DEV_API_ENDPOINT}/schema/${projectId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(async res => {
      if (res.status === 200) {
        const { data } = await res.json()
        const error = fs.writeFileSync(`${fileName}.graphql`, data)
        if (error) {
          throw new Error(error)
        }
        console.log('Success!')
        return
      }
      throw new Error('Error: Schema not found based on project ID')
    })
    .catch(err => {
      console.log(err)
    })
}

async function push(projectId, schemaFile) {
  return fetch(`${DEV_API_ENDPOINT}/schema/${projectId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      schema: schemaFile
    })
  })
    .then(async res => {
      if (res.status === 201) {
        console.log('Success!')
        return
      }
      throw new Error('Error: Unable to push your local schema. Try again.')
    })
    .catch(err => {
      console.log(err)
    })
}

module.exports = {
  pull,
  push
}
