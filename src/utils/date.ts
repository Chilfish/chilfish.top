import type { Post } from '~/types'

export function formatDate(date: Date | string): string {
  if (typeof date === 'string')
    date = new Date(date)

  return date.toLocaleDateString('zh-cn', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function sortPostsByDate(
  posts: Post[],
) {
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}
