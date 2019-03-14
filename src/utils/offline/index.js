import express from 'express'
import { byId, byType } from './controllers'
import { createDB } from './db'
import cors from 'cors'
import morgan from 'morgan'
import { json, urlencoded } from 'body-parser'
export const createServer = shapes => {
  const app = express()
  const db = createDB(shapes)

  app.use(cors())
  app.use(morgan('dev'))
  app.use(json())
  app.use(urlencoded({ extended: true }))
  app.get('/document/:id', byId(shapes, db))
  app.get('/documents/:type', byType(shapes, db))

  return port =>
    new Promise(resolve => {
      const server = app.listen(port, () => resolve(server))
    })
}
