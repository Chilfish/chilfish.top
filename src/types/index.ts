import type { Page } from 'astro'
import type { CollectionEntry } from 'astro:content'

export * from './music'

export type ContentType = 'blog' | 'note'

export type Post<T extends ContentType = ContentType> = CollectionEntry<T>
export type PostPage<T extends ContentType = ContentType> = Page<Post<T>>

export interface PrevNext {
  title?: string
  link?: string
}
