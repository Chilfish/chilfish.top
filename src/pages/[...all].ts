import type { APIRoute } from 'astro'
import { redirectMap } from '~/constant/redirects'
import { getAllPosts } from '~/utils'

const posts = await getAllPosts()
const slugs = posts.flat().map(post => post.slug)

/**
 * 尝试将打平之前的 url 重定向到新的 url，对于错误的 url 重定向到 404
 */
export const GET: APIRoute = async ({ redirect, url }) => {
  const _url = url.pathname.split('/').filter(Boolean)

  // if (_url[0] !== 'blog' && _url[0] !== 'note')
  //   return redirect('/404')

  if (slugs.includes(_url.slice(1).join('/') as any))
    return redirect(`/posts/${_url.reverse()[0]}/`)

  const from = url.pathname
  const to = redirectMap.find(redirect => redirect.from === from)?.to

  if (to)
    return redirect(to)

  return redirect('/404')
}
