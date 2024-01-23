import type { CollectionEntry } from 'astro:content'
import type { ContentType } from '~/types'

export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-cn', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function sortPostsByDate(
  posts: CollectionEntry<ContentType>[],
) {
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}
