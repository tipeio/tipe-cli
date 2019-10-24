const { push } = require('../../utils/api')

describe('Push', () => {
  test('push will validate template Array', async () => {
    const templates = [
      {
        id: 'home',
        name: 'home',
        fields: [{ id: 'title', name: 'title', type: 'text' }]
      },
      {
        id: 'about',
        name: 'about',
        fields: [{ id: 'title', name: 'title' }]
      }
    ]

    const validation = await push(templates, {
      project: 'asdf',
      apikey: 'asdf',
      dry: false,
      api: 'asdf'
    })

    expect(validation[0][0].code).toBeTruthy()
  })

  test('push will validate template Object', async () => {
    const templates = {
      feature: {
        name: 'Feature',
        id: 'feature',
        fields: {
          image: {
            type: 'image',
            name: 'feature image'
          },
          header: {
            type: 'text',
            name: 'feature header'
          },
          subHeader: {
            name: 'feature subheader'
          }
        }
      }
    }

    const validation = await push(templates, {
      project: 'asdf',
      apikey: 'asdf',
      dry: false,
      api: 'asdf'
    })

    expect(validation[0][0].code).toBeTruthy()
  })
})
