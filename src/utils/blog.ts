import { getCollection } from 'astro:content'
import { sortPostsByDate } from './date'
import type { ContentType, Post } from '~/types'

export async function getAllPosts() {
  const [blogs, notes] = await Promise.all([
    getPosts('blog'),
    getPosts('note'),
  ])
  return [blogs, notes]
}

export async function getPosts(type: ContentType = 'blog'): Promise<Post[]> {
  const posts = await getCollection(type, ({ data }) => !data.isDraft)

  return sortPostsByDate(posts)
}

export async function getPostsByTag(tag: string) {
  const posts = await getAllPosts()
  return posts.flat().filter(post => post.data.tags?.includes(tag))
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts()
  const tags = posts.flat().map(post => post.data.tags!).flat()
  return [...new Set(tags)]
}

/**
 * 获取相邻的 8 条博客
 */
export async function getAdjacentBlogs(slug: string, type: ContentType = 'blog') {
  const posts = (await getPosts(type)).flat()
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
