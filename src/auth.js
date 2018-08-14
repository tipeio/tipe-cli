const _ = require('lodash')
const fetch = require('node-fetch')
const { AUTH_ENDPOINT } = require('./constants')

function cleanResponse(data) {
  const password = _.has(data, 'user.providers.local.password')
  if (password) {
    data.user.providers.local.password = '●●●●●●●●'
  }
  return data
}

async function emailSignup(email, password) {
  const res = await fetch(`${AUTH_ENDPOINT}/local`, {
    method: 'post',
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
        console.log('Rate Limit')
      }
      if (res.status === 404) {
        console.log('Error')
        return Promise.reject(res)
      }
      return res.json()
    })
    .then(data => [null, cleanResponse(data)])
    .catch(err => [err])
  return res
}

async function emailSignin(email, password) {
  const res = await fetch(`${AUTH_ENDPOINT}/local`, {
    method: 'put',
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
        console.log('Rate Limit')
      }
      if (res.status === 404) {
        console.log('Error')
        return Promise.reject(res)
      }
      return res.json()
    })
    .then(data => [null, cleanResponse(data)])
    .catch(err => [err])
  return res
}

module.exports = {
  emailSignin,
  emailSignup
}
