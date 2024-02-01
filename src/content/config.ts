import { defineCollection, z } from 'astro:content'

const postSchema = z.object({
  title: z.string(),
  date: z.date(),
  cover: z.string().optional(),
  tags: z.array(z.string()).optional().default(['blog']),
  keywords: z.string().optional().default('Blog'),
  author: z.string().optional().default('Chilfish'),
  description: z.string().optional().default(''),
  isDraft: z.boolean().optional().default(false),
  modifiedDate: z.date().optional(),
  maxDepthTOC: z.number().optional(),
})

const post = defineCollection({
  type: 'content',
  schema: () => postSchema,
})

export type PostSchema = z.infer<typeof postSchema> & {
  reading: number
  words: number
}

export const collections = {
  blog: post,
  note: post,
}
