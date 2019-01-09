const { Shape, types } = require('@tipe/schema')

module.exports = [
  new Shape('Author', {
    name: {
      type: 'not a real type'
    },
    age: {
      type: types.number
    }
  }),
  new Shape('Post', {
    author: {
      type: types.shape,
      ref: 'Person'
    }
  })
]
