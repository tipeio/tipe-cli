import _ from 'lodash'
import nano from 'nanoid'
import mocks from '../mocks'
import Chance from 'chance'
import chalk from 'chalk'
import boxen from 'boxen'
import logSymbols from 'log-symbols'

const chance = new Chance()
const docsPerTemplate = 2

const mapObjectToList = (o, keyField) =>
  _.map(o, (item, key) => ({ ...item, [keyField]: key }))

export const mapTemplatesForAPI = templates =>
  mapObjectToList(templates, 'id').map(template => {
    template.fields = mapObjectToList(template.fields, 'id').map(f => {
      const { mock, ...all } = f
      return all
    })

    if (_.size(template.refs)) {
      template.refs = mapObjectToList(template.refs, 'id')
    }

    return template
  })

export const mergeTipeDB = (db, generatedDocs) => {
  return generatedDocs.reduce((result, document, i) => {
    if (db[i]) {
      const tempObj = {
        ...document,
        id: db[i].id
      }
      result.push(tempObj)
      return result
    }
    result.push(document)
    return result
  }, [])
}

const _populateRefs = (mockDocuments, refs, depth) =>
  Object.keys(refs).reduce((result, refApiId) => {
    const _ref = refs[refApiId]
    if (Array.isArray(_ref.value)) {
      result[refApiId] = {
        ...refs[refApiId],
        value: _ref.value.map(v => {
          const nestedDoc = mockDocuments.find(d => d.id === v)
          return {
            ...nestedDoc,
            refs:
              depth > 0 && _.size(nestedDoc.refs)
                ? _populateRefs(mockDocuments, nestedDoc.refs, --depth)
                : nestedDoc.refs
          }
        })
      }
      return result
    }
    const nestedDoc = mockDocuments.find(d => d.id === _ref.value)
    result[refApiId] = {
      ...refs[refApiId],
      value: {
        ...nestedDoc,
        refs:
          depth > 0 && _.size(nestedDoc.refs)
            ? _populateRefs(mockDocuments, nestedDoc.refs, --depth)
            : nestedDoc.refs
      }
    }
    return result
  }, {})

export const populateRefs = (mockDocuments, data, depth = 1) => {
  const _depth = depth > 3 ? 3 : depth
  if (depth > 0) {
    if (Array.isArray(data)) {
      return data.map(d => {
        if (_.size(d.refs) && !Array.isArray(d.refs)) {
          return {
            ...d,
            refs: _populateRefs(mockDocuments, d.refs, _depth)
          }
        } else if (_.size(d.refs) && Array.isArray(d.refs)) {
          return {
            ...d,
            refs: d.refs.map(_d =>
              _populateRefs(mockDocuments, _d.refs, _depth)
            )
          }
        }
        return d
      })
    }
    if (_.size(data.refs)) {
      const refs = Array.isArray(data.refs)
        ? data.refs.map(d => _populateRefs(mockDocuments, d.refs, _depth))
        : _populateRefs(mockDocuments, data.refs, _depth)
      return {
        ...data,
        refs
      }
    }
  }
  return data
}

export const getField = field => {
  switch (field.type) {
    case 'button':
      return mocks.button(field)
    case 'image':
      return mocks.image(field)
    case 'markdown':
      return mocks.markdown(field)
    case 'code':
      return mocks.code(field)
    case 'html':
      return mocks.html(field)
    case 'boolean':
      return mocks.boolean(field)
    default:
      return mocks.text(field)
  }
}

export const formatFields = (fields, renderField = getField) => {
  return fields.reduce((fields, field) => {
    let mergeObj = {}
    if (field.list) {
      const value = _.times(3, () => {
        const _field = renderField(field)
        return _field.value
      })
      mergeObj.value = value
    } else {
      mergeObj = renderField(field)
    }
    const final = _.merge(
      {
        name: field.name,
        id: field.id,
        type: field.type,
        data: {}
      },
      mergeObj
    )
    fields[field.id] = field.list ? final : final[0]
    return fields
  }, {})
}

export const createDocsForTemplate = template =>
  _.times(template.multi === false ? 1 : docsPerTemplate, () => ({
    id: nano(),
    fields: formatFields(template.fields),
    template: {
      id: template.id,
      name: template.name
    },
    createdBy: {
      firstName: chance.first(),
      lastName: chance.last(),
      email: chance.email()
    },
    refs: _.size(template.refs) ? formatFields(template.refs, () => false) : {}
  }))

export const createMockDocuments = templates => {
  const allDocs = _.flatten(templates.map(createDocsForTemplate))

  return allDocs.map(doc => {
    if (_.size(doc.refs)) {
      doc.refs = _.reduce(
        doc.refs,
        (refs, ref) => {
          if (Array.isArray(ref)) {
            const _ref = ref[0]
            const match = _.sample(
              allDocs.filter(d => d.template.id === _ref.type)
            )
            refs[_ref.id] = ref.map(_r => ({
              ..._r,
              value: match.id
            }))

            return refs
          }
          const match = _.sample(
            allDocs.filter(d => d.template.id === ref.type)
          )
          refs[ref.id] = {
            ...ref,
            value: match.id
          }

          return refs
        },
        {}
      )
    }
    return doc
  })
}

export const formatTemplateErrors = errors => {
  const title = `${logSymbols.error} ${chalk.bold(
    chalk.red('Invalid templates')
  )}\n\n`

  const message = errors.reduce((final, { code, message }) => {
    final += `\n${logSymbols.warning} ${chalk.yellow(
      chalk.underline(code)
    )} ${chalk.white(message)}`

    return final
  }, title)

  return boxen(message, {
    padding: 1,
    margin: 1,
    borderColor: 'red',
    borderStyle: 'single'
  })
}
