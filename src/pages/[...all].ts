import type { APIRoute } from 'astro'
import { getAllPosts } from '~/utils'

/**
 * 尝试将打平之前的 url 重定向到新的 url，对于错误的 url 重定向到 404
 */
export const GET: APIRoute = async ({ redirect, url }) => {
  const _url = url.pathname.split('/').filter(Boolean)
  if (_url[0] !== 'blog' && _url[0] !== 'note')
    return redirect('/404')

  const posts = await getAllPosts()
  const slugs = posts.flat().map(post => post.slug)

  if (slugs.includes(_url.slice(1).join('/') as any))
    return redirect(`/posts/${_url.reverse()[0]}/`)

  return redirect('/404')
}
