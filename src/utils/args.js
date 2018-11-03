import constants from '../constants'
import fs from 'fs'
import path from 'path'

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
      .readFileSync(path.join(process.cwd(), constants.configFile))
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
