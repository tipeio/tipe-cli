import { createWhereArgs } from './args'
import { parseResolveInfo, simplify } from 'graphql-parse-resolve-info'
import { GraphQLNonNull, GraphQLList, GraphQLString, GraphQLInt } from 'graphql'
import { genFakeContent } from './fake'

export const getOne = (type, schemaTemplateData, userSchema) => {
  return {
    resolve(_, args, ctx, info) {
      const parsedInfo = parseResolveInfo(info)
      const queryInfo = simplify(parsedInfo, userSchema.getType(type.name))
      return genFakeContent(queryInfo, type.fields, schemaTemplateData)
    },
    type: new GraphQLNonNull(userSchema.getType(type.name))
  }
}

export const getMany = (type, schemaTemplateData, userSchema) => {
  return {
    resolve(_, args, ctx, info) {
      const parsedInfo = parseResolveInfo(info)
      const queryInfo = simplify(parsedInfo, userSchema.getType(type.name))

      return [
        genFakeContent(queryInfo, type.fields, schemaTemplateData),
        genFakeContent(queryInfo, type.fields, schemaTemplateData),
        genFakeContent(queryInfo, type.fields, schemaTemplateData)
      ]
    },
    args: {
      where: { type: createWhereArgs(type, userSchema) },
      order_by: {
        type: new GraphQLList(new GraphQLNonNull(GraphQLString)),
        description:
          'List of fields to order the results by. Defaults to ["+updated_at"]',
        defaultValue: ['+updated_at']
      },
      limit: {
        type: GraphQLInt,
        description: 'Maximum number of results to return. Defaults to 50',
        defaultValue: 50
      },
      skip: {
        type: GraphQLInt,
        description:
          'For pagination, how many items to skip to continue the next page',
        defaultValue: 0
      }
    },
    type: new GraphQLNonNull(new GraphQLList(userSchema.getType(type.name)))
  }
}

export const getPage = (type, schemaTemplateData, userSchema) => {
  return {
    resolve(_, args, ctx, info) {
      const parsedInfo = parseResolveInfo(info)
      const queryInfo = simplify(parsedInfo, userSchema.getType(type.name))
      return genFakeContent(queryInfo, type.fields, schemaTemplateData)
    },
    type: new GraphQLNonNull(userSchema.getType(type.name))
  }
}