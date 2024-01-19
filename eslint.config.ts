import path from 'node:path'
import { fileURLToPath } from 'node:url'
import antfu from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
})

export default antfu(
  {
    unocss: true,
    formatters: true,
    rules: {
      'no-console': 'off',
      'vue/no-multiple-template-root': 'off',
      'node/prefer-global/process': 'off',
    },
  },

  // Legacy config
  // thanks https://github.com/antfu/eslint-config/issues/146#issuecomment-1834425495
  ...compat.config({
    overrides: [{
      files: ['*.astro'],
      extends: [
        'plugin:astro/recommended',
      ],
      globals: {
        astroHTML: true,
      },
      env: {
        // Enables global variables available in Astro components.
        'node': true,
        'astro/astro': true,
        'es2020': true,
      },
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        // this is necessary to force a correct indentation in astro
        'style/indent': ['error', 2],
        'style/jsx-indent': 'off',
        'style/jsx-one-expression-per-line': 'off',
        'no-unused-vars': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    }],
  }),
)
