const app = require('express')()
const bp = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const chokidar = require('chokidar')
const fs = require('fs')
const path = require('path')
const { mergeTipeDB } = require('./utils/templates')

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
  watch: true,
  options: null,
  documents: null,
}

const createServer = (docs, options) =>
  new Promise((resolve, reject) => {
    app.post('/api/:project/documentsByProjectId', documentsByProjectId(docs))
    app.post('/api/:project/documentById', documentById(docs))
    app.post('/api/:project/documentsByTemplate', documentsByTemplate(docs))
    const server = app.listen(options.port, () => {
      console.log('Tipe content server running')
    })
    resolve(server)
  })

const startServer = async (generatedDocs, options = { port: DEFAULTS.port, watch: true, refresh: false }) => {
  state.watch = options.watch
  state.options = options
  const tipeDBPath = path.join(process.cwd(), '.tipeDB.json')

  // tipeDB exist? && first load
  if (fs.existsSync(tipeDBPath) && !options.refresh) {
    const tipeDB = await fs.readFileSync(tipeDBPath, 'utf8').toString()
    state.documents = mergeTipeDB(JSON.parse(tipeDB), generatedDocs)
    await fs.writeFileSync(tipeDBPath, JSON.stringify(state.documents))
  } else {
    // its a refresh, update tipeDB with latest
    await fs.writeFileSync(tipeDBPath, JSON.stringify(generatedDocs))
    state.documents = generatedDocs
  }
  state.server = await createServer(state.documents, state.options)
}

// Initialize watcher.
const watcher = chokidar.watch('tipe.js', {
  ignored: /(^|[/\\])\../, // ignore dotfiles
})

watcher.on('change', file => {
  const clientRootPath = Object.keys(watcher.getWatched())[0]
  // clear require cache of the userTipeFile
  delete require.cache[require.resolve(path.join(clientRootPath, file))]
  const userTipeFile = require(path.join(process.cwd(), file))
  if (state.server && state.watch) {
    try {
      console.log(`${file} has been changed, restarting...`)
      state.server.close()
    } catch (error) {
      console.log(error)
    }
    state.options.refresh = true
    startServer(userTipeFile, state.options)
  }
})

module.exports = {
  startServer,
}
