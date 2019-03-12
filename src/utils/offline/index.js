import express from 'express'
import { byId, byType } from './controllers'
import { createDB } from './db'

export const createServer = shapes => {
  const app = express()
  const db = createDB(shapes)

  app.get('/document/:id', byId(shapes, db))
  app.get('/documents/:type', byType(shapes, db))

  return port =>
    new Promise(resolve => {
      const server = app.listen(port, () => resolve(server))
    })
}
