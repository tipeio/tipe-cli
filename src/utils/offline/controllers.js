import _ from 'lodash'

export const byId = (shapes, db) => (req, res) => {
  return res.json({ data: db.findById(req.params.id) })
}

export const byType = (shapes, db) => (req, res) => {
  const shape = _.find(shapes, s => s.apiId === req.params.type)

  if (!shape) {
    return res.json({
      error: { code: 1, message: `Not valid shape: ${req.params.type}` }
    })
  }

  const data = db.findByShape(req.params.type, 3)
  return res.json({ data })
}
