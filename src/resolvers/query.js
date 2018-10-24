const { simplify } = require('graphql-parse-resolve-info')
const genFakeContent = require('./fake')

export const getOne = (_, args, { parsedInfo, schemaContext, type }, info) => {
  const queryInfo = simplify(
    parsedInfo,
    schemaContext.rawSchema.getType(type.name)
  )
  return genFakeContent(queryInfo, type.fields, schemaContext)
}

export const getMany = (_, args, { parsedInfo, schemaContext, type }, info) => {
  const queryInfo = simplify(
    parsedInfo,
    schemaContext.rawSchema.getType(type.name)
  )
  return [3].map(() => genFakeContent(queryInfo, type.fields, schemaContext))
}

export const getPage = (_, args, { parsedInfo, schemaContext, type }, info) => {
  const queryInfo = simplify(
    parsedInfo,
    schemaContext.rawSchema.getType(type.name)
  )
  return genFakeContent(queryInfo, type.fields, schemaContext)
}
