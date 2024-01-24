import { z } from 'astro:content'
import type { Tech } from './techs'

const _Project = z.object({
  name: z.string(),
  description: z.string(),
  banner: z.string().url().optional(),
  license: z.string(),
  techs: z.array(z.custom<Tech>()),
  url: z.string().url(),
  isWeb: z.boolean(),
})

export type Project = z.infer<typeof _Project>
