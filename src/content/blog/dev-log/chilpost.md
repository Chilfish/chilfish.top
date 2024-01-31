---
title: Chilpost
date: 2023-08-06
tags: [dev-logs, Vue, Nuxt]
---

### 开始

预览：[Chilpost]，[GIthub]

一个月前的 7 月，推的反沉迷和 Thread 预发布，正好看到 @egoist 写了个仿推的 demo [panik] 来公测。于是月初终于也想着复刻一波了 🤣

<twitter>
  <blockquote class="twitter-tweet"><p lang="zh" dir="ltr">四个小时写了个 <a href="https://t.co/Rc35oGaKtM">https://t.co/Rc35oGaKtM</a></p>&mdash; 方向錯亂 (@localhost_4173) <a href="https://twitter.com/localhost_4173/status/1675230250207420416?ref_src=twsrc%5Etfw">July 1, 2023</a></blockquote>
</twitter>

正好是一号开始写的，写到第六天了但还是不及初版 panik，可能是一开始就没怎么设计好，也没想到要写完它）到现在也还是用 mock 数据来模拟，第五天才加到 api 部分，但还是 Lodis ( Local Dictionary Service [梗][Lodis])，纯内存数组

![day 6](/blog/dev-log/time.webp)

后续时不时缝缝补补地改，但感觉整体的复杂度什么的都还不怎么样，这方面比较完善的实现还是 Nuxt 社区的 [elk]😹

之后因为 Web 课程的大作业只能用 Spring Boot 来写，于是就写了份 SB 版本的，顺便当作练习了。具体详见 [chilpost-sb]

### 配置

一开始想的是顺便也当做复健一下前端了，Vite, Vue, Scss, VueUse, Pinia，最多也就用 [UnoCSS 的图标][Antfu-CSS icon]，图标包 [tabler icons] 是真的舒服

SCSS 格式化用到了 [stylelint]，添加了一下插件分别来排序、vue|Scss 支持：stylelint-config-(recess-order | recommended-vue | standard-scss)，抄了一个 [stylelint config]

DX 上用 [unplugin-vue-components] 来自动导入 ~/components 的组件，autoprefixer 来自动添加浏览器 CSS 前缀，@unocss/reset 来清除浏览器默认样式来抹平

### init

动机还是突然想试一下 CSS 的经典顶栏背景高斯模糊，而小红薯网页版动效看着舒服，再就是加上一个夜间模式的切换，到处抄抄就写好了个初版 [/post]。睡醒第二天想着还是把它抽离出来好了，并加了个底栏，先遵循个 Tailwind 的移动优先 （预览都能在 [deployments] 中倒序找到）

然后的慢慢添加以前的想法，header 滑动显影（移动端）、响应式的导航栏（手机底部，大屏左边）、mock 假数据来测样式、弹窗等

### mock 的事

调样式肯定得有一些假数据来模拟，在手写的之前突然想到了 fake.js，于是造了假数组导出，到这还好。但我按旧习惯要把这个写到文件里，不然每次刷新数据就得重新生成（其实也不是很麻烦，只是这样路由匹配不到总 404，然后又得重新在首页点进去）。为了方便还是导出到 ts 文件里，以 `export const ${mock.name} = ${JSON.stringify(mock.data)};` 的形式，并肯定得加到 .gitignore 中，再由 `pnpm dev|build` 的时候生成出来，但这时候就遇到了个大问题......

读写文件得用 `node:fs` 模块，但 Vue 是运行在浏览器中，所以我想到让 Vite 来运行。但一开始找不到什么方法来实现，甚至想到了 ts-node，但折腾这边又有些麻烦了。于是就去找了一堆像是 vite-plugin-fs 之类的插件来尝试，但后来才发现这些大多都是用在让浏览器读取 server 的文件，但其实我只需要在运行前读写这个文件就行了

虽然到后来想到的最佳方案应该是，在 Vite 的生命周期 hooks 类似 'build:before' 中调用这个函数（也是迁移到 Nuxt 的时候才想到的）。但我碰巧地在摸索的时候发现在 vite.config.ts 中的 console.log 是输出在服务端终端里的，也就是这个配置文件能运行函数并 server only，于是就取巧地这么做了。Vercel Build 也能通过，发现其实他将这些 mock 数据 都打包到了 index.js 中了 hh

其中有个小插曲是，我将生成的 mock data 的命名 `export const fakeUsers = []` 和准备用作输出的数组重名了，而且还导出了，导致后来 import 的时候没看清路径，导了动态的。结果就是能出现数据，但浏览器报错找不到 `node:fs` hhh，一开始没想到什么问题，但将 fs 相关的与下面这个动态的数据分离后确实没问题了......

```ts
import fs from 'node:fs/promises'

// 就是这个，这个是动态生成的，但我不小心引用了它
// 就导致了浏览器之上而下地运行时发现找不到 fs 而报错
export const fakeUsers = [
  ...Array.from({ length: user_num }, () => genUser()),
  genUser('Chilfish'),
]
```

### 样式

虽然我的 SCSS 写得还是很糊，感觉就是只是用了嵌套和 & 而已。比较惊艳的还是果然能用 @mixin 写一些很方便的函数，下面这个是对于 `button.chat` `button.like` 等不同的 class 都有不同的颜色样式，一个个写就麻烦又难维护。问了下 GPT 能不能用 类名-颜色 这样的映射 map 关系来实现，果然能，并能对其中的颜色再进一步调整。最后生成出来的颜色当然还是固定的，[预览][SCSS online]

```scss
@use "sass:map";
@use "sass:color";

$color-map: (
  ".chat": $theme-color,
  ".repost": #00ba7c,
  ".like": #f91880,
  ".share": $theme-color,
  ".menu": $theme-color,
  ".back": $theme-color,
);

@mixin action-btn() {
  @each $key, $value in $color-map {
    $color: map.get($color-map, $key);

    button#{$key} {
      &:hover .box {
        background-color: color.adjust($color, $alpha: -0.9);
      }

      &:hover {
        color: $color;
      }
    }
  }
}
```

迁移到 Nuxt 之后，才发现我的样式目录可能放错了，assets 才对，并能够 `@use "~/assets/variables" as *;`。并且应该多用 @use：[SCSS @use vs @import]

并为了用 UnoCSS 和 Tailwind 的移动端优先，我也这么设置了媒体查询

```scss
$sm: 640px;
$lg: 1024px;

#main {
  width: 100%;
  margin-top: $header-height;
  margin-bottom: $nav-footer-height;
}

@media (min-width: $sm) {
  #main {
    width: stretch;
    margin-bottom: 0;
    margin-left: $nav-aside-width;
  }
}
```

### 获取异步数据

推文列表等应该是动态加载出来的，那在 fetch 到之前得有个 isLoading 判断，@vueuse 有两个很好用的方法来处理异步：[computedAsync]、[useAsyncState]

区别在于正如它们的名字，computedAsync 就是 computed 函数的异步版，每当有变化时就运行，useAsyncState 则是没有响应式的，默认立刻执行，也能手动。第一个常用于路由切换时 fetch 数据，例如从 `/u/@chilfish` 切到了 `/u/@fish`，路由参数通过 watch 得到了变化，用 computedAsync 就能跟着一起变化

一开始想着把 useAsyncState 放在 watch 里也能获取，但这样变量作用域又成了一个新的问题。它通常是用来刷新或进入某个路由时获取数据、绑定 button 手动 fetch 等场景

再要注意的是他们都是返回可 null 的，需要在 !isLoading 加个非空判断才能避免 undefined 的可能

### Api 交互

终于是想着要接后端了，一开始想的是后面可以换语言来写后端（例如下学期要写的 Spring Boot），于是想到了一直想试试的 Vercel Serverless Functions）其实这些完全不冲突的呀......Nuxt 也能换 baseApiURL

写得差不多了，也能回数据了，但有很大的问题在于，/api 这部分是属于 Node 规范，而 Vue 是浏览器规范，这就导致 tsconfig 起冲突了。用 ES 模块导入的方式在 Vue 中可行，但每次调用时总会报错：Error: Cannot find module xx

捣鼓了好久，在 [Vercel Discussions] 翻到了 [ts esm-node]

> relative import paths need full extensions (e.g we have to write import "./foo.js" instead of import "./foo")

也就是即便我在写 ts，要 esm-node 的规范导入模块的话，还是得加 .js 后缀（不是 .ts）......对比了好几种配置的方案，用 tsc 看了编译后的结果，还真就只能用这样的方式才能让 Node 正确地识别这些模块

蒜了......这么写实在是太麻烦了 😅 想着就直接躺床睡了个好几小时的下午觉（终于睡下了），醒来第一件事就是立马迁移到 Nuxt

### Nuxt, yes!

过程记在了 PR [Migrate to Nuxt3]，目录结构大迁移，`+5,869 −1,672`

感谢 Nuxt DevTools 的 Hooks 界面，让我找到了比较合适的方法去生成 mock 数据

```ts
export default defineNuxtConfig({
  hooks: {
    'nitro:build:before': () => genStaticData(), // generate static data before build
  },
})
```

遇到比较多的还是 SSR 与数据获取之间的问题了，我在 App.vue 入口这 fetch 当前用户的信息并存到 pinia 中

```ts
const userStore = useUserStore()
useAsyncState(userStore.fetchCurUser(), null)

// 用户喜好配置 要放入口初始化才能应用到全局（其实就是要启动 pinia 了）
useDarkStore() // init dark mode
```

鉴于 SSR，是没有 Document 之类的变量，定义动态 title 就需要使用 useHead（definePageMeta 是用了宏的形式，其值必须是字面量数据，而不能是动态的变量），监听页面滚动就用 useWindowScroll

表单验证使用了 `@vueuse/useAsyncValidator`，只要定义规则就能很简单地客户端表单验证

在 /layout 中定义页面布局，就能很容易地配合媒体查询来布局

### database/mysql2

终于要上数据库了😹😹完全是走一步想一步的节奏

找了很多 mysql 相关的库，看文档感觉用起来都不怎么样，但还是给找着了 [Node-mysql2]。esm、type、promise、mysql 的具名参数 等等都十分的诱人，文档也很全。记录在了 [chilpost/#12]

由于它是直接运行 sql 字符串的，为了调试方便，我写了个工具函数来将 sql 查询语句按特定的格式转为 ts 字符串变量，这样就能使用 sql 文件来管理的同时，又能很方便地运行它们。只要将它放在 nitro:init 地 hook 中，就能在运行前转换了

详见：[utils/sqlToTs.ts]

### GoodBye Restful Api

看了知乎的那篇讨论，将所有的 server api 返回全换成了 200 的状态码，而具体的业务逻辑错误则是在 data 中返回

记录在了 [chilpost/#13]，并专门写了篇博客：[return_all_HTTP200_api]

### 用 todo 来记录进度

某天半夜时突然想着要不拿 todo 记录一下要做的事，顺便有个更直观的进度，以及事后感受得到的成就感，再就是为之后能很好地会想起都做了什么，能更好地记录日志什么的。总之就是好处多多，也是属于日志的一种了

一开始就简单地用小米笔记记一下，它地云同步还算可以，就是功能有些太简陋了，之后就换到了 todoist.com

![来自 todoist.com](/blog/dev-log/chilpost-todo.webp)

### 前后端分页

才想起来要写分页，后端就很简单地写好 pages、size等参数就好，但在前端我想实现划到底部时自动拼页，麻烦事就来了……

因为这是要复用的地方，在 `/explore` `/home` `/search` `/@user` 这些地方都可以用得到，于是就要单独为它们管理状态，它们的接口也都不一样。为了切换路由后不重复请求，还得都存到 pinia 里管理😫

详见：[loadPosts.ts] 和 [PostInfinite.vue]，虽然感觉写得很怪很不对，但还是跑起来了hhh

[Chilpost]: https://chilpost.vercel.app
[panik]: https://panik.app
[Antfu-CSS icon]: https://antfu.me/posts/icons-in-pure-css-zh
[tabler icons]: https://icones.js.org/collection/tabler
[stylelint]: https://stylelint.io/
[unplugin-vue-components]: https://github.com/antfu/unplugin-vue-components
[Lodis]: https://www.zhihu.com/question/592335961/answer/2973109071
[/post]: https://learn-rfwzkmb6x-chilfish.vercel.app/post
[deployments]: https://github.com/Chilfish/chilpost/deployments
[SCSS online]: https://sass-lang.com/playground/#MTElNDB1c2UlMjAlMjJzYXNzJTNBbWFwJTIyJTNCJTBBJTQwdXNlJTIwJTIyc2FzcyUzQWNvbG9yJTIyJTNCJTBBJTBBJTI0dGhlbWUtY29sb3IlM0ElMjAlMjMxMjM0NTYlM0IlMEElMjRjb2xvci1tYXAlM0ElMjAoJTBBJTIwJTIwJTIyLmNoYXQlMjIlM0ElMjAlMjR0aGVtZS1jb2xvciUyQyUwQSUyMCUyMCUyMi5yZXBvc3QlMjIlM0ElMjAlMjMwMGJhN2MlMkMlMEElMjAlMjAlMjIubGlrZSUyMiUzQSUyMCUyM2Y5MTg4MCUyQyUwQSUyMCUyMCUyMi5zaGFyZSUyMiUzQSUyMCUyNHRoZW1lLWNvbG9yJTJDJTBBJTIwJTIwJTIyLm1lbnUlMjIlM0ElMjAlMjR0aGVtZS1jb2xvciUyQyUwQSUyMCUyMCUyMi5iYWNrJTIyJTNBJTIwJTI0dGhlbWUtY29sb3IlMkMlMEEpJTNCJTBBJTBBJTQwbWl4aW4lMjBhY3Rpb24tYnRuKCklMjAlN0IlMEElMjAlMjAlNDBlYWNoJTIwJTI0a2V5JTJDJTIwJTI0dmFsdWUlMjBpbiUyMCUyNGNvbG9yLW1hcCUyMCU3QiUwQSUyMCUyMCUyMCUyMCUyNGNvbG9yJTNBJTIwbWFwLmdldCglMjRjb2xvci1tYXAlMkMlMjAlMjRrZXkpJTNCJTBBJTBBJTIwJTIwJTIwJTIwYnV0dG9uJTIzJTdCJTI0a2V5JTdEJTIwJTdCJTBBJTIwJTIwJTIwJTIwJTIwJTIwJTI2JTNBaG92ZXIlMjAuYm94JTIwJTdCJTBBJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwYmFja2dyb3VuZC1jb2xvciUzQSUyMGNvbG9yLmFkanVzdCglMjRjb2xvciUyQyUyMCUyNGFscGhhJTNBJTIwLTAuOSklM0IlMEElMjAlMjAlMjAlMjAlMjAlMjAlN0QlMEElMEElMjAlMjAlMjAlMjAlMjAlMjAlMjYlM0Fob3ZlciUyMCU3QiUwQSUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMGNvbG9yJTNBJTIwJTI0Y29sb3IlM0IlMEElMjAlMjAlMjAlMjAlMjAlMjAlN0QlMEElMjAlMjAlMjAlMjAlN0QlMEElMjAlMjAlN0QlMEElN0QlMEElMEElNDBpbmNsdWRlJTIwYWN0aW9uLWJ0bigpJTNC
[SCSS @use vs @import]: https://juejin.cn/post/7117836922176667685
[useAsyncState]: https://vueuse.org/core/useasyncstate/#useasyncstate
[computedAsync]: https://vueuse.org/core/computedasync/#computedasync
[ts esm-node]: https://www.typescriptlang.org/docs/handbook/esm-node.html
[Vercel Discussions]: https://github.com/orgs/vercel/discussions/1225#discussioncomment-4642381
[GIthub]: https://github.com/Chilfish/chilpost
[Node-mysql2]: https://github.com/sidorares/node-mysql2#index
[elk]: https://github.com/elk-zone/elk
[stylelint config]: https://github.com/Chilfish/chilpost/blob/vue/.stylelintrc.cjs
[utils/sqlToTs.ts]: https://github.com/Chilfish/chilpost/blob/35945eea1c0ec3f3c029788848163dc972e3960b/server/utils/sqlToTs.server.ts
[return_all_HTTP200_api]: ../return-all-HTTP200-api.md
[chilpost-sb]: ./chilpost-sb.md
[Migrate to Nuxt3]: https://github.com/Chilfish/chilpost/pull/5
[chilpost/#12]: https://github.com/Chilfish/chilpost/pull/12
[chilpost/#13]: https://github.com/Chilfish/chilpost/pull/13
[loadPosts.ts]: https://github.com/Chilfish/chilpost/blob/cd9701b2810defff2075b3e4c8e9aadf18f7de25/src/composables/loadPosts.ts
[PostInfinite.vue]: https://github.com/Chilfish/chilpost/blob/cd9701b2810defff2075b3e4c8e9aadf18f7de25/src/components/Post/Infinite.vue
