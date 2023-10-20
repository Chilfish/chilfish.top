import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: true, // enable stylistic formatting rules
  typescript: true,
  vue: true,
  jsonc: false,
  yml: false,
}, {
  rules: {
    'no-console': 'off',
    'no-alert': 'off',
    'vue/no-multiple-template-root': 'off',
  },
}, {
  ignores: [
    'dist',
    '.output',
    '.nuxt',
  ],
})
