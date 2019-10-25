import _ from 'lodash'

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
  return Object.keys(generatedDocs).reduce((result, templateApiId) => {
    // if in the db, create new object with id = db[templateApiId].id
    if (db[templateApiId]) {
      const tempObj = {
        ...generatedDocs[templateApiId],
        id: db[templateApiId].id
      }
      result[templateApiId] = tempObj
      return result
    }
    result[templateApiId] = generatedDocs[templateApiId]
    return result
  }, {})
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
