import { unified } from 'unified'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeRewrite from 'rehype-rewrite'
import remarkEmoji from 'remark-emoji'
import rehypeFigure from 'rehype-figure'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

import type { RehypePlugins, RemarkPlugins } from 'astro'
import { rehypeExternalLinksOptions, rehypeRewriteOptions } from './markdownParse'
import { remarkReadingTime } from './read-time'

export * from './markdownParse'
/**
 * markdown 转 HTML 的编译器
 * @param markdown markdown 文本
 */
export async function markdownCompiler(markdown: string) {
  return await unified()
    .use(remarkParse)
    .use(remarkRehype, {
      allowDangerousHtml: true,
    })
    .use(remarkEmoji, { accessible: true })
    .use(rehypeFigure)
    .use(rehypeRewrite, rehypeRewriteOptions({ isRss: true }))
    .use(rehypeStringify, {
      allowDangerousHtml: true,
      closeSelfClosing: true,
      closeEmptyElements: true,
      omitOptionalTags: true,
    })
    .process(markdown)
    .then(file => file.toString())
}

export const rehypePlugins: RehypePlugins = [
  // 将 md 的图片语法，转换为 figure 标签 wrapped 的图片
  // 将 alt 属性转换为 figcaption 标签
  [rehypeFigure, { className: 'figure' }],

  [rehypeExternalLinks, rehypeExternalLinksOptions],
  [rehypeRewrite, rehypeRewriteOptions()],
]

export const remarkPlugins: RemarkPlugins = [
  // 将 md 的 emoji 语法转换为 emoji 图标
  [remarkEmoji, { accessible: true }],
  remarkReadingTime,
]
