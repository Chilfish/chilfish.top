import { type CollectionEntry, getCollection } from 'astro:content'
import { sortPostsByDate } from './date'

export type Blog = CollectionEntry<'blog'>

export async function getBlogs(): Promise<Blog[]> {
  const posts = await getCollection('blog', ({ data }) => !data.isDraft)
  return sortPostsByDate(posts)
}

export async function getPagingBlogs(page: number, limit: number): Promise<Blog[]> {
  const posts = await getBlogs()
  return posts.slice((page - 1) * limit, page * limit)
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
