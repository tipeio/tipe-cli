const app = require('express')()
const bp = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const DEFAULTS = {
  port: 8300,
}

const documentsByProjectId = mockDocuments => (req, res) => {
  const data = {
    pagination: {},
    data: mockDocuments,
  }

  res.json({ data })
}

const documentById = mockDocuments => (req, res) => {
  const document = mockDocuments.find(d => d.document === req.body.document)

  if (!document) {
    return res.sendStatus(400)
  }

  return res.json({ data: document })
}

const documentsByTemplate = mockDocuments => (req, res) => {
  const docs = mockDocuments.filter(d => d.template.id === req.body.template)
  const data = {
    pagination: {},
    data: docs,
  }

  return res.json({ data })
}

app.use(morgan('tiny'))
app.use(cors({ origin: '*', headers: '*' }))
app.use(helmet())
app.use(bp.urlencoded({ extended: true }))
app.use(bp.json())
app.get('*', (req, res) => res.json({ ok: true }))

const createServer = (mockDocuments, port = DEFAULTS.port) =>
  new Promise((resolve, reject) => {
    app.post('/api/:project/documentsByProjectId', documentsByProjectId(mockDocuments))
    app.post('/api/:project/documentById', documentById(mockDocuments))
    app.post('/api/:project/documentsByTemplate', documentsByTemplate(mockDocuments))
    app.listen(port, () => resolve())
  })

module.exports = {
  createServer,
}
