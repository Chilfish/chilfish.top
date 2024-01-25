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

export function getPostsByTag(posts: Post[], tag: string) {
  return posts
    .filter(post => post.data.tags
      .map(tag => tag.toLowerCase()).includes(tag),
    )
}

export function filterTags(posts: Post[]) {
  return posts
    .flatMap(post => post.data.tags)
    .map(tag => tag.toLowerCase())
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
