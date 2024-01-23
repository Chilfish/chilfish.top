import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next()
  const html = await response.text()

  const regex = /<a\s+href="([^"]+)">/gi
  const result = html.replace(regex, (match, href) => {
    const newHref = href.replace(/\.md$/i, '').toLowerCase()
    return `<a href="${newHref}">`
  })
  return new Response(result, response)
})
