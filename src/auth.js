const _ = require('lodash')
const fetch = require('node-fetch')
const { AUTH_ENDPOINT } = require('./constants')
const { store, validateEmail } = require('./utilities')

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

module.exports = {
  emailSignin,
  emailSignup
}
