import { test } from '@oclif/test'
process.env.TIPE_API_URL = 'http://localhost:6000'
const { API_ENDPOINT } = require('../../src/constants')

describe('push', () => {
  const schema = `
  type Author implements Document {
    _meta: Meta!
    firstName: String!
    lastName: String!
    age: Int!
  }
  `
  test
    .stdout({ print: true })
    .nock(API_ENDPOINT, api => api.get('/1/schema').reply(200, { schema }))
    .command([
      'push',
      '-s',
      './test/helpers/tipe-schema.graphql',
      '-p',
      '1',
      '-a',
      'key'
    ])
    .it('checks for conflicts', out => {
      expect(out.stdout).toMatch(/Type missing field/)
    })
})
