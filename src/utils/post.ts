import type { ContentType, Post, PostSchema } from '~/types'
import { getCollection } from 'astro:content'
import { sortPostsByDate } from './date'

export async function getAllPosts(includeDiary: boolean = false) {
  const [blogs, notes] = await Promise.all([
    getPosts('blog', includeDiary),
    getPosts('note'),
  ])
  return [blogs, notes]
}

export async function getPosts(
  type: ContentType = 'blog',
  includeDiary: boolean = false,
): Promise<Post[]> {
  const allPosts = await getCollection(type, ({ data }) => !data.draft)

  const posts = allPosts.filter(({ data }) => !data.tags.includes('diary'))
  const diaryPosts = allPosts.filter(({ data }) => data.tags.includes('diary'))

  if (includeDiary) {
    diaryPosts.forEach(post => posts.push(post))
  }

  return sortPostsByDate(posts.map(post => ({
    ...post,
    data: {
      ...post.data,
      tags: (post.data as PostSchema).tags.map(tag => tag.toLowerCase()),
    },
  })))
}

export function getPostsByTag(posts: Post[], tag: string) {
  return posts.filter(({ data }) => data.tags.includes(tag))
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
  const posts = await getPosts(type)
  const index = posts.findIndex(post => post.id === slug)

  const resPosts = []

  let prevStart = index - 4

  // 如果没有最后四篇
  if (index >= posts.length - 4)
    prevStart = posts.length - 8

  for (let i = prevStart; i < index + 4; i++) {
    if (i < 0)
      i = 0
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
      slug: post.id,
    }))
}
