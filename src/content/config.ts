import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    tags: z.array(z.string()).optional().default([]),
    cover: image().optional(),
    author: z.string().optional().default('Chilfish'),
    description: z.string().optional().default(''),
    isDraft: z.boolean().optional().default(false),
    date: z.date().optional().default(new Date()),
  }),
})

export const collections = {
  blog,
}
