import getReadingTime from 'reading-time'
import { toString } from 'mdast-util-to-string'

export function getReadTime(raw: any) {
  let text = raw
  if (typeof raw !== 'string')
    text = toString(raw)
  return getReadingTime(text)
}

export function remarkReadingTime(): any {
  return function (tree: any, { data }: any) {
    const { minutes, words } = getReadTime(tree)
    const { frontmatter } = data.astro
    data.astro.frontmatter = {
      ...frontmatter,
      reading: minutes,
      words,
    }
  }
}
