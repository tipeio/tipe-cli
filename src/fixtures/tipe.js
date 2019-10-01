module.exports = {
  templates: {
    home: {
      name: 'Home',
      fields: {
        title: {
          name: 'Title',
          type: 'text',
          mocks: ['yolo this is some text here'],
        },
        someCode: {
          name: 'Some Code',
          type: 'code',
          mocks: [`const me = 'hello'`],
        },
      },
      refs: {
        performanceFeature: {
          name: 'Performance Feature',
          type: 'homeFeature',
        },
      },
    },

    homeFeature: {
      name: 'Feature',
      fields: {
        title: {
          name: 'header',
          type: 'text',
          mocks: ['feature header here'],
        },
        icon: {
          name: 'icon',
          type: 'image',
        },
      },
    },
  },
}
