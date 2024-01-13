import { JSDOM } from 'jsdom'
import 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'

dayjs.locale('zh-cn')

const blogUrl = 'https://note.chilfish.top'

export default defineEventHandler(async (_event) => {
  const html = await $fetch<string>(`${blogUrl}/category/blog/`)
    .catch((err) => {
      console.log(err)
      return ''
    })

  if (!html)
    return []

  const dom = new JSDOM(html)
  const doc = dom.window.document

  const posts = Array.from(doc.querySelectorAll('article.vp-article-item'))

  return posts.splice(0, 5).map((post, idx) => {
    const title = post.querySelector('a.vp-link')
    const dateStr = post.querySelector('meta')?.getAttribute('content')

    return {
      id: idx,
      title: title?.textContent?.trim() || '',
      url: `${blogUrl}${title?.getAttribute('href')}` || '/',
      date: dateStr
        ? dayjs(dateStr).format('YYYY-MM-DD')
        : '',
    } as const
  })
})
