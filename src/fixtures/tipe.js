module.exports = {
  templates: {
    home: {
      name: 'Home',
      fields: {
        title: {
          name: 'Title',
          type: 'text',
          mocks: ['yolo this is some text here']
        },
        someCode: {
          name: 'Some Code',
          type: 'code',
          mocks: [`const me = 'hello'`]
        }
      },
      refs: {
        performanceFeature: {
          name: 'Performance Feature',
          type: 'homeFeature'
        },
        authors: {
          name: 'Authors',
          list: true,
          type: 'author'
        }
      }
    },

    homeFeature: {
      name: 'Feature',
      fields: {
        title: {
          name: 'header',
          type: 'text',
          mocks: ['feature header here']
        },
        icon: {
          name: 'icon',
          type: 'image'
        }
      },
      skuIds: ['skuu', 'robot123']
    },
    author: {
      name: 'Author',
      fields: {
        title: {
          name: 'Title',
          type: 'html'
        },
        name: {
          name: 'name',
          type: 'text'
        }
      }
    }
  }
}
