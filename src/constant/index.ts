import { githubHost, imgHost } from './config'
import type { Project } from './zodTypes'

export * from './config'
export * from './techs'
export * from './zodTypes'
export * from './hostIcons'

export const ProjectList: Project[] = [
  {
    name: 'Weibo-archiver',
    description: '将你的新浪微博存档备份的油猴脚本，为号被完全夹没前绸缪 😭',
    banner: `${imgHost}/weibo/cover.webp`,
    license: 'MIT',
    techs: ['ts', 'vue', 'monkey'],
    url: `${githubHost}/Weibo-archiver`,
    isWeb: false,
  },
  {
    name: 'Chillab',
    description: '实现我一些小想法的地方',
    banner: `${imgHost}/chillab.webp`,
    license: 'MIT',
    techs: ['nuxt', 'ts', 'unocss'],
    url: `https://vue.chilfish.top`,
    isWeb: true,
  },
  {
    name: 'Chilfish.top',
    description: '我的个人网站',
    banner: `${imgHost}/chilfish.top.webp`,
    license: 'MIT',
    techs: ['astro', 'vue', 'ts'],
    url: `https://chilfish.top`,
    isWeb: true,
  },
]

const weibo = {
  name: ProjectList[0].name,
  url: ProjectList[0].url,
}

export const SponsorList = [
  {
    id: 0,
    name: 'SaraKale',
    time: '2024-01-14 10:07',
    amount: 50.00,
    message: '非常感谢您开发了方便的好工具~！',
    reply: '感谢你的支持😇',
    project: weibo,
  },
  {
    id: 1,
    name: '匿名',
    time: '2024-02-28 16:56',
    amount: 20.00,
    message: '感谢你！如果能用index.html直接查看就更好了。',
    reply: '❤️更方便的桌面版 app 正在开发中~',
    project: weibo,
  },
]

export type Sponsor = typeof SponsorList[number]
