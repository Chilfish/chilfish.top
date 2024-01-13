export const appName = 'Chilfish.top'
export const appDescription = 'Chilfish.top'

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

export const Socials = [
  {
    name: 'blog',
    text: 'Blog',
    link: 'https://note.chilfish.top',
    icon: 'i-ri-book-2-line',
    class: 'hover:bg-gray-700 dark:hover:bg-white dark:hover:text-gray-900',
  },
  {
    name: 'github',
    text: '',
    link: 'https://github.com/Chilfish',
    icon: 'i-ri-github-fill',
    class: 'hover:bg-gray-700 dark:hover:bg-white dark:hover:text-gray-900',
  },
  {
    name: 'mail',
    text: '',
    link: 'mailto:chill4fish@gmail.com',
    icon: 'i-ri-mail-fill',
    class: 'hover:bg-[#E84234]',
  },
  {
    name: 'twitter',
    text: '',
    link: 'https://twitter.com/chilllish',
    icon: 'i-fa-brands-twitter',
    class: 'hover:bg-[#00ACEE]',
  },
  {
    name: 'tel',
    text: '',
    link: 'https://t.me/Chilfish',
    icon: 'i-ri-telegram-fill',
    class: 'hover:bg-[#0088CC]',
  },
  {
    name: 'discord',
    text: '',
    link: 'https://discord.com/users/1039168181215961199',
    icon: 'i-ic-baseline-discord',
    class: 'hover:bg-[#5865F2]',
  },
  {
    name: 'weibo',
    text: '',
    link: 'https://weibo.com/chilfish',
    icon: 'i-fa-brands-weibo',
    class: 'hover:bg-[#FF8200]',
  },
  {
    name: 'bili',
    text: '',
    link: 'https://space.bilibili.com/259486090',
    icon: 'i-ri-bilibili-fill',
    class: 'hover:bg-[#fb7299]',
  },
  {
    name: 'zhihu',
    text: '',
    link: 'https://www.zhihu.com/people/Walmart_Zelo',
    icon: 'i-ri-zhihu-line',
    class: 'hover:bg-[#558EFF]',
  },
  {
    name: '163',
    text: '',
    link: 'https://music.163.com/user/home?id=1533509979',
    icon: 'i-ri-netease-cloud-music-line',
    class: 'hover:bg-[#DD001B]',
  },
] as const

export const Projects = [
  {
    id: 1,
    name: 'Weibo-archiver',
    description: '将你的新浪微博存档备份的油猴脚本，为号被完全夹没前绸缪 😭',
    banner: 'https://p.chilfish.top/v0.1.10.png',
    license: 'MIT',
    language: 'typescript',
    stars: 0,
    updated_at: '',
  },
] as const

export const LangColors = {
  typescript: '#3178c6',
  javascript: '#f1e05a',
  vue: '#41b883',
  react: '#61dafb',
  html: '#e34c26',
  css: '#563d7c',
  scss: '#c6538c',
  markdown: '#083fa1',
  kotlin: '#a97bff',
  python: '#3572a5',
} as const
