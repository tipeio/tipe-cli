import { test } from '@oclif/test'
import config from '../../src/config'

describe('push', () => {
  test
    .stdout({ print: true })
    .nock(config.API_ENDPOINT, api =>
      api.post('/api/1/conflicts').reply(201, {
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
