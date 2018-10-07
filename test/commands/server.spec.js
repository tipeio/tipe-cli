import { expect, test } from '@oclif/test'

describe('server', () => {
  test
    .stdout()
    .command(['server', '-s', './test/helpers/tipe-schema.graphql'])
    .it('runs server', ctx => {
      expect(ctx.stdout).contain('Server ready at http://localhost:4000')
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
      expect(ctx.stdout).contain('Server ready at http://localhost:3000')
    })
})
