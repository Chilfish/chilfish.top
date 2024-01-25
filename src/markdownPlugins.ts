import type { RehypePlugins, RemarkPlugins } from 'astro'
import rehypeExternalLinks, { type Options } from 'rehype-external-links'
import rehypeRewrite, { type RehypeRewriteOptions } from 'rehype-rewrite'
import remarkEmoji from 'remark-emoji'
import rehypeFigure from 'rehype-figure'
import { getHostIcon } from './constant/hostIcons'
import { imgHost } from './constant/config'

const isDev = import.meta.env.DEV
const IMGHOST = isDev ? 'http://localhost:5173' : imgHost

const rehypeExternalLinksOptions: Options = {
  target: '_blank',
  rel: ['noopener', 'noreferrer', 'nofollow'],
  content(element) {
    const href = element.properties?.href as string
    const hostname = new URL(href).hostname.replace('www.', '')

    const icon = getHostIcon(hostname)

    return {
      type: 'element',
      tagName: 'i',
      properties: {
        className: ['icon ml-4px', icon],
      },
      children: [{
        type: 'text',
        value: '',
      }],
    }
  },
}

const rehypeRewriteOptions: RehypeRewriteOptions = {
  rewrite(node) {
    if (node.type !== 'element')
      return

    // remove all end with .md
    if (node.tagName === 'a') {
      const href = node.properties.href as string
      if (href.startsWith('http'))
        return

      let newHref = href.replace(/\.md/i, '/').toLowerCase()

      // 如果是同级目录，则指向到上一级
      const list = ['/', '#', '../']
      if (list.some(item => !newHref.startsWith(item)))
        newHref = `../${newHref}`

      node.properties.href = newHref
    }

    if (node.tagName === 'img') {
      let src = node.properties.src as string

      if (src.startsWith('/'))
        src = `${IMGHOST}${src}`

      const imgProp: Partial<HTMLImageElement> = {
        decoding: 'async',
        loading: 'lazy',
        referrerPolicy: 'same-origin',
        src: '/placeholder.webp',
      }

      node.properties = {
        ...node.properties,
        ...imgProp,
        dataSrc: src, // dateset: data-src
      } as any
    }
  },
}

export const rehypePlugins: RehypePlugins = [
  [rehypeExternalLinks, rehypeExternalLinksOptions],
  [rehypeRewrite, rehypeRewriteOptions],
  rehypeFigure,
]

export const remarkPlugins: RemarkPlugins = [
  [remarkEmoji, { accessible: true }],
]
