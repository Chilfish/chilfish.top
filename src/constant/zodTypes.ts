import type { Tech } from './techs'
import { z } from 'astro/zod'

const _Project = z.object({
  name: z.string(),
  description: z.string(),
  banner: z.url().optional(),
  license: z.string(),
  techs: z.array(z.custom<Tech>()),
  url: z.url(),
  isWeb: z.boolean(),
})

export type Project = z.infer<typeof _Project>
