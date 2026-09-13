export const Techs = {
  'ts': 'i-lucide:file-code',
  'js': 'i-lucide:braces',
  'vue': 'i-lucide:component',
  'react': 'i-lucide:atom',
  'astro': 'i-lucide:orbit',
  'next': 'i-lucide:layers',
  'nest': 'i-lucide:server',
  'nuxt': 'i-lucide:mountain',
  'vite': 'i-lucide:zap',
  'solid': 'i-lucide:box',
  'tailwind': 'i-lucide:wind',
  'unocss': 'i-lucide:palette',
  'html': 'i-lucide:code-xml',
  'css': 'i-lucide:paintbrush',
  'scss': 'i-lucide:brush',
  'markdown': 'i-lucide:file-text',
  'kotlin': 'i-lucide:coffee',
  'python': 'i-lucide:terminal',
  'c': 'i-lucide:cpu',
  'cpp': 'i-lucide:cpu',
  'go': 'i-lucide:gauge',
  'rust': 'i-lucide:cog',
  'dart': 'i-lucide:target',
  'monkey': 'i-lucide:puzzle',
  'node': 'i-lucide:hexagon',
  'deno': 'i-lucide:triangle',
  'electron': 'i-lucide:app-window',
  'tauri': 'i-lucide:app-window',
  'flutter': 'i-lucide:feather',
  'reactnative': 'i-lucide:tablet-smartphone',
  'android': 'i-lucide:smartphone',
  'react-router': 'i-lucide:route',
} as const

export type Tech = keyof typeof Techs

export const TechList = Object.keys(Techs) as Tech[]
export const TechIcons = Object.values(Techs)
