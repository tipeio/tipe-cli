import fs from 'fs'
import path from 'path'
import { blog } from './templates'

export const writeSchema = async (type?) => {
  try {
    fs.writeFileSync(path.join(process.cwd(), '.tipeshapes.js'), blog)
    return [null]
  } catch (e) {
    return [e]
  }
}
