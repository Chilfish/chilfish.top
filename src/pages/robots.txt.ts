import type { APIRoute } from 'astro'
import { host } from '~/constant'

const robots = `
User-agent: *
Disallow:

User-agent: *
Allow: /

Sitemap: ${new URL('sitemap-index.xml', host).href}
`.trim()

export const GET: APIRoute = () =>
  new Response(robots, {
    headers: { 'Content-Type': 'text/plain' },
  })
