import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import { config as baseConfig } from './base.js';

/**
 * A shared ESLint configuration for Vite + React applications.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
];
