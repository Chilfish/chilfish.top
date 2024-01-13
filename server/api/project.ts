import { LangColors, type Languages, Projects } from '~/constants'

interface Repo {
  html_url: string
  stargazers_count: number
  language: Languages
}

export default defineEventHandler(async (_event) => {
  const data = await Promise.all(
    Projects.map(async (project) => {
      const { name, isGithub } = project
      if (!isGithub)
        return project

      const res = await $fetch<Repo>(`https://api.github.com/repos/chilfish/${name}`)
        .catch(() => ({
          stargazers_count: 0,
          language: 'TypeScript',
        } as unknown as Repo))

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
