module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module' 
  },
  plugins: [
    'svelte3'
  ],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3' 
    }
  ],
  settings: { 'svelte3/ignore-styles': () => true },
  rules: {
    indent: [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    quotes: [
      'error',
      'single'
    ],
    semi: [
      'error',
      'never'
    ],
    'no-extra-parens': [
      'error'
    ],
    'object-curly-spacing': ['error', 'always'],
    'object-curly-newline': ['error', { multiline: true, minProperties: 3 }],
    'quote-props': ['error', 'as-needed'],
    'no-multi-spaces': 'error',
    'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    'eol-last': ['error', 'always']
  }
}
