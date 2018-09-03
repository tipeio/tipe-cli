const _ = require('lodash')
const fetch = require('node-fetch')
const { AUTH_ENDPOINT, DEV_API_ENDPOINT } = require('./constants')
const { store, validateEmail } = require('./utilities')
const fs = require('fs.promised')

function cleanResponse(data) {
  const password = _.has(data, 'user.providers.local.password')
  if (password) {
    data.user.providers.local.password = '●●●●●●●●'
  }
  return data
}

async function emailSignup(email, password) {
  if (!validateEmail(email)) {
    console.log('Email must be valid, try again.')
    process.exit(1)
  }

  const res = await fetch(`${AUTH_ENDPOINT}/local/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
    .then(res => {
      if (res.status === 429) {
        throw new Error('Rate Limit')
      } else if (res.status === 404) {
        throw new Error('Error')
      } else if (res.status === 204) {
        throw new Error(
          'Email not unique. Passwords must be atleast 8 chatacters long with no spaces'
        )
      } else if (res.status === 500) {
        throw new Error(
          'There was an unexpected server error, please try again.'
        )
      }
      return res.json()
    })
    .then(res => {
      const { token, ...user } = cleanResponse(res)
      store.set('user', user)
      store.set('token', token)
    })
    .catch(err => {
      console.log(err)
    })
  return res
}

async function emailSignin(email, password) {
  if (!validateEmail(email)) {
    console.log('Email must be valid, try again.')
    process.exit(1)
  }

  const res = await fetch(`${AUTH_ENDPOINT}/local/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
    .then(res => {
      if (res.status === 429) {
        throw new Error('Rate Limit')
      } else if (res.status === 404) {
        throw new Error('Error')
      } else if (res.status === 204) {
        throw new Error(
          'No user found with email and password. Passwords are case sensitive.'
        )
      }
      return res.json()
    })
    .then(res => {
      const { token, ...user } = cleanResponse(res)
      store.set('user', user)
      store.set('token', token)
    })
    .catch(err => {
      console.log(err)
    })
  return res
}

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
  emailSignin,
  emailSignup,
  pull,
  push
}