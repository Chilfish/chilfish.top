import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  astro: true,
  formatters: {
    css: false,
    markdown: true,
    astro: false,
  },
  rules: {
    'no-console': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/no-unused-refs': 'off',
    'node/prefer-global/process': 'off',
  },
})
