/**
 * @fileoverview ESLint configuration for the YCP Servizi project.
 * This file sets up linting rules for TypeScript and React, and extends Next.js recommended configurations.
 */

module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'next/core-web-vitals'
    ],
    rules: {
      // Customize ESLint rules here if needed.
    }
  };
  