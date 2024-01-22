import { z } from 'astro:content'
import { githubHost, imgHost } from './config'

export * from './config'

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

const _Project = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  banner: z.string().url(),
  license: z.string(),
  language: z.string(),
  stars: z.number(),
  color: z.string(),
  url: z.string().url(),
  isGithub: z.boolean(),
})

export type Project = z.infer<typeof _Project>

export const Projects: Project[] = [
  {
    id: 1,
    name: 'Weibo-archiver',
    description: '将你的新浪微博存档备份的油猴脚本，为号被完全夹没前绸缪 😭',
    banner: `${imgHost}/v0.1.10.png`,
    license: 'MIT',
    language: 'Typescript',
    stars: 36,
    color: LangColors.TypeScript,
    url: `${githubHost}/Weibo-archiver`,
    isGithub: true,
  },
  {
    id: 2,
    name: 'Chillab',
    description: '实现我一些小想法的地方',
    banner: `${imgHost}/chillab.webp`,
    license: 'MIT',
    language: 'Vue',
    stars: 0,
    color: LangColors.Vue,
    url: `${githubHost}/Chillab`,
    isGithub: true,
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
      name: Projects[0].name,
      url: Projects[0].url,
    },
  },
]

export type Sponsor = typeof SponsorList[number]
