const { parseResolveInfo, simplify } = require('graphql-parse-resolve-info')
const genFakeContent = require('./fake')

const getOne = (type, schemaTemplateData, userSchema) => {
  return {
    resolve(_, args, ctx, info) {
      const parsedInfo = parseResolveInfo(info)
      const queryInfo = simplify(parsedInfo, userSchema.getType(type.name))
      return genFakeContent(queryInfo, type.fields, schemaTemplateData)
    }
  }
}

const getMany = (type, schemaTemplateData, userSchema) => {
  return {
    resolve(_, args, ctx, info) {
      const parsedInfo = parseResolveInfo(info)
      const queryInfo = simplify(parsedInfo, userSchema.getType(type.name))

      return [
        genFakeContent(queryInfo, type.fields, schemaTemplateData),
        genFakeContent(queryInfo, type.fields, schemaTemplateData),
        genFakeContent(queryInfo, type.fields, schemaTemplateData)
      ]
    }
  }
}

const getPage = (type, schemaTemplateData, userSchema) => {
  return {
    resolve(_, args, ctx, info) {
      const parsedInfo = parseResolveInfo(info)
      const queryInfo = simplify(parsedInfo, userSchema.getType(type.name))
      return genFakeContent(queryInfo, type.fields, schemaTemplateData)
    }
  }
}

module.exports = { getOne, getMany, getPage }
