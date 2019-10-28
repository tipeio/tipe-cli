const app = require('express')()
const bp = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const logSymbols = require('log-symbols')
const { validateTemplates } = require('@tipe/schema')
const { resolveToUser } = require('./utils/paths')
const fs = require('fs')
const { getUserConfig } = require('./utils/config')
const {
  populateRefs,
  mapTemplatesForAPI,
  createMockDocuments,
  mergeTipeDB,
  formatTemplateErrors
} = require('./utils/templates')
const _ = require('lodash')

let SERVER = null
const DEFAULT_DB_PATH = '.tipe-offline-db.json'

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

const documentsByIds = mockDocuments => (req, res) => {
  const { ids } = req.body
  const documents = ids.map(id =>
    _.flatten(mockDocuments.filter(doc => doc.id === id))
  )

  if (!documents.length) {
    return res.sendStatus(400)
  }

  return res.json({
    data: populateRefs(mockDocuments, documents, req.body.depth)
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

const setDB = (dbPath, docs) => {
  fs.writeFileSync(dbPath, JSON.stringify(docs, null, 2))
  return docs
}

const getDB = dbPath => {
  if (fs.existsSync(dbPath)) {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8').toString())
    return db
  }
}

const deleteModuleCache = p => {
  delete require.cache[require.resolve(p)]
}

const createServer = (options, initConfig = {}) => {
  return new Promise((resolve, reject) => {
    const { restart, logger } = initConfig
    let docs

    try {
      deleteModuleCache(resolveToUser(options.config))
      const config = getUserConfig(options.config)

      if (!config.templates) {
        throw new Error('No templates!')
      }

      const errors = validateTemplates(config.templates)

      if (errors.length) {
        const message = formatTemplateErrors(errors)
        logger.info(message)
        process.exit(1)
      }

      const DBPath = config.offlineDBPath || DEFAULT_DB_PATH
      let db = getDB(DBPath)

      if (!db) {
        docs = createMockDocuments(mapTemplatesForAPI(config.templates))
        setDB(DBPath, docs)
        db = [...docs]
      }

      if (restart) {
        docs = mergeTipeDB(
          db,
          createMockDocuments(mapTemplatesForAPI(config.templates))
        )
        setDB(DBPath, docs)
      }
    } catch (e) {
      return reject(e)
    }

    app.use(morgan('tiny'))
    app.use(cors({ origin: '*', headers: '*' }))
    app.use(helmet())
    app.use(bp.urlencoded({ extended: true }))
    app.use(bp.json())
    app.get('*', (req, res) => res.json({ ok: true }))

    app.post('/api/:project/documentsByProjectId', documentsByProjectId(docs))
    app.post('/api/:project/documentById', documentById(docs))
    app.post('/api/:project/documentsByIds', documentsByIds(docs))
    app.post('/api/:project/documentsByTemplate', documentsByTemplate(docs))

    const server = app.listen(options.port)

    resolve(server)
  })
}
const startServer = async (options, watcher, { logger }) => {
  if (watcher) {
    watcher.on('change', async file => {
      if (SERVER && options.watch) {
        try {
          logger.info(
            logSymbols.info,
            `${file} has been changed, restarting...`
          )
          SERVER.close()
          SERVER = await createServer(options, { restart: true, logger })
        } catch (error) {
          logger.error(logSymbols.error, error)
          process.exit(1)
        }
      }
    })
  }

  try {
    SERVER = await createServer(options, { restart: true, logger })
  } catch (e) {
    logger.error(logSymbols.error, 'Could not start server')
    logger.error(logSymbols.error, e)
  }
}

// Initialize watcher.

module.exports = {
  startServer
}
