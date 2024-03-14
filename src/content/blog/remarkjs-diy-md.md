---
title: 使用 Remark.js 自定义渲染 MD
description: 使用 remark.js 和 remark-rehype 来自定义渲染 markdown，实现外链网站的图标、图片懒加载、阅读时间等
date: 2024-03-14
tags: [js, markdown]
---

### Astro.js yes

迁移到 Astro 的原因之一是，尽管 vuepress 有许多插件可以扩展 Markdown 的功能，但自定义程度仍然太低。虽然也可以编写相应的插件，但既然选择了 Astro 并手动编写主题样式，那也少不了自定义解析 Markdown。

Astro.js 使用 [remark.js] 进行 Markdown 解析并转换为 HTML，然后使用 [remark-rehype] 修改编译后的 HTML，在配置文件中体现在 [config: markdown.remarkPlugins] 中。

本次打算实现以下内容：

- 为外部链接添加对应网站图标，类似前面几个链接；
- 统一图片格式，将 `![alt](src)` 的 Markdown 语法转换为用 `<figcaption>` 包裹的 img 标签，并将 alt 属性作为图片注释；
- 对图片设置懒加载：将所有 src 替换为占位符，在滚动到视图时再替换回原始 src；
- 解决引用本地文件和在 Astro 构建时表现不一致的问题；
- 计算大约阅读时间和字数。

所有源码实现可见于 [plugins]。

### 注意的点

图标方案使用 Unocss 提供的图标库，在匹配到对应 hostname 后会添加相应的 `<i class={icon-class}/>`。由于这是动态生成的内容，在构建时 Unocss 不会输出相关图标 CSS。

需要预先准备好一个包含图标信息的数组，并将其添加到 [unocss safelist] 中。（同时要注意在导入至 `unocss.config.ts` 时，在配置阶段不能导入与 Astro 相关无关包，需要单独处理：[constant/hostIcons.ts]）。

此外，在 remark 阶段似乎没有直接访问 Astro 上下文信息。因此无法使用任何 Astro 函数；但可以导入类型。

[remark.js]: https://github.com/remarkjs/
[remark-rehype]: https://github.com/remarkjs/remark-rehype
[config: markdown.remarkPlugins]: https://docs.astro.build/zh-cn/reference/configuration-reference/#markdownremarkplugins
[plugins]: https://github.com/Chilfish/chilfish.top/tree/e420f60/src/plugins
[unocss safelist]: https://unocss.dev/guide/extracting#safelist
[constant/hostIcons.ts]: https://github.com/Chilfish/chilfish.top/tree/e420f60/src/constant/hostIcons.ts
