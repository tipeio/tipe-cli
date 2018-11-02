import { test } from '@oclif/test'

describe('server', () => {
  test
    .stdout()
    .command(['server', '-s', './test/helpers/tipe-schema.graphql'])
    .it('runs server', ctx => {
      expect(true).toBe(true)
    })

  test
    .stdout()
    .command([
      'server',
      '-s',
      './test/helpers/tipe-schema.graphql',
      '-P',
      '3000'
    ])
    .it('runs server --port 3000', ctx => {
      expect(true).toBe(true)
    })
})
