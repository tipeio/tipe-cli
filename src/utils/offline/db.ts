import { types, systemFields } from '@tipe/schema'
import uuid from 'uuid/v4'
import _ from 'lodash'
import * as fakes from './mocks'

export const DEFAULT_LEVEL = 4
const allDocsById = {}

export const randomDate = () =>
  new Date(+new Date() - Math.floor(Math.random() * 10000000000)).getTime()

export const resolveValueForType = (field, shapes, levels = DEFAULT_LEVEL) => {
  switch (field.type) {
    case types.number:
      return _.random(0, 3000, true)

    case types.simpletext:
      return 'This is fake text'

    case types.toggle:
      return [true, false][_.random(1)]

    case types.richtext:
      return fakes.richtext

    case types.calendar:
      return randomDate()

    case types.asset:
      return fakes.asset

    case types.shape:
      return resolveShape(field.ref, shapes, levels - 1)

    default:
      return null
  }
}

export const getValueForField = (field, shapes, levels = DEFAULT_LEVEL) => {
  const isArray = field.array
  const isNested = _.isObject(field.type)

  if (isArray) {
    if (!levels || levels === 0) {
      return []
    }

    return new Array(5)
      .fill(1)
      .map(() => resolveValueForType(field, shapes, levels))
      .filter(d => !_.isNull(d))
  }

  if (isNested) {
    return _.reduce(
      field.type,
      (values, nestedField) => {
        values[nestedField.apiId] = resolveValueForType(
          nestedField,
          shapes,
          levels
        )
        return values
      },
      {}
    )
  }

  return resolveValueForType(field, shapes, levels)
}

export const resolveShape = (shape, shapes, levels = DEFAULT_LEVEL) => {
  if (!levels || levels === 0) {
    return null
  }

  let shapeSchema = shape

  if (_.isString(shape)) {
    shapeSchema = _.find(shapes, s => s.apiId === shape)
  }

  const fields = _.reduce(
    shapeSchema.fields,
    (_fields, type, apiId) => {
      _fields[apiId] = getValueForField(type, shapes, levels)
      return _fields
    },
    {}
  )

  const id = uuid()
  const doc = {
    [systemFields.meta]: {
      id,
      shape: shapeSchema.apiId,
      publishedOn: randomDate()
    },
    ...fields
  }

  allDocsById[id] = doc
  return doc
}

export const resolvePartialDoc = (doc, shapes) => {
  const resolved = resolveShape(
    doc[systemFields.meta].shape,
    shapes,
    DEFAULT_LEVEL
  )

  return _.reduce(
    doc,
    (final, value, field) => {
      if (field !== systemFields.meta && _.isNull(value)) {
        final[field] = resolved[field]
      }

      return final
    },
    doc
  )
}

export const createDB = shapes => {
  shapes.forEach(s => resolveShape(s, shapes, DEFAULT_LEVEL))

  return {
    findByShape(shape, count = 10) {
      const data = _.filter(allDocsById, (d: any) => {
        return d[systemFields.meta].shape === shape
      })

      if (!data.length) return []

      return data.slice(0, count + 1)
    },
    findById(id) {
      const doc = allDocsById[id]

      if (!doc) {
        return null
      }

      return resolvePartialDoc(doc, shapes)
    }
  }
}
