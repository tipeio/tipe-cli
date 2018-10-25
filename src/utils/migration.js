import { createBase } from '@tipe/schema-tools/dist/bases/tipe'
import _ from 'lodash'

const createMigrationRule = (name, when, validate) => ({
  name,
  when,
  validate
})

export const missingType = createMigrationRule(
  'Schema Missing Type',
  'schema',
  (newTypes, currentTypes, conflict) => {
    const missing = _.differenceBy(currentTypes, newTypes, type => type.name)
    if (missing.length) {
      missing.forEach(t => conflict(t.name))
    }
  }
)

export const missingTypeField = createMigrationRule(
  'Missing Type Field',
  'type',
  (newType, currentTypes, conflict) => {}
)

export const typeFieldTypeChange = createMigrationRule(
  'Type Field Changed Field Types',
  'type',
  (newType, currentTypes, conflict) => {}
)

const baseRules = [missingType, missingTypeField, typeFieldTypeChange]

export const normalizeSchema = schemaString => {
  const tipeBase = createBase()
  const { schemaContext } = tipeBase.getSchemaContext(schemaString)
  return schemaContext.types
}

const addConflict = (rulenName, conflicts) => {
  conflicts[rulenName] = conflicts[rulenName] || []
  return message => {
    conflicts[rulenName].push(message)
    return conflicts
  }
}

export const checkForConflicts = ({ newSchema, currentSchema, rules = [] }) => {
  const allRules = [...baseRules, ...rules]
  const newSchemaTypes = normalizeSchema(newSchema)
  const currentSchemaTypes = normalizeSchema(currentSchema)
  const conflicts = {}

  const schemaRules = allRules.filter(r => r.when === 'schema')
  const typeRules = allRules.filter(r => r.when === 'type')

  schemaRules.forEach(rule => {
    rule.validate(
      newSchemaTypes,
      currentSchemaTypes,
      addConflict(rule.name, conflicts)
    )
  })

  newSchemaTypes.forEach(type => {
    typeRules.forEach(rule => {
      rule.validate(type, currentSchemaTypes, addConflict(rule.name, conflicts))
    })
  })

  return conflicts
}
