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
    techs: ['ts', 'nuxt', 'monkey'],
    url: `${githubHost}/Weibo-archiver`,
    isWeb: false,
  },
  // {
  //   name: 'Chillab',
  //   description: '实现我一些小想法的地方',
  //   banner: `${imgHost}/chillab.webp`,
  //   license: 'MIT',
  //   techs: ['nuxt', 'ts', 'unocss'],
  //   url: `${githubHost}/chillab`,
  //   isWeb: true,
  // },
  {
    name: 'Chilfish.top',
    description: '我的个人网站',
    banner: `${imgHost}/chilfish.top.webp`,
    license: 'MIT',
    techs: ['astro', 'vue', 'ts'],
    url: `${githubHost}/chilfish.top`,
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
    reply: '现在能直接访问 weibo.chilfish.top 来查看了🥳，感谢你的支持',
    project: weibo,
  },
  {
    id: 2,
    name: '匿名',
    time: '2024-04-04 11:10',
    amount: 6.00,
    message: '软件做得很好！谢谢！',
    reply: '感谢你的支持😇',
    project: weibo,
  },
]
  .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

export type Sponsor = typeof SponsorList[number]
