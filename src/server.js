const app = require('express')()
const bp = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const chokidar = require('chokidar')
const path = require('path')

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
  const document = mockDocuments.find(d => d.id === req.body.id)

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

const state = {
  server: null,
  options: null,
  mocks: null,
  sockets: [],
}

// Initialize watcher.
const watcher = chokidar.watch('tipe.js', {
  ignored: /(^|[/\\])\../, // ignore dotfiles
})

watcher.on('change', filePath => {
  console.log('TCL: filePath', filePath)
  const clientRootPath = Object.keys(watcher.getWatched())[0]
  // fs.writeFileSync('templateCache.js', state.mocks)
  // const templates = fs.readFileSync(filePath, 'utf8').toString()
  delete require.cache[require.resolve(path.join(clientRootPath, filePath))]
  const { templates } = require(path.join(clientRootPath, filePath))
  console.log('TCL: templates', templates)
  if (state.server) {
    console.log(`${filePath} has been changed, restarting`)
    try {
      state.server.close()
    } catch (error) {
      console.log(error)
    }
    const updatedDocs = { ...state.mocks, ...templates }
    startServer(updatedDocs, state.options)
  }
})

const createServer = (docs, options) =>
  new Promise((resolve, reject) => {
    app.post('/api/:project/documentsByProjectId', documentsByProjectId(docs))
    app.post('/api/:project/documentById', documentById(docs))
    app.post('/api/:project/documentsByTemplate', documentsByTemplate(docs))
    const server = app.listen(options.port, () => {})
    resolve(server)
  })

const startServer = async (mockDocuments, options = { port: DEFAULTS.port, watch: 'tipe.js' }) => {
  state.server = await createServer(mockDocuments, options)
  state.mocks = mockDocuments
  // will change this to store created docs instead of mocks on restart
  state.options = options

  state.server.on('connection', socket => {
    console.log('Add socket', state.sockets.length + 1)
    state.sockets.push(socket)
  })
  state.server.on('close', () => {
    console.log('shut down ===========')
  })
  console.log('TCL: startServer -> mockDocuments', mockDocuments)
}

module.exports = {
  startServer,
}
