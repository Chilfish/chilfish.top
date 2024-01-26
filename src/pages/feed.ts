import type { APIRoute } from 'astro'
import rss from '@astrojs/rss'
import sanitizeHtml from 'sanitize-html'
import MarkdownIt from 'markdown-it'
import { getPosts } from '~/utils'

const parser = new MarkdownIt()

const excludes = ['forks']
const limit = 20

export const GET: APIRoute = async (context) => {
  const blogs = await getPosts()

  return rss({
    title: 'Chilfish’s Blog',
    description: 'Chilfish’s Blog',
    site: context.site!,
    items: blogs
      .slice(0, limit)
      .filter(({ data }) => data.tags.some(tag => !excludes.includes(tag.toLocaleLowerCase())))
      .map(({ data: blog, slug, body }) => ({
        title: blog.title,
        content: sanitizeHtml(parser.render(body)),
        description: blog.description,
        pubDate: blog.date,
        author: blog.author,
        link: `/blog/${slug}/`,
      })),
    customData: `<language>zh-cn</language>`,
  })
}
