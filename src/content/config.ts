import { defineCollection, z } from 'astro:content'

const postSchema = z.object({
  title: z.string(),
  cover: z.string().optional(),
  tags: z.array(z.string()).optional().default(['blog']),
  keywords: z.string().optional().default('Blog'),
  author: z.string().optional().default('Chilfish'),
  description: z.string().optional().default(''),
  isDraft: z.boolean().optional().default(false),
  date: z.date().optional().default(new Date()),
  modifiedDate: z.date().optional(),
  maxDepthTOC: z.number().optional(),
})

const post = defineCollection({
  type: 'content',
  schema: () => postSchema,
})

export type PostSchema = z.infer<typeof postSchema>

export const collections = {
  blog: post,
  note: post,
}
