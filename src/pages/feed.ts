import type { APIRoute } from 'astro'
import rss, { type RSSFeedItem } from '@astrojs/rss'

import { markdownCompiler } from '~/plugins'
import { getPosts } from '~/utils'

const excludes = ['forks']
const limit = 15

export const GET: APIRoute = async (context) => {
  const blogs = await getPosts()

  const rssItems: RSSFeedItem[] = await Promise.all(
    blogs
      .slice(0, limit)
      .filter(({ data }) =>
        (data.tags as string[]).some(tag => !excludes.includes(tag)),
      )
      .map(async ({ data: blog, slug, body }) => ({
        title: blog.title,
        content: await markdownCompiler(body),
        description: blog.description,
        pubDate: blog.date,
        author: blog.author,
        link: `/blog/${slug}/`,
      })),
  )

  return rss({
    title: 'Chilfish’s Blog',
    description: 'Chilfish’s Blog',
    site: context.site!,
    items: rssItems,
    customData: `<language>zh-cn</language>`,
  })
}
