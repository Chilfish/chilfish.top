import type { RehypePlugins } from 'astro'
import rehypeExternalLinks, { type Options } from 'rehype-external-links'
import { getHostIcon } from './constant/hostIcons'

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

export const rehypePlugins: RehypePlugins = [
  [rehypeExternalLinks, rehypeExternalLinksOptions],
]
