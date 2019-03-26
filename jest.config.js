module.exports = {
  transform: {
    '.(ts|tsx)': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|js)$',
  moduleFileExtensions: ['ts', 'js'],
  automock: false,
  bail: true,
  verbose: true,
  testURL: 'http://localhost/',
  testEnvironment: 'node',
  restoreMocks: true,
  testPathIgnorePatterns: ['dist/', 'src/config/test.js']
}
