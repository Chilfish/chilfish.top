import { type CollectionEntry, getCollection } from 'astro:content'
import { sortPostsByDate } from './date'

export type Blog = CollectionEntry<'blog'>

export async function getBlogs(): Promise<Blog[]> {
  const posts = await getCollection('blog', ({ data }) => !data.isDraft)
  return sortPostsByDate(posts)
}
