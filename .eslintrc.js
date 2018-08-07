module.exports = {
  parserOptions: {
    ecmaVersion: 6,
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
    'semi': [2, 'never'],
    'prettier/prettier': [
      'error',
      {
        'singleQuote': true,
        'semi': false
      }
    ],
    'promise/catch-or-return': 'error',
    'max-lines': [
      'error',
      { max: 250, skipBlankLines: true, skipComments: true }
    ]
  }
}
