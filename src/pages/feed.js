import rss from '@astrojs/rss'
import sanitizeHtml from 'sanitize-html'
import MarkdownIt from 'markdown-it'
import { getPosts } from '~/utils'

const parser = new MarkdownIt()

export async function GET(context) {
  const blogs = await getPosts()

  return rss({
    title: 'Chilfish’s Blog',
    description: 'Chilfish’s Blog',
    site: context.site,
    items: blogs.map(({ data: blog, slug, body }) => ({
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
