const { expect, test } = require('@oclif/test')
const path = require('path')

describe('server', () => {
  test
    .stdout()
    .command([
      'server',
      `${path.join(__dirname, './../helpers/tipe-schema.graphql')}`
    ])
    .it('runs server', ctx => {
      expect(ctx.stdout).contain('Server ready at http://localhost:4000')
    })

  test
    .stdout()
    .command([
      'server',
      `${path.join(__dirname, './../helpers/tipe-schema.graphql')}`,
      '--port',
      '3000'
    ])
    .it('runs server --port 3000', ctx => {
      expect(ctx.stdout).contain('Server ready at http://localhost:3000')
    })
})
