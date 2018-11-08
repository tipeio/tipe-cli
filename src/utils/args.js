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

  let args
  try {
    const tipeConfig = fs
      .readFileSync(path.join(process.cwd(), constants.configFile))
      .toString()
    args = {
      ...envs,
      ...JSON.parse(tipeConfig),
      ...cliArgs
    }
  } catch (e) {
    args = {
      ...envs,
      ...cliArgs
    }
  }

  if (!args.projectId && !args.apiKey) {
    return this.error('[NOAUTH]: must supply both project id and apikey')
  }
  return args
}
