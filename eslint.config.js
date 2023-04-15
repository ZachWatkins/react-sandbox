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
const reactRecommended = require('eslint-plugin-react/configs/recommended')
const reactHooks = require('eslint-plugin-react-hooks')
const jsxAlly = require('eslint-plugin-jsx-a11y')
const jsdoc = require('eslint-plugin-jsdoc')

const MyConfig = {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}', '*.js'],
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
        globals: {
            ...globals.serviceworker,
            ...globals.browser,
            ...globals.node,
            ...globals.es2018,
            ...globals.commonjs,
        },
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        ...js.configs.recommended.rules,
        ...jsdoc.configs.recommended.rules,
        ...reactRecommended.rules,
        ...reactHooks.configs.recommended.rules,
        ...jsxAlly.configs.strict.rules,
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
}

const MyTestConfig = {
    files: ['**/*.{test,spec}.{js,jsx}'],
    languageOptions: {
        globals: {
            ...globals.jest,
        },
    },
}

module.exports = defineFlatConfig([
    {
        ignores: ['node_modules/', 'dist/', 'build/'],
    },
    MyConfig,
    MyTestConfig,
])
