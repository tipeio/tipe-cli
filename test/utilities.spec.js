const {
  renderFile,
  // writeFile,
  recursiveStat,
  getActionFilePaths,
  ensureDir,
  filenameReplacer,
  validatePort
} = require('../src/utilities')

const { ACTION_PATH } = require('../src/constants')

// TODO
// mockWrite is undefined when added to the fs.promised mock
// does path need to be mocked??
// const mockWrite = jest.fn()

jest.mock('fs.promised', () => ({
  stat: () => {
    return Promise.resolve({
      isFile: () => true
    })
  },
  existsSync: _path => {
    if (_path === 'error path') {
      throw new Error('No Path')
    }
    return true
  },
  readFile: fileName =>
    Promise.resolve(
      Buffer.from(`I am a ${fileName} buffer <%= name %> <%= age %>`)
    ),
  readdir: () => ['dev.js', 'prod.js', 'build.js']
}))

jest.mock('shelljs', () => ({
  mkdir: () => {}
}))

describe('utilities', () => {
  describe('validatePort', () => {
    it('should return undefined for NaN', () => {
      expect(validatePort('NaN')).toBeUndefined()
    })
    it('should coerce string to number', () => {
      expect(validatePort('3000')).toBe(3000)
    })
    it('should return a number', () => {
      expect(validatePort(3000)).toBe(3000)
    })
    it('should return undefined for undefined input', () => {
      expect(validatePort(undefined)).toBeUndefined()
    })
  })

  describe('renderFile', () => {
    // values in the template must have corresponding values in the ctx object
    // do we want to set a default for missing values?

    // it.skip('should return the correct string', () => {
    //   return renderFile('myName', { name: 'olivia' }).then(str => {
    //     return expect(str).toBe('I am a myName buffer olivia <%= age %>')
    //   })
    // })
    // it.skip('should return the correct string for no values', () => {
    //   return renderFile('myName', { color: 'blue' }).then(str => {
    //     return expect(str).toBe('I am a myName buffer <%= name %> <%= age %>')
    //   })
    // })
    it('should return the correct string for multiple values', () => {
      return renderFile('myName', { name: 'olivia', age: '40' }).then(str => {
        return expect(str).toBe('I am a myName buffer olivia 40')
      })
    })
  })
  describe('writeFile', () => {
    // it.skip('should call the fs.writeFile function', () => {
    //   return writeFile('./path', 'blah').then(() => {
    //     expect(mockWrite.mock.calls.length).toBe(1)
    //   })
    // })
  })
  describe('filenameReplacer', () => {
    it('should replace ghe filename with yolo', () => {
      expect(filenameReplacer('__name__.js', { name: 'yolo' })).toBe('yolo.js')
    })
    it('should replace name in the filename with yolo', () => {
      expect(filenameReplacer('hi__name__lol.js', { name: 'yolo' })).toBe(
        'hiyololol.js'
      )
    })
  })
  describe('getActionFilePaths', () => {
    it('should return an array of length 3', () => {
      return getActionFilePaths().then(paths => {
        expect(paths).toHaveLength(3)
      })
    })
    it('should return an array with the correct action paths', () => {
      return getActionFilePaths().then(paths => {
        expect(paths).toEqual([
          `${ACTION_PATH}/dev.js`,
          `${ACTION_PATH}/prod.js`,
          `${ACTION_PATH}/build.js`
        ])
      })
    })
  })

  // TODO
  // mock fs.existsSync
  // mock fs.tat

  describe('ensureDir', () => {
    it('should return true for dir that exists', () => {
      expect(ensureDir('/example/path')).toBe(true)
    })
    it('should return true for dir that does not exist', () => {
      expect(ensureDir('/example/path')).toBe(true)
    })
    // make it error on purpose?
    it('should return false', () => {
      expect(ensureDir('error path')).toBe(false)
    })
  })

  describe('recursiveStat', () => {
    it('should return all of the files in a flat file system', () => {
      return recursiveStat('somepath', () => {}).then(fileContents => {
        expect(fileContents).toHaveLength(3)
      })
    })
    it('should return all of the files in a nested file system', () => {
      return recursiveStat('somepath', () => {}).then(fileContents => {
        expect(fileContents).toHaveLength(3)
      })
    })
  })
})
