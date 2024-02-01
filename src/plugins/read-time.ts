import getReadingTime from 'reading-time'
import { toString } from 'mdast-util-to-string'

export function remarkReadingTime(): any {
  return function (tree: any, { data }: any) {
    const textOnPage = toString(tree)
    const readingTime = getReadingTime(textOnPage)

    const { frontmatter } = data.astro
    data.astro.frontmatter = {
      ...frontmatter,
      reading: readingTime.minutes,
      words: readingTime.words,
    }
  }
}
