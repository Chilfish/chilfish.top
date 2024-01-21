import type { CollectionEntry } from 'astro:content'

export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-cn', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function sortPostsByDate(
  posts: CollectionEntry<'blog'>[],
) {
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}
