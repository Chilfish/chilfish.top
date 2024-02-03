import type { Post } from '~/types'

export const DAY = 1000 * 60 * 60 * 24
export const MONTH = DAY * 30
export const YEAR = DAY * 365

export function formatDate(date: Date | string | number): string {
  if (typeof date === 'string' || typeof date === 'number')
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
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export function lastYear() {
  const today = new Date()
  return new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
}

export function todayToLastMonth(count = 1) {
  const today = new Date()
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - count, today.getDate())
  return [lastMonth, today]
}
