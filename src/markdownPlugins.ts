import type { RehypePlugins } from 'astro'
import rehypeExternalLinks, { type Options } from 'rehype-external-links'
import rehypeRewrite, { type RehypeRewriteOptions } from 'rehype-rewrite'
import rehypeFigure from 'rehype-figure'
import { getHostIcon } from './constant/hostIcons'
import { imgHost } from './constant/config'

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

      const newHref = href.replace(/\.md/i, '').toLowerCase()
      node.properties.href = newHref
    }

    if (node.tagName === 'img') {
      let src = node.properties.src as string

      if (src.startsWith('/'))
        src = `${imgHost}${src}`

      const imgProp: Partial<HTMLImageElement> = {
        decoding: 'async',
        loading: 'lazy',
        referrerPolicy: 'same-origin',
        src,
      }

      node.properties = {
        ...node.properties,
        ...(imgProp as any),
      }
    }
  },
}

export const rehypePlugins: RehypePlugins = [
  [rehypeExternalLinks, rehypeExternalLinksOptions],
  [rehypeRewrite, rehypeRewriteOptions],
  rehypeFigure,
]

export const remarkPlugins = [
]
