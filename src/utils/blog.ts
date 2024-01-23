import { getCollection } from 'astro:content'
import { sortPostsByDate } from './date'
import type { Blog } from '~/types'

export async function getBlogs(): Promise<Blog[]> {
  const posts = await getCollection('blog', ({ data }) => !data.isDraft)
  return sortPostsByDate(posts.map(post => ({
    ...post,
    data: {
      ...post.data,
      description: post.data.description || post.body.slice(0, 140),
    },
  })))
}

export async function getBlogsByTag(tag: string): Promise<Blog[]> {
  const posts = await getBlogs()
  return posts.filter(post => post.data.tags.includes(tag))
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getBlogs()
  const tags = posts.map(post => post.data.tags).flat()
  return [...new Set(tags)]
}

/**
 * 获取相邻的 8 条博客
 */
export async function getAdjacentBlogs(slug: string) {
  const posts = await getBlogs()
  const index = posts.findIndex(post => post.slug === slug)

  const resPosts = []

  for (let i = index - 4; i < index + 4; i++) {
    if (i < 0)
      continue
    resPosts.push(posts[i])
  }

  for (let i = index + 4; i < index + 8; i++) {
    if (i >= posts.length)
      break
    resPosts.push(posts[i])
  }

  return resPosts
    .filter(post => !!post)
    .map(post => ({
      title: post.data.title,
      slug: post.slug,
    }))
}
