import { z } from 'astro/zod'

const _Project = z.object({
  name: z.string(),
  description: z.string(),
  banner: z.url().optional(),
  url: z.url(),
  repo: z.url().optional(),
})

export type Project = z.infer<typeof _Project>
