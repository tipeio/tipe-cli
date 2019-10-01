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
    },
  },
}
