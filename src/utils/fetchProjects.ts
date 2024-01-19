import { Buffer } from 'node:buffer'
import { LangColors, Projects } from '~/constant'
import type { Languages, Project } from '~/constant'

interface Repo {
  html_url: string
  stargazers_count: number
  language: Languages
}

const {
  GITHUB_TOKEN = '',
} = import.meta.env

let token = ''

if (GITHUB_TOKEN)
  token = Buffer.from(`token:${GITHUB_TOKEN}`).toString('base64')

export async function fetchProjects() {
  const data = await Promise.all(
    Projects.map(async (project) => {
      const { name, isGithub } = project
      if (!isGithub)
        return project

      const res = await fetch(`https://api.github.com/repos/chilfish/${name}`, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      })
        .then(res => res.json() as Promise<Repo>)
        .catch((err) => {
          console.error(`[/api/project] ${err}`)
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
  return data as Project[]
}
