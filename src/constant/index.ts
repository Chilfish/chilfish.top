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
    banner: `${imgHost}/v0.1.10.png`,
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

export const SponsorList = [
  {
    id: 0,
    name: 'SaraKale',
    time: '2024-01-14 10:07',
    amount: 50.00,
    message: '非常感谢您开发了方便的好工具~!',
    reply: '感谢你的支持😇',
    project: {
      name: ProjectList[0].name,
      url: ProjectList[0].url,
    },
  },
]

export type Sponsor = typeof SponsorList[number]
