const app = require('express')()
const bp = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const chokidar = require('chokidar')
const fs = require('fs')
const path = require('path')
const {
  populateRefs,
  mapTemplatesForAPI,
  // createDocsForTemplate,
  createMockDocuments,
  mergeTipeDB
} = require('./utils/templates')

const DEFAULTS = {
  port: 8300
}

const documentsByProjectId = mockDocuments => (req, res) => {
  const data = {
    pagination: {
      totalDocs: mockDocuments.length,
      page: 1,
      limit: mockDocuments.length
    },
    data: populateRefs(mockDocuments, mockDocuments, req.body.depth)
  }

  res.json({ data })
}

const documentById = mockDocuments => (req, res) => {
  const document = mockDocuments.find(d => d.id === req.body.id)

  if (!document) {
    return res.sendStatus(400)
  }

  return res.json({
    data: populateRefs(mockDocuments, document, req.body.depth)
  })
}

const documentsByTemplate = mockDocuments => (req, res) => {
  const docs = mockDocuments.filter(d => d.template.id === req.body.template)
  const data = {
    pagination: {
      totalDocs: mockDocuments.length,
      page: 1,
      limit: mockDocuments.length
    },
    data: populateRefs(mockDocuments, docs, req.body.depth)
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
  // cli options
  options: null,
  documents: null,
  // templates
  tipeFilePath: null,
  tipeDBPath: null
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

const startServer = async (
  options = { port: DEFAULTS.port, watch: true, refresh: false }
) => {
  // flag on whether to watch or not
  state.watch = options.watch
  state.options = options
  state.tipeDBPath = path.join(process.cwd(), '.tipeDB.json')
  state.tipeFilePath = path.join(process.cwd(), state.options.config)

  /**
   * 1. server starts up
   * 2. look for db file
   * 3. if db file, require the documents in the file
   * 4. look at template for changes
   * 5. for each change, create new field or document
   * 6. if no db file, create one
   * 7. if no documents, generate them and save them to the same db file
   */

  // 2 tipeDB exist?
  if (fs.existsSync(state.tipeDBPath)) {
    // clear require cache of the tipeFile (templates) and tipeDB
    try {
      delete require.cache[require.resolve(state.tipeDBPath)]
      delete require.cache[require.resolve(state.tipeFilePath)]
    } catch (error) {
      console.error(error)
    }
    // 3
    const tipeDB = fs.readFileSync(state.tipeDBPath, 'utf8').toString()
    const templateFile = require(state.tipeFilePath)
    // 5

    const generatedDocs = createMockDocuments(mapTemplatesForAPI(templateFile))
    console.log(
      'TCL: mapTemplatesForAPI(templateFile)[0].feature.fields',
      mapTemplatesForAPI(templateFile)[0].feature.fields
    )
    // 4
    const updatedDocuments = mergeTipeDB(tipeDB, generatedDocs)
    fs.writeFileSync(
      state.tipeDBPath,
      JSON.stringify(updatedDocuments, null, 2)
    )
    state.documents = updatedDocuments
  } else {
    // 7
    const generatedDocs = createMockDocuments(state.options.templates)
    // 6
    fs.writeFileSync(state.tipeDBPath, JSON.stringify(generatedDocs, null, 2))
    state.documents = generatedDocs
  }
  state.server = await createServer(state.documents, state.options)
}

// Initialize watcher.
const watcher = chokidar.watch('tipe.js', {
  ignored: /(^|[/\\])\../ // ignore dotfiles
})

watcher.on('change', async file => {
  const clientRootPath = Object.keys(watcher.getWatched())[0]
  state.tipeFile = path.join(clientRootPath, file)
  if (state.server && state.options.watch) {
    try {
      console.log(`${file} has been changed, restarting...`)
      state.server.close()
      startServer(state.options)
    } catch (error) {
      console.log(error)
      process.exit(1)
    }
  }
})

module.exports = {
  startServer
}
