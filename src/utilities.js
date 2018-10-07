import config from './constants'
import fs from 'fs'
import path from 'path'

export const getToken = noError => {
  let token = process.env.TIPE_API_KEY
  if (!token) {
    try {
      token = fs.readFileSync(config.configFile).toString()
    } catch (e) {
      token = null
    }
  }
  if (!noError && !token) {
    throw new Error(
      'Environment variable TIPE_API_KEY needs to be set or in your .tipe config file.'
    )
  }
  return token
}

/**
 * Given CLi args, will create final user args with specific priority, 1 being the highest:
 * 1. cli args
 * 2. config file args
 * 3. env vars
 * @param {Object} cliArgs cli args parsed from command
 */
export const getUserArgs = function(cliArgs) {
  const envs = {
    projectId: process.env.TIPE_PROJECT_ID,
    apiKey: process.env.TIPE_API_KEY
  }
  try {
    const tipeConfig = fs
      .readFileSync(path.join(process.cwd(), config.configFile))
      .toString()
    return {
      ...envs,
      ...JSON.parse(tipeConfig),
      ...cliArgs
    }
  } catch (e) {
    this.log('no .tipe config')
    return {
      ...envs,
      ...cliArgs
    }
  }
}
