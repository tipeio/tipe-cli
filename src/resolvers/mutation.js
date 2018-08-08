const { GraphQLNonNull } = require('graphql')
const resolve = () => {}

const create = (type, schemaTemplateData, userSchema) => {
  return {
    resolve,
    type: new GraphQLNonNull(userSchema.getType(type.name))
  }
}

const remove = (type, schemaTemplateData, userSchema) => {
  return {
    resolve,
    type: new GraphQLNonNull(userSchema.getType(type.name))
  }
}

const update = (type, schemaTemplateData, userSchema) => ({
  resolve,
  type: new GraphQLNonNull(userSchema.getType(type.name))
})

module.exports = {
  create,
  remove,
  update
}
