import type { RSSFeedItem } from '@astrojs/rss'
import type { APIRoute } from 'astro'
import rss from '@astrojs/rss'
import { markdownCompiler } from '~/plugins'
import { getPosts } from '~/utils'

const excludes = ['forks']
const limit = 15

/** 文章详情路由为 /posts/<slug>/，取 id 最后一段（兼容 dev-log/ 等子目录） */
const postLink = (id: string) => `/posts/${id.split('/').reverse()[0]}/`

export const GET: APIRoute = async (context) => {
  const blogs = await getPosts('blog')

  const items: RSSFeedItem[] = await Promise.all(
    blogs
      .filter(({ data }) => !data.tags.some(tag => excludes.includes(tag)))
      .slice(0, limit)
      .map(async ({ data, id, body }) => ({
        title: data.title,
        description: data.description,
        pubDate: data.date,
        author: data.author,
        link: postLink(id),
        content: await markdownCompiler(body ?? ''),
      })),
  )

  return rss({
    title: 'Chilfish’s Blog',
    description: 'Chilfish’s Blog',
    site: context.site!,
    items,
    customData: `<language>zh-cn</language>
<follow_challenge>
  <feedId>57645530191768577</feedId>
  <userId>41455408951018496</userId>
</follow_challenge>`,
  })
}
