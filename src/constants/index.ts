export const appName = 'Chilfish'
export const appDescription = 'Chilfish\'s personal website, built with Nuxt3 and ❤️.'

export const imgHost = 'https://p.chilfish.top'

export const redirectMap = [
  { from: '/github', to: 'https://github.com/Chilfish' },
  { from: '/me', to: 'https://chilfish.top' },
  { from: '/bili', to: 'https://space.bilibili.com/259486090' },
  { from: '/zhihu', to: 'https://www.zhihu.com/people/Walmart_Zelo' },
  { from: '/x', to: 'https://twitter.com/chilllish' },
  { from: '/weibo', to: 'https://weibo.com/chilfish' },
  { from: '/blog', to: 'https://note.chilfish.top' },
  { from: '/163', to: 'https://music.163.com/#/user/home?id=1533509979' },
] as const

export const Projects = [
  {
    id: 1,
    name: 'Weibo-archiver',
    description: '将你的新浪微博存档备份的油猴脚本，为号被完全夹没前绸缪 😭',
    banner: `${imgHost}/v0.1.10.png`,
    license: 'MIT',
    language: 'typescript',
    stars: 0,
    color: '#f1e05a',
    url: '',
    isGithub: true,
  },
  {
    id: 2,
    name: 'Chillab',
    description: '实现我一些小想法的地方',
    banner: `${imgHost}/chillab.webp`,
    license: 'MIT',
    language: 'typescript',
    stars: 0,
    color: '#f1e05a',
    url: '',
    isGithub: true,
  },
]

export const LangColors = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Vue: '#41b883',
  React: '#61dafb',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Scss: '#c6538c',
  Markdown: '#083fa1',
  Kotlin: '#a97bff',
  Python: '#3572a5',
} as const

export type Languages = keyof typeof LangColors

export type Project = typeof Projects[number]

export const SponsorList = [
  {
    id: 0,
    name: 'SaraKale',
    time: '2024-01-14 10:07',
    amount: 50.00,
    message: '非常感谢您开发了方便的好工具~!',
    reply: '感谢你的支持😇',
  },
]

export type Sponsor = typeof SponsorList[number]
