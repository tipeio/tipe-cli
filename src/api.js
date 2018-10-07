const fetch = require('node-fetch')
const fs = require('fs')

const { API_ENDPOINT } = require('./constants')
const { getToken } = require('./utilities')

async function pull(fileName) {
  return fetch(`${API_ENDPOINT}/schema`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getToken()
    }
  })
    .then(async res => {
      if (res.status === 200) {
        const { data } = await res.json()
        fs.writeFileSync(`${fileName}.graphql`, data)
        return
      }
      throw new Error('Error: Schema not found based on project ID')
    })
    .catch(err => {
      console.log(err)
    })
}

async function push(schemaFile) {
  return fetch(`${API_ENDPOINT}/schema`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getToken()
    },
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
