import type { APIRoute } from 'astro'
import { imgHost } from '~/constant/config'

export const GET: APIRoute = ({ params }) => {
  const { slug } = params
  const url = `${imgHost}/blog/${slug}`

  return new Response(null, {
    status: 302,
    headers: {
      Location: url,
    },
  })
}
