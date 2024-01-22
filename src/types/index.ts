import type { Page } from 'astro'
import type { CollectionEntry } from 'astro:content'

export * from './music'

export type Blog = CollectionEntry<'blog'>
export type BlogPage = Page<Blog>
