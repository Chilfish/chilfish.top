import type { RehypePlugins, RemarkPlugins } from 'astro'
import { unified } from 'unified'
import rehypeExternalLinks, { type Options } from 'rehype-external-links'
import rehypeRewrite, { type RehypeRewriteOptions } from 'rehype-rewrite'
import remarkEmoji from 'remark-emoji'
import rehypeFigure from 'rehype-figure'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

// 在解析 markdown 的这一阶段，是没有 Astro 上下文的，所以不能导入任何涉及到 Astro 的 API
// 当然类型定义是可以的，因为类型定义不会被编译到最终的代码中
import { imgHost } from './constant/config'
import { getHostIcon } from './constant/hostIcons'

const isDev = import.meta.env.DEV
const IMGHOST = isDev ? 'http://localhost:5173' : imgHost

/**
 * 重写外链的插件，添加对应的网站图标
 */
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

/**
 * 重写 html 的插件
 * - 修改了 a 标签的 href 属性，来适配 Astro 的路由
 * - 修改了 img 标签，优化加载以及设置图床链接
 * @param isRss 是否是 rss
 */
function rehypeRewriteOptions(isRss = false): RehypeRewriteOptions {
  return {
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
        if (!list.some(item => newHref.startsWith(item)))
          newHref = `../${newHref}`

        node.properties.href = newHref
      }

      else if (node.tagName === 'img') {
        let src = node.properties.src as string

        if (src.startsWith('/'))
          src = `${IMGHOST}${src}`

        const imgProp: Partial<HTMLImageElement> = {
          decoding: 'async',
          loading: 'lazy',
          referrerPolicy: 'same-origin',
          src: isRss ? src : '/placeholder.webp',
        }

        node.properties = {
          ...node.properties,
          ...imgProp,

          // dateset，用于自定义 Image 组件的解析
          dataSrc: isRss ? undefined : src,
        } as any
      }
    },
  }
}

export const rehypePlugins: RehypePlugins = [
  [rehypeExternalLinks, rehypeExternalLinksOptions],
  [rehypeRewrite, rehypeRewriteOptions()],

  // 将 md 的图片语法，转换为 figure 标签 wrapped 的图片
  // 将 alt 属性转换为 figcaption 标签
  [rehypeFigure, { className: 'figure' }],
]

export const remarkPlugins: RemarkPlugins = [
  // 将 md 的 emoji 语法转换为 emoji 图标
  [remarkEmoji, { accessible: true }],
]

/**
 * markdown 转 HTML 的编译器
 * @param markdown markdown 文本
 */
export async function markdownCompiler(markdown: string) {
  return await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(remarkEmoji, { accessible: true })
    .use(rehypeExternalLinks, rehypeExternalLinksOptions)
    .use(rehypeFigure)
    .use(rehypeRewrite, rehypeRewriteOptions(true))
    .use(rehypeStringify)
    .process(markdown)
    .then(file => file.toString())
}
