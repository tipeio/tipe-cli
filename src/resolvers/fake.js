const _ = require('lodash')
const Chance = require('chance')
const chance = new Chance()

const getField = (fields, field, typeName, schemaContext) => {
  let result = _.find(fields, _field => _field.name === field.name)
  if (!result) {
    const type = _.find(schemaContext.types, t => t.name === typeName)
    result = _.find(type.fields, _field => _field.name === field.name)
  }
  return result
}

const makeMarkdown = isArray => {
  const paragraph = chance.paragraph({ sentences: 10 })
  const text = `## ${chance.word()}\n${paragraph}`
  return isArray ? [text, text, text] : text
}

const makeSingleLineText = isArray => {
  return isArray ? [chance.word(), chance.word(), chance.word()] : chance.word()
}

const makeNumberSelect = isArray => {
  return isArray
    ? [
        chance.natural({ min: 1, max: 100000 }),
        chance.natural({ min: 1, max: 1000000 }),
        chance.natural({ min: 1, max: 1000 })
      ]
    : chance.natural({ min: 1, max: 100000 })
}

const makeCalendar = isArray => {
  return isArray
    ? [
        new Date(chance.date({ string: true })).toISOString(),
        new Date(chance.date({ string: true })).toISOString()
      ]
    : new Date(chance.date({ string: true })).toISOString()
}

const makeEamil = isArray => {
  return isArray
    ? [chance.email(), chance.email(), chance.email(), chance.email()]
    : chance.email()
}

const makeUrl = isArray => {
  return isArray ? [chance.url(), chance.url(), chance.url()] : chance.url()
}

const makeAsset = isArray => {
  const asset = {
    url: makeUrl(false),
    name: makeSingleLineText(false),
    type: 'png'
  }
  return isArray ? [asset, asset] : asset
}

const getContentForType = (component, isArray) => {
  switch (component) {
    case 'MARKDOWN':
      return makeMarkdown(isArray)
    case 'SINGLE_LINE':
      return makeSingleLineText(isArray)
    case 'NUMBER_SELECT':
      return makeNumberSelect(isArray)
    case 'CALENDAR':
      return makeCalendar(isArray)
    case 'EMAIL_INPUT':
      return makeEamil(isArray)
    case 'URL_INPUT':
      return makeUrl(isArray)
    case 'ASSET_PICKER':
      return makeAsset(isArray)
    case 'TEXT_BOX':
      return makeSingleLineText(isArray)
  }
}

const genFakeContent = (infoObject, fields, schemaContext, result = {}) => {
  return _.reduce(
    infoObject.fieldsByTypeName,
    (_result, type, typeName) => {
      _.forEach(type, field => {
        if (_.isEmpty(field.fieldsByTypeName)) {
          const fieldInfo = getField(fields, field, typeName, schemaContext)
          _result[field.name] = getContentForType(
            fieldInfo.directives.ui.component,
            fieldInfo.isArray
          )
        } else {
          _result[field.name] = genFakeContent(
            field,
            fields,
            schemaContext,
            _result
          )
        }
      })
      return _result
    },
    result
  )
}

module.exports = genFakeContent
