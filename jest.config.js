module.exports = {
  automock: false,
  bail: true,
  verbose: true,
  testURL: 'http://localhost/',
  testEnvironment: 'node',
  restoreMocks: true,
  setupTestFrameworkScriptFile: '<rootDir>/setupTest.js',
  testPathIgnorePatterns: ['dist/']
}
