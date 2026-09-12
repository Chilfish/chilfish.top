import type { Project } from './zodTypes'
import { imgHost } from './config'

export * from './config'
export * from './hostIcons'
export * from './techs'
export * from './zodTypes'

export const ProjectList: Project[] = [
  {
    name: 'Weibo-archiver',
    description: '将你的新浪微博存档备份的在线网站，为号被完全夹没前绸缪 😭',
    banner: `${imgHost}/weibo/cover.webp`,
    license: 'Apache-2.0 license',
    techs: [],
    url: `https://weibo-archiver.chilfish.top`,
    isWeb: true,
  },
  // {
  //   name: 'Chilfish.top',
  //   description: '我的个人网站',
  //   banner: `${imgHost}/chilfish.top.webp`,
  //   license: 'MIT',
  //   techs: ['astro', 'vue', 'ts'],
  //   url: `${githubHost}/chilfish.top`,
  //   isWeb: true,
  // },
  {
    name: 'Tweets Archiver',
    description: '一些推特的自动存档网站',
    banner: `${imgHost}/tweets-viewer.webp`,
    license: 'MIT',
    techs: [],
    url: `https://tweet.chilfish.top/`,
    isWeb: true,
  },
]

const weibo = {
  name: ProjectList[0].name,
  url: ProjectList[0].url,
}

export interface Sponsor {
  id: number
  name: string
  time: string
  amount: number
  message: string
  reply: string
  project: {
    name: string
    url: string
  }
}

export const SponsorList = ([
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
    message: '感谢你！如果能用 index.html 直接查看就更好了。',
    reply: '现在能直接访问 weibo.chilfish.top 来查看了🥳，感谢你的支持',
    project: weibo,
  },
  {
    id: 2,
    name: '匿名',
    time: '2024-04-04 11:10',
    amount: 6.00,
    message: '软件做得很好！谢谢！',
    reply: '感谢你的支持',
    project: weibo,
  },
  {
    id: 3,
    name: '不动点明王',
    time: '2024-06-08 11:59',
    message: '感谢',
    reply: '谢谢你~',
    amount: 6.00,
    project: weibo,
  },
  {
    id: 4,
    name: '匿名',
    time: '2024-08-04 02:03',
    message: '感谢，很好的工具！开发辛苦了',
    amount: 10.00,
    reply: '',
    project: weibo,
  },
  {
    id: 5,
    name: 'M.R.',
    time: '2024-11-21 09:57',
    message: '感谢开发，再接再厉！',
    amount: 10.00,
    reply: '',
    project: weibo,
  },
  {
    id: 6,
    name: '远去之蓝',
    time: '2025-02-08 23:44',
    message: '非常好的项目，使我能保存微博。如果断网也能看到就好了',
    amount: 50.00,
    reply: '',
    project: weibo,
  },
  {
    id: 7,
    name: '醒酒器',
    time: '2025-02-15 15:19',
    message: '感谢开发工具，可以请教您刷新没有显示插件页面的问题吗',
    amount: 71.00,
    reply: '',
    project: weibo,
  },
  {
    id: 8,
    name: '匿名',
    time: '2025-05-09 03:06',
    message: '',
    amount: 25.00,
    reply: '',
    project: weibo,
  },
  {
    id: 9,
    name: '匿名',
    time: '2025-05-22 11:54',
    message: '',
    amount: 57.00,
    reply: '',
    project: weibo,
  },
  {
    id: 10,
    name: '阿尼亚是安妮亜',
    time: '2025-04-25 11:54',
    message: '',
    amount: 88.00,
    reply: '',
    project: weibo,
  },
  {
    id: 11,
    name: '匿名',
    time: '2025-03-28 11:54',
    message: '',
    amount: 50.00,
    reply: '',
    project: weibo,
  },
  {
    id: 13,
    name: '匿名',
    time: '2025-03-11 11:54',
    message: '',
    amount: 8.80,
    reply: '',
    project: weibo,
  },
] satisfies Sponsor[])
  .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
