import { Buffer } from 'node:buffer'
import { consola } from 'consola'
import { LangColors, type Languages, Projects } from '~/constants'

interface Repo {
  html_url: string
  stargazers_count: number
  language: Languages
}

const {
  OAUTH_GITHUB_CLIENT_ID = '',
  OAUTH_GITHUB_CLIENT_SECRET = '',
  GITHUB_TOKEN = '',
} = process.env

let token = ''

if (GITHUB_TOKEN)
  token = Buffer.from(`token:${GITHUB_TOKEN}`).toString('base64')
else if (OAUTH_GITHUB_CLIENT_ID && OAUTH_GITHUB_CLIENT_SECRET)
  token = Buffer.from(`${OAUTH_GITHUB_CLIENT_ID}:${OAUTH_GITHUB_CLIENT_SECRET}`).toString('base64')

export default defineEventHandler(async (_event) => {
  const data = await Promise.all(
    Projects.map(async (project) => {
      const { name, isGithub } = project
      if (!isGithub)
        return project

      const res = await $fetch<Repo>(`https://api.github.com/repos/chilfish/${name}`, {
        headers: {
          Authorization: `Basic ${token}`,
        },
        onResponse(ctx) {
          const limnt = ctx.response.headers.get('X-RateLimit-Remaining')

          if (limnt && Number(limnt) < 10)
            consola.warn(`[/api/project] GitHub API rate limit: ${limnt}`)
        },
      })
        .catch((err) => {
          consola.error(`[/api/project] ${err}`)
          return null
        })

      if (!res)
        return project

      return {
        ...project,
        url: res.html_url,
        language: res.language,
        color: LangColors[res.language] || '#fff',
        stars: res.stargazers_count,
      }
    }),
  )
  return data
})
