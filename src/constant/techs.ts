export const Techs = {
  ts: {
    icon: 'i-simple-icons:typescript',
    color: '#3178c6',
  },
  js: {
    icon: 'i-simple-icons:javascript',
    color: '#f1e05a',
  },
  vue: {
    icon: 'i-simple-icons:vuedotjs',
    color: '#41b883',
  },
  react: {
    icon: 'i-simple-icons:react',
    color: '#61dafb',
  },
  astro: {
    icon: 'i-simple-icons:astro',
    color: '#ffffff',
  },
  next: {
    icon: 'i-simple-icons:nextdotjs',
    color: '#000000',
  },
  nest: {
    icon: 'i-simple-icons:nestjs',
    color: '#ea2845',
  },
  nuxt: {
    icon: 'i-simple-icons:nuxtdotjs',
    color: '#00c58e',
  },
  vite: {
    icon: 'i-simple-icons:vite',
    color: '#646cff',
  },
  solid: {
    icon: 'i-simple-icons:solid',
    color: '#2d5493',
  },
  tailwind: {
    icon: 'i-simple-icons:tailwindcss',
    color: '#38b2ac',
  },
  unocss: {
    icon: 'i-simple-icons:unocss',
    color: '#4c4c4c',
  },
  html: {
    icon: 'i-simple-icons:html5',
    color: '#e34c26',
  },
  css: {
    icon: 'i-simple-icons:css3',
    color: '#563d7c',
  },
  scss: {
    icon: 'i-simple-icons:sass',
    color: '#c6538c',
  },
  markdown: {
    icon: 'i-simple-icons:markdown',
    color: '#083fa1',
  },
  kotlin: {
    icon: 'i-simple-icons:kotlin',
    color: '#a97bff',
  },
  python: {
    icon: 'i-simple-icons:python',
    color: '#3572a5',
  },
  c: {
    icon: 'i-simple-icons:c',
    color: '#555555',
  },
  cpp: {
    icon: 'i-simple-icons:cplusplus',
    color: '#f34b7d',
  },
  go: {
    icon: 'i-simple-icons:go',
    color: '#00add8',
  },
  rust: {
    icon: 'i-simple-icons:rust',
    color: '#dea584',
  },
  dart: {
    icon: 'i-simple-icons:dart',
    color: '#00b4ab',
  },
  monkey: {
    icon: 'i-simple-icons:tampermonkey',
    color: '#ffffff',
  },
  node: {
    icon: 'i-simple-icons:nodedotjs',
    color: '#026e00',
  },
  deno: {
    icon: 'i-simple-icons:deno',
    color: '#000000',
  },
  electron: {
    icon: 'i-simple-icons:electron',
    color: '#47848f',
  },
  tauri: {
    icon: 'i-simple-icons:tauri',
    color: '#24c8db',
  },
  flutter: {
    icon: 'i-simple-icons:flutter',
    color: '#02569b',
  },
  reactnative: {
    icon: 'i-simple-icons:react',
    color: '#61dafb',
  },
  android: {
    icon: 'i-simple-icons:android',
    color: '#a4c639',
  },

} as const

export type Tech = keyof typeof Techs

export const TechList = Object.keys(Techs) as Tech[]
export const TechIcons = Object.values(Techs).map(v => v.icon)
