import _ from 'lodash'

const mapObjectToList = (o, keyField) => _.map(o, (item, key) => ({ ...item, [keyField]: key }))

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
