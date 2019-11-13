const { push } = require('../../utils/api')

describe('Push', () => {
  /**
   * need to rethink tests
   */
  xtest('push will validate template Object', async () => {
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
