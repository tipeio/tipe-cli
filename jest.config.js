// jest.config.js
module.exports = {
  testEnvironment: 'node',
  automock: false,
  bail: true,
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**', '!**/node_modules/**'],
  notify: true,
  notifyMode: 'always'
}
