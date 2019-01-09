import express from 'express'

const addSchema = schema => (req, res, next) => {
  req.schema = schema
  next()
}

const createAPI = () => {
  const api = express.Router()
  api.get('/type/:type')

  return api
}

export const startLocalServer = ({ port, schema }) => {
  const app = express()
  app.disable('powered-by')
  app.use(addSchema(schema))

  const api = createAPI()

  app.use('/api', api)

  return new Promise((resolve, reject) => {
    app.listen(port, resolve)
  })
}
