import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'

const postSchema = z.object({
  title: z.string(),
  date: z.date(),
  cover: z.string().optional(),
  tags: z.array(z.string()).optional().default(['blog']),
  keywords: z.string().optional().default('Blog'),
  author: z.string().optional().default('Chilfish'),
  description: z.string().optional().default(''),
  draft: z.boolean().optional().default(false),
  modifiedDate: z.date().optional(),
  maxDepthTOC: z.number().optional(),
})

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: postSchema,
})

const note = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/note' }),
  schema: postSchema,
})

export type PostSchema = z.infer<typeof postSchema>

export const collections = {
  blog,
  note,
}
