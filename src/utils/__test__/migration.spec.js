import { normalizeSchema, missingType } from '../migration'

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
})
