import { createBase } from '@tipe/schema-tools/dist/bases/tipe'
import _ from 'lodash'

const ruleTypes = { schema: 'schema', type: 'type' }

const createMigrationRule = (name, ruleType, validate) => ({
  name,
  ruleType,
  validate
})

/**
 * Check if a new schema is missing a type the the current
 * schena has
 */
export const missingType = createMigrationRule(
  'Schema Missing Type',
  ruleTypes.schema,
  (newTypes, currentTypes, conflict) => {
    _.differenceBy(currentTypes, newTypes, type => type.name).forEach(t =>
      conflict(t.name)
    )
  }
)

/**
 * Check if a type from both schemas is missing a
 * field from the current schema
 */
export const missingTypeField = createMigrationRule(
  'Type missing field',
  ruleTypes.type,
  (newType, currentTypes, conflict) => {
    const match = currentTypes.find(t => t.name === newType.name)
    // if not a match, then newType is a brand new type
    if (match) {
      _.differenceBy(match.fields, newType.fields, field => field.name).forEach(
        f => conflict(f.name)
      )
    }
  }
)

/**
 * Check if a type from both schemas has a field
 * that has changed its value type
 */
export const typeFieldTypeChange = createMigrationRule(
  'Field has changed types',
  ruleTypes.type,
  (newType, currentTypes, conflict) => {
    const typeMatch = currentTypes.find(t => t.name === newType.name)
    // if not a match, then newType is a brand new type
    if (typeMatch) {
      typeMatch.fields
        .filter(oldField => {
          const newField = newType.fields.find(f => f.name === oldField.name)
          if (!newField) return false

          return newField.type !== oldField.type
        })
        .forEach(oldField => conflict(oldField.name))
    }
  }
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

export const checkForConflicts = (newSchema, currentSchema, rules = []) => {
  const allRules = [...baseRules, ...rules]
  const newSchemaTypes = normalizeSchema(newSchema)
  const currentSchemaTypes = normalizeSchema(currentSchema)
  const conflicts = {}

  const schemaRules = allRules.filter(r => r.ruleType === ruleTypes.schema)
  const typeRules = allRules.filter(r => r.ruleType === ruleTypes.type)

  // run schema level rules
  schemaRules.forEach(rule => {
    rule.validate(
      newSchemaTypes,
      currentSchemaTypes,
      addConflict(rule.name, conflicts)
    )
  })

  // run type level rules
  newSchemaTypes.forEach(type => {
    typeRules.forEach(rule => {
      rule.validate(type, currentSchemaTypes, addConflict(rule.name, conflicts))
    })
  })

  return {
    conflicts,
    hasConflicts: _.some(conflicts, c => c.length)
  }
}
