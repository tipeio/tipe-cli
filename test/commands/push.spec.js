import { test } from '@oclif/test'
process.env.TIPE_API_URL = 'http://localhost:6000'
const { API_ENDPOINT } = require('../../src/constants')

describe('push', () => {
  test
    .stdout({ print: true })
    .nock(API_ENDPOINT, api =>
      api.get('/api/1/conflicts').reply(200, {
        data: {
          hasConflicts: true,
          conflicts: { 'Type missing field': ['age'] }
        }
      })
    )
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
