import type { Options } from 'rehype-external-links'
import type { RehypeRewriteOptions } from 'rehype-rewrite'

// 在解析 markdown 的这一阶段，是没有 Astro 上下文的，所以不能导入任何涉及到 Astro 的 API
// 当然类型定义是可以的，因为类型定义不会被编译到最终的代码中
import { imgHost } from '../constant/config'
import { getHostIcon } from '../constant/hostIcons'

const isDev = import.meta.env.DEV
const IMGHOST = isDev ? 'http://localhost:5173' : imgHost

/**
 * 重写外链的插件，添加对应的网站图标
 */
export const rehypeExternalLinksOptions: Options = {
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

function findChildren(node: any, tagName: string) {
  return node.children.find((item: any) => item?.type === 'element' && item?.tagName === tagName) || null
}

/**
 * 重写 html 的插件
 * - 修改了 a 标签的 href 属性，来适配 Astro 的路由
 * - 修改了 img 标签，优化加载以及设置图床链接
 * @param isRss 是否是 rss
 */
export function rehypeRewriteOptions(config?: { isRss: boolean }): RehypeRewriteOptions {
  const { isRss } = config || { isRss: false }
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

        // 因为 SSG 是 filename/index.html，所以还得再走一层
        if (href.startsWith('../'))
          newHref = `../${newHref}`

        node.properties.href = newHref
      }

      else if (node.tagName === 'figure') {
        const img = findChildren(node, 'img')
        const figcaption = findChildren(node, 'figcaption')

        if (!img)
          return

        let src = img.properties.src as string
        if (src.startsWith('/'))
          src = `${IMGHOST}${src}`

        const imgProp: Partial<HTMLImageElement> = {
          decoding: 'async',
          loading: 'lazy',
          referrerPolicy: 'same-origin',
          src: isRss ? src : '/placeholder.webp',
        }
        img.properties = {
          ...node.properties,
          ...imgProp,

          // dateset，用于自定义 Image 组件的解析
          dataSrc: isRss ? undefined : src,
        } as any

        node.children = [
          {
            type: 'element',
            tagName: 'a',
            properties: {
              href: img.properties.src,
              target: '_blank',
            },
            children: [img],
          },
          figcaption,
        ].filter(Boolean)
      }
    },
  }
}
