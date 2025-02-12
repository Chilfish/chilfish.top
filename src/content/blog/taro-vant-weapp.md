---
title: Taro + Vant-WeApp + Vue
date: 2023-07-18
tags: [Vue, Weapp]
---

### 开始

小程序跨端除了只适用 Vue 的 Uniapp 外，还有京东的 [Taro]，支持 Vue/React，目前使用 WebPack 5 进行编译，后续会使用 Vite。[Vant] 是有赞的移动端为主的组件库，[Vant-WeApp] 是其中的微信小程序版 (也就是这个只能用在微信小程序中，h5 都不能)

[仓库地址]

### 初始化

需要先安装 Taro 的脚手架，然后创建模板。或是我摸出来的 [Start]

```bash
pnpm add -g @tarojs/cli

taro init
```

其中选择默认模板即可，同时由于模板的依赖有许多都过时了而导致编译失败，需要先升级 `pnpm up --latest`

[Taro 的项目结构]和内部 Vue 的写法主要是以小程序 `<View/>` 的为主，当然也可以设置成 HTML 的标签

### 配置

`app.config.ts` 是小程序的全局配置，`/pages` 下是页面路由，每个页面的 `*.config.ts` 是该页面的小程序配置。这些皮脂定义了路由页面 (全局)、窗口状态和样式等。可见文档：[全局配置]和[页面配置]

#### eslint

新建 Vue 项目当然得 extend @antfu 的配置）

```bash
pnpm add -D @antfu/eslint-config
```

然后在 `.eslintrc` 的 extends 添加 `@antfu` 就好了，`pnpm eslint . --fix`

#### tsconfig

基本没差什么，添加别名和导入 @vant 就需要添加：

```json
{
  "compilerOptions": {
    "typeRoots": ["node_modules/@types", "miniprogram-api-typings"],
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "exclude": ["node_modules", "dist"]
}
```

#### 使用 HTML 标签

其实实际上是可以使用 HTML 标签的，装个插件就行，它会将这些标签转译为小程序的标签

```bash
pnpm add -D @tarojs/plugin-html
```

```js
import ComponentsPlugin from 'unplugin-vue-components/webpack'

const config = {
  // ...
  plugins: ['@tarojs/plugin-html'],
}
```

#### 使用 `unplugin-vue-components`

还是来自 @antfu，有了这个就不用在导入自定义组件的时候都得手动 import 了

```bash
pnpm add -D unplugin-vue-components
```

同时需要设置到 webpack 编译中：

```js
import ComponentsPlugin from 'unplugin-vue-components/webpack'

const config = {
  // ...
  mini: {
    // ...
    // 合并webpack配置
    webpackChain(chain) {
      chain.plugin('unplugin-vue-components').use(
        ComponentsPlugin({
          dts: 'src/types/components.d.ts',
        }),
      )
    },
  },
}
```

记得将导出的类型文件加到 ignore 里：

```bash
src/types/components.d.ts
```

### 路由

页面路由的写法虽然很奇怪，但小程序是这样的。第一个是文件夹名，第二个是 Vue 文件名，它似乎不能自动检测类似 index 这样的特殊命名。而且到编译后的开发者工具或是 h5 的 URL 也是这样的形式

约定来说，它主要是以文件夹作为页面路由的划分，每个页面下会有一个 `*.config.ts` 的页面配置文件

```ts
pages: ['pages/index/index', 'pages/profile/profile']
```

#### 子路由和跳转

由于小程序是一个 SPA 应用，基本就只能在当前页切换。因此 pages 更像是对应的是主页的 tab page，而 subPages 是要跳转的路由页面，他们通常会放在 packages 文件夹下

```ts
export default defineAppConfig({
  pages: ['pages/index/index', 'pages/profile/profile'],

  subPackages: [
    {
      root: 'packages',
      pages: ['todo/todo'],
    },
  ],
})
```

### 编译配置

根目录下的 `/config` 文件夹是 Taro 的编译配置，文档可见：[编译配置]

基本不变就行了，只不过 eslint 可能会报错 `process` 的问题，就需要手动导入 `const process = require('node:process')`

添加路径别名和导入 @Vant：

```js
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const vantDist = path.resolve(root, 'node_modules/@vant/weapp/dist')

const config = {
  // ...
  alias: {
    '@': path.resolve(root, 'src'),
  },
  copy: {
    patterns: [
      {
        from: vantDist,
        to: 'dist/vant/',
      },
    ],
    options: {},
  },
  mini: {
    hot: true,
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: [/van-/],
        },
      },
      // ...
    },
  },
}
```

其中，`copy.patterns` 是指将 node_modules 里 @vant 的组件 dist 目录复制到编译文件夹中，这是因为[文档][taro-vant]：

> vant 组件中包含一些小程序原生文件的依赖，目前 Taro 没有对这些依赖进行分析

### 引用 Vant 组件

这需要手动在配置文件中导入具名组件 (像是 `<van-button/>`)，可以在全局导入，但有时候会引用冲突 (？) 导致有些组件不能在全局导入的时候共存，就需要在各自的 page 下 using 了

```ts
// app.config.ts
export default defineAppConfig({
  usingComponents: {
    'van-button': '@vant/weapp/button/index',
  }
})
```

这里的地址取决于在编译配置中将组件复制的地址 (相对于编译后的 `/dist/app.json`) 来说，当然可以写一个函数来简化：

```ts
// vant.ts
/**
 * vant weapp component path
 * @param name component name(s)
 * @returns `{ van-name: @vant/weapp/name/index }`
 */
export function useVant(...name: vantComponentsName[]) {
  const obj: Record<string, string> = {}
  name.forEach((item) => {
    obj[`van-${item}`] = `@vant/weapp/${item}/index`
  })
  return obj
}

// app.config.ts
export default defineAppConfig({
  usingComponents: {
    ...useVant('button'),
  },
})
```

这样子在 Vue 中就能直接使用组件，不用手动 import

```vue
<script setup lang="ts">
import { ref } from 'vue'

const msg = ref('Hello world')
</script>

<template>
  <view class="index">
    <van-button type="primary">
      {{ msg }}
    </van-button>
  </view>
</template>
```

只不过这种是属于使用 npm 包的方式，它需要在 `/dist` 下有 node_modules 和 packages.json，并在编译前在开发者工具中点构建 npm 才能使用

所以就多了一步 copy：

```js
const config = {
  copy: {
    patterns: [
      {
        from: path.resolve(root, 'dist.package.json'),
        to: 'dist/package.json',
      },
    ],
  }
}
```

```json
// dist.package.json
{
  "name": "dist",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@vant/weapp": "^1.10.22"
  }
}
```

### 运行

`pnpm dev` 后，就能在微信开发者工具中导入 dist 目录来预览了

### 一定要禁用缓存 & 热重载不了

虽然 cli 会提示强烈建议开启缓存，但实测发现它会导致很多配置方面的问题

首先每次编译的时候，它默认都会将 `/dist` 删除，然后将存在某个地方的缓存与当前编译结果 diff (也许) 后复制过来。但对于微信开发者工具来说，由于项目根目录被清空了，它会直接报错：找不到 app.json 之类的，这时候就要让开发者工具重新编译......(它本来是可以热重载差异化编译的)

回到缓存问题，我发现实际上开了缓存后，修改 app.config.ts 之类的配置文件后，再次 pnpm 编译，`dist/app.*` 的内容实际上还是很早之前的，这时候例如添加页面、组件都并没有应用上，小程序那边就会报错：xx not found 之类问题......

### 使用 `@ngify/http` 请求库

[@ngify/http] 适配了微信小程序特殊的 `wx.request` (也就是在小程序里是没有 XMLRequest 或是 fetch 的，得用它自己的请求库)，并配合 [RxJs](RxJs-ngify-http.md) 风格的处理

首先新建一个 `src/service` 文件夹专门用来处理请求，在 index.ts 中初始化设置为 wx 请求库：

```ts
import { setupConfig } from '@ngify/http'
import { HttpWxBackend } from '@ngify/http/wx'

/**
 * 使用微信小程序的 wx.request 作为请求后端
 */
export function setupServices() {
  setupConfig({
    backend: new HttpWxBackend(),
  })
}
```

然后在 app.ts 导入初始化

```ts
import { setupServices } from './services'

setupServices()
```

这样就可以新建一个请求类了：

```ts
import type { GithubRepo } from '@/types'
import { HttpClient } from '@ngify/http'
import { map } from 'rxjs/operators'

// Github API，仅用于示例，需要在微信开发者工具中，在详情->本地设置中
// 开启 `开发环境不校验请求域名、TLS版本及HTTPS证书` 选项，来跳过对服务器域名的校验
// 否则，需要使用已备案的域名来反代 Github API
const api = 'https://api.github.com'

export class GithubService {
  private http: HttpClient

  constructor() {
    this.http = new HttpClient()
  }

  getRepos(input: string) {
    return this.http
      .get<{ items: GithubRepo[] }>(`${api}/search/repositories?q=${input}`)
      .pipe(map(res => res.items))
  }
}
```

函数将返回 `Observable<T>` 供以后续使用 RxJs 处理

其中要注意的是，由于微信小程序的限制，请求的只能是备案过的域名......

[仓库地址]: https://github.com/Chilfish/taro-learn/
[Vant]: https://vant-contrib.gitee.io/vant/
[Vant-WeApp]: https://vant-contrib.gitee.io/vant-weapp/#/home
[Taro]: https://docs.taro.zone/
[Taro 的项目结构]: https://vant-contrib.gitee.io/vant-weapp/#/home
[Start]: https://github.com/Chilfish/taro-learn/tree/start
[全局配置]: https://docs.taro.zone/docs/app-config
[页面配置]: https://docs.taro.zone/docs/page-config
[编译配置]: https://docs.taro.zone/docs/config
[taro-vant]: https://docs.taro.zone/docs/vant
[@ngify/http]: https://github.com/ngify/ngify/tree/main/packages/http#replace-http-backend-class
