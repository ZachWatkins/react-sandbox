/**
 * @file ESLint configuration file
 * @author Zachary K. Watkins
 * @description This file's configuration should mirror the `.eslintrc.js`
 * configuration. Both files are needed until the `.eslintrc.js` can be safely
 * removed.
 */
'use strict'

const { defineFlatConfig } = require('eslint-define-config')
const globals = require('globals')
const js = require('@eslint/js')
const react = require('eslint-plugin-react')
const reactHooks = require('eslint-plugin-react-hooks')
const jsxAlly = require('eslint-plugin-jsx-a11y')
const jsdoc = require('eslint-plugin-jsdoc')

const configs = [
  js.configs.recommended,
  react.configs.recommended,
  reactHooks.configs.recommended,
  jsxAlly.configs.recommended,
  jsdoc.configs.recommended,
].map(config => {
  if (Array.isArray(config.plugins)) {
    if (!config.plugins.length) {
      delete config.plugins
    } else {
      config.plugins = config.plugins.reduce((acc, plugin) => {
        acc[plugin] = require(`eslint-plugin-${plugin}`)
        return acc
      }
      , {})
    }
  }
  if (config.parserOptions) {
    if (config.languageOptions) {
      config.languageOptions.parserOptions = config.parserOptions
    } else {
      config.languageOptions = { parserOptions: config.parserOptions }
    }
    delete config.parserOptions
  }
  return config
})

module.exports = defineFlatConfig([
  ...configs,
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['node_modules/', 'dist/', 'build/'],
    plugins: {
      jsdoc,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxAlly,
    },
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2018,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: Object.assign({}, globals.browser, globals.node, globals.es2017, globals.commonjs, globals.jest),
    },
    rules: {
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      'prefer-const': 'error',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'comma-dangle': ['error', 'always-multiline'],
    },
  },
])
