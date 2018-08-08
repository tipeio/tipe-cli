const { GraphQLNonNull } = require('graphql')
const resolve = () => {}

export const create = (type, schemaTemplateData, userSchema) => {
  return {
    resolve,
    type: new GraphQLNonNull(userSchema.getType(type.name))
  }
}

export const remove = (type, schemaTemplateData, userSchema) => {
  return {
    resolve,
    type: new GraphQLNonNull(userSchema.getType(type.name))
  }
}

export const update = (type, schemaTemplateData, userSchema) => ({
  resolve,
  type: new GraphQLNonNull(userSchema.getType(type.name))
})