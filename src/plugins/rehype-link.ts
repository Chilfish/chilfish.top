import type { RootContentMap } from 'hast'

export function isExternalLink(href: string) {
  return href.startsWith('http') || href.startsWith('//')
}

export function addPropsToLink(link: RootContentMap['element']) {
  const href = link.properties.href as string
  const linkProps = {
    ...link.properties,
    ...isExternalLink(href) && {
      target: '_blank',
      rel: ['noopener', 'nofollow'],
    },
  }
  link.properties = linkProps
  return link
}

export default function rehypeLink(link: RootContentMap['element']) {
  if (link.type !== 'element' || link.tagName !== 'a')
    return link

  return addPropsToLink(link)
}
