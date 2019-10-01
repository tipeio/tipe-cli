import CC from 'cascade-config'
import { resolveToUser } from './paths'
import { mapTemplatesForAPI } from './templates'

const conf = new CC()

export const defaultConfig = {
  config: 'tipe.js',
  dry: false,
}

export const getUserConfig = () =>
  new Promise((resolve, reject) => {
    conf
      .obj(defaultConfig)
      .args()
      .done((err, config) => {
        if (err) return reject(err)
        let final = { ...config }

        if (final.config) {
          const configPath = resolveToUser(final.config)
          let userConfig

          try {
            userConfig = require(configPath)

            if (userConfig.templates) {
              userConfig.templates = mapTemplatesForAPI(userConfig.templates)
            }

            final.config = userConfig
          } catch (e) {
            return reject(e)
          }
        }

        resolve(final)
      })
  })
