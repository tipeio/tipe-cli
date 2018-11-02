import {
  normalizeSchema,
  missingType,
  missingTypeField,
  typeFieldTypeChange,
  checkForConflicts
} from '../migration'

describe('migration', () => {
  describe('missingType rule', () => {
    test('detects if type is missing from new schema', () => {
      const newSchema = `
        type Person implements Document {
          name: String!
        }
      `

      const schema = `
        type Person implements Document {
          name: String!
        }

        type Blog implements Document {
          title: String!
        }
      `
      const newSchemaTypes = normalizeSchema(newSchema)
      const schemaTypes = normalizeSchema(schema)

      const conflict = jest.fn()

      missingType.validate(newSchemaTypes, schemaTypes, conflict)
      expect(conflict).toHaveBeenCalledTimes(1)
      expect(conflict).toHaveBeenCalledWith('Blog')
    })
  })

  describe('missingTypeField rule', () => {
    test('detects if a current type is missing a field', () => {
      const newSchema = `
        type Person implements Document {
          name: String!
        }

        type Animal {
          location: String!
        }
      `

      const schema = `
        type Person implements Document {
          name: String!
          age: Int!
        }

        type Animal {
          type: String!
          location: String!
        }
      `
      const newSchemaTypes = normalizeSchema(newSchema)
      const schemaTypes = normalizeSchema(schema)

      const conflict = jest.fn()
      newSchemaTypes.forEach(type => {
        missingTypeField.validate(type, schemaTypes, conflict)
      })

      expect(conflict).toHaveBeenCalledTimes(2)
      expect(conflict).toHaveBeenNthCalledWith(1, 'age')
      expect(conflict).toHaveBeenNthCalledWith(2, 'type')
    })
  })

  describe('typeFieldTypeChange', () => {
    test('detects if a type changes the value type of a field', () => {
      const newSchema = `
        type Person implements Document {
          name: Int!
          age: Int!
        }
      `

      const schema = `
        type Person implements Document {
          name: String!
          age: Int!
        }
      `
      const newSchemaTypes = normalizeSchema(newSchema)
      const schemaTypes = normalizeSchema(schema)

      const conflict = jest.fn()
      newSchemaTypes.forEach(type => {
        typeFieldTypeChange.validate(type, schemaTypes, conflict)
      })

      expect(conflict).toHaveBeenCalledTimes(1)
      expect(conflict).toHaveBeenCalledWith('name')
    })
  })

  describe('checkForConflicts', () => {
    test('finds conflicts for default rules', () => {
      const newSchema = `
        type Person implements Document {
          name: Int!
        }
      `

      const schema = `
        type Person implements Document {
          name: String!
          age: Int!
        }

        type Animal {
          fur: Boolean!
        }
      `
      const conflics = checkForConflicts(newSchema, schema)

      expect(Object.keys(conflics)).toHaveLength(3)
      expect(conflics[missingType.name]).toEqual(['Animal'])
      expect(conflics[missingTypeField.name]).toEqual(['age'])
      expect(conflics[typeFieldTypeChange.name]).toEqual(['name'])
    })
  })
})
