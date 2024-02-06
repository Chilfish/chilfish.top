import type { MarkdownLayoutProps, Page } from 'astro'
import type { CollectionEntry } from 'astro:content'
import type { PostSchema } from '~/content/config'

export * from './music'

export * from '~/content/config'

export type ContentType = 'blog' | 'note'

export type Post<T extends ContentType = ContentType> = CollectionEntry<T>
export type PostPage<T extends ContentType = ContentType> = Page<Post<T>>

export interface PrevNext {
  title?: string
  link?: string
}

export interface props extends Partial<PostSchema> {
  title: string
  class?: string
}

export interface MainProps extends props {
  frontmatter?: MarkdownLayoutProps<props>['frontmatter']
}
