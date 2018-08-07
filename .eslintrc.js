module.exports = {
  parserOptions: {
    sourceType: 'module',
    parser: 'babel-eslint'
  },
  env: {
    node: true
  },
  extends: [
    'standard',
    'prettier',
    'prettier/standard',
    'plugin:jest/recommended'
  ],
  plugins: ['prettier', 'jest'],
  rules: {
    'prettier/prettier': 'error',
    'promise/catch-or-return': 'error',
    'max-lines': [
      'error',
      { max: 250, skipBlankLines: true, skipComments: true }
    ]
  }
}
