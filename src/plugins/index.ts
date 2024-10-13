import type { RehypePlugins, RemarkPlugins } from 'astro'
import rehypeRaw from 'rehype-raw'
import rehypeRewrite from 'rehype-rewrite'
import rehypeStringify from 'rehype-stringify'
import remarkEmoji from 'remark-emoji'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'

import { unified } from 'unified'
import { rehypeRewriteOptions } from './markdownParse'

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
    .use(rehypeRaw)
    .use(remarkEmoji, { accessible: true })
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
  rehypeRaw,
  [rehypeRewrite, rehypeRewriteOptions({ isRss: false })],
]

export const remarkPlugins: RemarkPlugins = [
  // 将 md 的 emoji 语法转换为 emoji 图标
  [remarkEmoji, { accessible: true }],
]
