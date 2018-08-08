const pascal = require('pascal-case')
const camel = require('camel-case')
const pluralize = require('pluralize')

const components = [
  'TEXT_BOX',
  'NUMBER_SELECT',
  'CALENDAR',
  'EMAIL',
  'URL',
  'ASSET_PICKER',
  'LINK_PICKER',
  'MARKDOWN',
  'SWITCH'
].reduce((mem, component) => {
  mem[component] = component
  return mem
}, {})

const ourTypes = { PageInfo: false, Asset: false }

const fieldDefaults = (type, name) =>
  ({
    String: {
      ui: {
        name,
        component: components.TEXT_BOX
      }
    },
    Int: {
      ui: {
        name,
        component: components.NUMBER_SELECT
      }
    },
    Float: {
      ui: {
        name,
        component: components.NUMBER_SELECT
      }
    },
    DateTime: {
      ui: {
        name,
        component: components.CALENDAR
      }
    },
    Email: {
      ui: {
        name,
        component: components.EMAIL
      }
    },
    Url: {
      ui: {
        name,
        component: components.URL
      }
    },
    Asset: {
      ui: {
        name,
        component: components.ASSET_PICKER
      }
    },
    Link: {
      ui: {
        name,
        component: components.LINK_PICKER
      }
    }
  }[type])

// TODO: need to validate if the type can use given component
const mixDefaults = field => {
  const { type, name } = field
  const defaults = fieldDefaults(type, name)

  return {
    ...field,
    directives: {
      ...defaults,
      ...field.directives
    },
    usesDirectives: true
  }
}

const addDefaults = abstractType => {
  const fields = abstractType.fields.map(mixDefaults)
  return {
    ...abstractType,
    fields
  }
}

const genNames = name => ({
  name,
  plural: camel(pluralize(name)),
  cap: pascal(name),
  capPlural: pascal(pluralize(name)),
  camel: camel(name),
  camPlural: camel(pluralize(name)),
  many: `${camel(pluralize(name))}`,
  create: `new${pascal(name)}`,
  remove: `remove${pascal(name)}`,
  update: `update${pascal(name)}`
})

module.exports = {
  ourTypes,
  fieldDefaults,
  mixDefaults,
  addDefaults,
  genNames
}
