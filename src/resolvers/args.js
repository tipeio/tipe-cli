const { GraphQLInputObjectType, GraphQLList, GraphQLNonNull } = require('graphql')

const createArgForField = (field, schema) => {
  switch (field.type) {
    case 'String':
      return schema.getType('StringFilterInput')
    case 'Float':
      return schema.getType('FloatFilterInput')
    case 'Int':
      return schema.getType('IntFilterInput')
    case 'DateTime':
      return schema.getType('DateTimeFilterInput')
    case 'Boolean':
      return schema.getType('BooleanFilterInput')
    case 'ID':
      return schema.getType('IDFilterInput')
    case 'Url':
      return schema.getType('UrlFilterInput')
  }
}

const createWhereArgs = (type, schema) => {
  const args = type.fields
    .filter(field => field.isScalar)
    .reduce((fields, field) => {
      fields[field.name] = { type: createArgForField(field, schema) }
      return fields
    }, {})

  const typeFields = new GraphQLInputObjectType({
    name: `${type.name}FiltersInput`,
    fields: () => ({
      ...args
    })
  })

  const whereType = new GraphQLInputObjectType({
    name: `${type.name}WhereInput`,
    fields: () => ({
      _and: { type: new GraphQLList(new GraphQLNonNull(typeFields)) },
      _or: { type: new GraphQLList(new GraphQLNonNull(typeFields)) },
      ...args
    })
  })

  return whereType
}

const createSortArgs = type => {}

const createPaginateArgs = type => {}

module.exports = {
  createArgForField,
  createWhereArgs,
  createSortArgs,
  createPaginateArgs
}
