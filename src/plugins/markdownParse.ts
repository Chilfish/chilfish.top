import type { RehypeRewriteOptions } from 'rehype-rewrite'

// 在解析 markdown 的这一阶段，是没有 Astro 上下文的，所以不能导入任何涉及到 Astro 的 API
// 当然类型定义是可以的，因为类型定义不会被编译到最终的代码中

import rehypeImage from './rehype-image'
import rehypeLink from './rehype-link'

/**
 * 重写 html 的插件
 * - 修改了 a 标签的 href 属性，来适配 Astro 的路由
 */
export function rehypeRewriteOptions(config?: { isRss: boolean }): RehypeRewriteOptions {
  const { isRss } = config || { isRss: false }
  return {
    rewrite(node, _index, parent) {
      if (node.type !== 'element')
        return

      node = rehypeImage({ node, parent, isRss })
      node = rehypeLink(node as any)

      // remove all end with .md
      if (node.tagName === 'a') {
        const href = node.properties.href as string
        if (href.startsWith('http'))
          return

        let newHref = href.replace(/\.md/i, '/').toLowerCase()
        // 因为 SSG 是 filename/index.html，所以还得再走一层
        if (href.startsWith('../'))
          newHref = `../${newHref}`

        // 如果是同级目录，则指向到上一级
        const list = ['/', '#', '../']
        if (!list.some(item => newHref.startsWith(item)))
          newHref = `../${newHref}`

        node.properties.href = newHref
      }
    },
  }
}
