const { push } = require('../../utils/api')

describe('Push', () => {
  test('push will validate templates', async () => {
    const badTemplates = [
      {
        id: 'home',
        name: 'home',
        fields: [{ id: 'title', name: 'title', type: 'text' }],
      },
      {
        id: 'about',
        name: 'about',
        fields: [{ id: 'title', name: 'title' }],
      },
    ]

    const foo = push(badTemplates, { project: 'asdf', apikey: 'asdf', dry: false, api: 'asdf' })

    expect(foo).toBeTruthy()
  })
})
