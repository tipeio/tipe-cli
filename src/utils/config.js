import CC from 'cascade-config'
import { resolveToUser } from './paths'

const conf = new CC()

export const defaultConfig = {
  config: 'tipe.js',
  dry: false,
  db: '.tipe-db.json'
}

export const getUserFile = relPath => require(resolveToUser(relPath))

export const getUserConfig = configPath => {
  return getUserFile(configPath)
}

export const mergeOptions = options =>
  new Promise((resolve, reject) => {
    conf
      .obj(defaultConfig)
      .args()
      .done((err, config) => {
        if (err) return reject(err)
        resolve({ ...options, ...config })
      })
  })
