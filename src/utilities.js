const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const shell = require('shelljs')
const changeCase = require('change-case')

const { ACTION_PATH, TEMPLATES_PATH } = require('./constants')

function getToken(noError) {
  let token = null
  // let token = process.env.TIPE_TOKEN
  if (!token) {
    try {
      token = fs.readFileSync('.tipe').toString()
    } catch (e) {
      token = null
    }
  }
  if (!noError && !token) {
    throw new Error(
      'Environment variable TIPE_TOKEN needs to be set or set in your .tipe config file.'
    )
  }
  return token
}

function renderFile(fileName, ctx) {
  const file = fs.readFileSync(fileName)
  return ejs.render(file.toString(), ctx)
}

function writeFile(path, file) {
  try {
    fs.writeFileSync(path, file)
  } catch (e) {
    console.log(e)
  }
}

async function recursiveStat(currentPath, visitor, tempPath, ignorePaths) {
  ignorePaths = ignorePaths || /node_modules|\.nuxt|dist|\.DS_Store|\.env/
  const files = fs.readdirSync(currentPath)
  // visit each file in a directory
  const recursiveResolve = files
    .filter(fileName => ignorePaths.test(fileName) === false)
    .map(async fileName => {
      const currentFile = path.join(currentPath, fileName)
      const stat = fs.statSync(currentFile)
      const relativePath = path.relative(
        tempPath || TEMPLATES_PATH,
        currentPath
      )

      if (stat.isFile()) {
        return visitor(currentFile, relativePath, fileName)
      }
      if (stat.isDirectory()) {
        return recursiveStat(currentFile, visitor, tempPath, ignorePaths)
      }
    })
  const fileContents = await Promise.all(recursiveResolve)
  return fileContents
}

async function getActionFilePaths() {
  const actions = fs.readdirSync(ACTION_PATH)
  const ignorePaths = /node_modules|\.nuxt|dist|\.DS_Store|\.env|\.md|_example_/
  return actions
    .filter(fileName => ignorePaths.test(fileName) === false)
    .map(filename => path.join(ACTION_PATH, filename))
}

function filenameReplacer(str, ctx) {
  return str.replace(/__([^____]*)__/g, (a, b) => {
    const r = ctx[b]
    return typeof r === 'string' || typeof r === 'number' ? r : a
  })
}

function ensureDir(filepath) {
  // must be sync to prevent parallel creates
  try {
    if (fs.existsSync(filepath) === false) {
      shell.mkdir('-p', filepath)
    }
    return true
  } catch (e) {
    return false
  }
}

function validatePort(port) {
  const converted = Number(port)
  if (Number.isNaN(converted)) {
    return
  }
  return converted
}

function createCase(str) {
  return {
    pascalCase: changeCase.pascalCase(str),
    camelCase: changeCase.camelCase(str),
    constantCase: changeCase.constantCase(str),
    dotCase: changeCase.dotCase(str),
    headerCase: changeCase.headerCase(str),
    lowerCase: changeCase.lowerCase(str),
    paramCase: changeCase.paramCase(str),
    pathCase: changeCase.pathCase(str),
    snakeCase: changeCase.snakeCase(str),
    sentenceCase: changeCase.sentenceCase(str),
    titleCase: changeCase.titleCase(str),
    upperCase: changeCase.upperCase(str),
    upperCaseFirst: changeCase.upperCaseFirst(str)
  }
}

function createContext(obj) {
  return {
    ...obj
  }
}

function createConfig(options) {
  let CURRENT_DIR = process.cwd()

  if (options.root) {
    CURRENT_DIR = path.join(process.cwd(), options.root)
  }

  return {
    ...options,
    root: CURRENT_DIR
  }
}

async function copyBoilerplateFile(designatedDir, fileName, fileContent) {
  const resolvedPath = path.join(designatedDir, fileName)
  await writeFile(resolvedPath, fileContent)
}

async function createBoilerplate(root, fileName, directory, CTX) {
  /* Template Directory */
  // path where template file lives
  const templateFilePath = path.join(TEMPLATES_PATH, directory, fileName)
  // get the file content for writing
  const fileContent = await renderFile(templateFilePath, CTX)

  /* User Directory */
  // directory where file will be copied
  let designatedDir = path.join(root, directory)
  if (CTX.subDirectory) {
    console.log('in here?')
    designatedDir = path.join(root, directory, CTX.subDirectory)
  }
  // ensure the directory exists
  ensureDir(designatedDir)
  // replace template filename with user's filename
  const newname = filenameReplacer(fileName, CTX)
  await copyBoilerplateFile(designatedDir, newname, fileContent)
}

function createBoilerplateFactory(directory, fileName) {
  return (root, CTX) => {
    return createBoilerplate(root, fileName, directory, CTX)
  }
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

module.exports = {
  getToken,
  renderFile,
  writeFile,
  recursiveStat,
  getActionFilePaths,
  ensureDir,
  filenameReplacer,
  validatePort,
  createCase,
  createContext,
  createConfig,
  copyBoilerplateFile,
  createBoilerplateFactory,
  validateEmail
}
