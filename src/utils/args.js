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
export const getUserArgs = function(cliArgs, auth = true) {
  let args
  try {
    const tipeConfig = fs
      .readFileSync(path.join(process.cwd(), constants.configFile))
      .toString()
    args = {
      ...JSON.parse(tipeConfig),
      ...cliArgs
    }
  } catch (e) {
    args = cliArgs
  }

  if (auth && !args.projectId && !args.apiKey) {
    return this.error('[NOAUTH]: must supply both project id and API Key')
  }
  return args
}
