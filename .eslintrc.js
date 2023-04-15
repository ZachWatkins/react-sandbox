/**
 * @file ESLint configuration file
 * @author Zachary K. Watkins
 * @description This file's configuration should mirror the `.eslintrc.js`
 * configuration. Both files are needed until the `.eslintrc.js` can be safely
 * removed.
 */
'use strict'

const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/strict',
    'plugin:jsdoc/recommended',
  ],
  ignorePatterns: ['node_modules/', 'dist/', 'build/'],
  plugins: ['jsdoc', 'react', 'react-hooks', 'jsx-a11y'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es2018: true,
    commonjs: true,
    jest: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    indent: ['error', 4],
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
)
