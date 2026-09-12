# 系统架构

**项目**: chilfish.top | **最后更新**: 2026-08-09

## 技术栈

| 层            | 技术                                                          |
| ------------- | ------------------------------------------------------------- |
| 框架          | Astro 7（混合渲染：静态优先，按需路由显式声明）               |
| 岛屿          | Vue 3（评论 / TOC / 图片预览）                                |
| 样式          | UnoCSS + SCSS                                                 |
| 内容          | Markdown / MDX 内容集合（blog、note）                         |
| 解析          | remark / rehype 管线（`src/plugins/`）+ astro-expressive-code |
| 部署          | Vercel（`vercel.json`）                                       |
| 包管理 / 工具 | Bun、ESLint（@antfu）、simple-git-hooks                       |

## 架构总览

```
┌─ 构建期（SSG）──────────────────────────────────────────┐
│  src/content/blog|note/*.md                              │
│       │ glob loader + postSchema (zod)                   │
│       ▼                                                  │
│  Astro Content Collections ──→ getCollection()            │
│       │                                                  │
│       ▼                                                  │
│  src/plugins/  markdownParse · rehype-image ·             │
│                 rehype-link                                │
│       │                                                  │
│       ▼                                                  │
│  src/pages/*.astro（index / posts/[slug] / [type]/[page]  │
│                / tags / archives / music / sponsors / 404 │
│                / [...all] 重定向 / robots.txt）            │
│       │                                                  │
│       ▼                                                  │
│  静态 HTML + CSS（UnoCSS 扫描产物）                        │
└──────────────────────────────────────────────────────────┘
        │ 客户端交互
        ▼
┌─ 浏览器 ────────────────────────────┐
│  .astro 静态组件 + .vue island       │
│  (giscus 评论 · TableOfContent ·    │
│   ImagePreview) · DarkToggle        │
└────────────────────────────────────┘
```

## 关键目录

```
src/
├── content.config.ts      # blog/note collection + postSchema（zod）
├── content/
│   ├── blog/              # 博客（含 dev-log/、diary/、tips/）
│   └── note/              # 笔记
├── pages/                 # 路由（静态生成，[type]/[...page] 分页）
├── layouts/               # Layout / BlogListLayout / PostDetails
├── components/            # common/、post/、music/
├── plugins/               # Markdown 解析/增强管线
├── utils/                 # post / date / fetchMusic / useDark
├── constant/              # config / redirects / techs / hostIcons / zodTypes
├── types/                 # 类型 + auto-imports 声明
└── assets/                # *.scss 样式
```

## 内容系统

- `blog` 与 `note` 两个 collection，共用 `postSchema`（`src/content.config.ts`）
- frontmatter 字段见 [AGENTS.md](../../AGENTS.md)「内容 frontmatter」
- `draft: true` 的文章不进入生成结果
- 分类、分页、标签、归档均由 `src/utils/post.ts` 等工具函数从集合派生

## 渲染管线

- Markdown 增强集中在 `src/plugins/`：
  - `markdownParse.ts` — Markdown 解析
  - `rehype-image.ts` / `rehype-link.ts` — 图片/链接增强
- 代码高亮由 `astro-expressive-code` 处理（`astro.config.mjs`）

## 页面路由

| 路由                    | 文件                                          | 说明                                  |
| ----------------------- | --------------------------------------------- | ------------------------------------- |
| `/`                     | `pages/index.astro`                           | 首页（自我介绍 / Projects / Socials） |
| `/posts/[slug]`         | `pages/posts/[slug].astro`                    | 文章详情（TOC / 评论 / 相邻）         |
| `/[type]/[...page]`     | `pages/[type]/[...page].astro`                | 分类 + 分页（blog/note 等）           |
| `/tags[/tag]/[...page]` | `pages/tags/**`                               | 标签聚合 + 分页                       |
| `/archives`             | `pages/archives.astro`                        | 归档                                  |
| `/music`                | `pages/music.astro`                           | 音乐（`fetchMusic`）                  |
| `/sponsors`             | `pages/sponsors.astro`                        | 赞助                                  |
| `/feed`                 | `pages/feed.ts`                               | RSS 订阅（最近 15 篇博客）            |
| `/robots.txt`           | `pages/robots.txt.ts`                         | 爬虫规则 + sitemap 指引               |
| `404`                   | `pages/404.astro`                             | 404                                   |
| 重定向                  | `pages/[...all].ts` + `constant/redirects.ts` | 旧链接跳转                            |

## 渲染模式（混合）

`astro.config.mjs` 使用 `output: 'server'` + `@astrojs/vercel`（本地 `IS_NODE=TRUE` 时切 `@astrojs/node`），因此**默认按需渲染**，需要静态化的路由必须显式声明 `export const prerender = true`：

| 模式        | 路由                                                                  | 说明                                                        |
| ----------- | --------------------------------------------------------------------- | ----------------------------------------------------------- |
| 预渲染      | `posts/[slug]`、`[type]/[...page]`、`tags/[tag]/[...page]`            | 内容页，构建期生成静态 HTML                                 |
| 按需（SSR） | `index`、`archives`、`music`、`sponsors`、`404`、`robots.txt`、`feed` | 每次请求渲染；`/music`、`/feed` 在 `vercel.json` 配置缓存头 |

> 新增纯内容页面时优先加 `prerender = true`；只有需要请求期数据（如 `fetchMusic`）或按需生成时才保持默认。

## ADR 记录

架构决策以 ADR 形式追加到本文档末尾。格式：

```markdown
## ADR-XXX：<决策标题>

- **状态**：已接受 / 提议 / 弃用
- **日期**：YYYY-MM-DD
- **背景**：为什么需要决策
- **决策**：选了什么
- **后果**：影响与代价
- **备选**：考虑过的其他方案（及否决理由）
```

### 既有决策（代码可观测，补录为 ADR）

## ADR-001：纯静态生成（SSG），无客户端路由

- **状态**：已修订（渲染方式见 [ADR-006](#adr-006混合渲染静态优先按需路由显式声明)）
- **背景**：个人网站以内容展示为主，无复杂状态/登录
- **决策**：Astro SSG，所有页面构建期生成静态 HTML；不引入 vue-router 等客户端路由，导航用 `<a>`
- **后果**：部署简单、加载快、SEO 友好；交互只能以 island 形式嵌入

## ADR-002：交互组件用 Vue island，静态组件用 .astro

- **背景**：少量交互（giscus 评论、TOC 滚动、图片预览）需要客户端 JS
- **决策**：交互逻辑收敛在 `.vue` SFC，静态展示用 `.astro`（Astro 自动剔除 JS）
- **后果**：交互与展示边界清晰，但需避免 `.astro` 中塞交互逻辑（见 code-style 禁止事项）

## ADR-003：内容 schema 统一（blog / note 共用 postSchema）

- **背景**：博客与笔记都是 Markdown 文章，字段高度重合
- **决策**：`blog` / `note` 共用 `postSchema`（title/date 必填，draft/tags 等默认值）
- **后果**：新增字段一处修改两集合生效；类型由 `z.infer` 导出，页面消费类型安全

## ADR-004：样式用 UnoCSS 工具类 + SCSS 分层

- **背景**：需要原子类快速布局 + 全局/复杂样式
- **决策**：布局/原子样式用 UnoCSS；全局与页面级样式用 `src/assets/*.scss`；颜色复用变量，禁硬编码
- **后果**：样式统一收敛，构建期由 UnoCSS 扫描生成最终 CSS

## ADR-005：内容管线插件化（src/plugins/）

- **背景**：Markdown 增强逻辑（图片/链接）需要可复用、可测试
- **决策**：解析/增强逻辑集中在 `src/plugins/`，页面组件不散落一次性解析代码
- **后果**：增强规则单一来源；新增转换先插件化再接入

## ADR-006：混合渲染（静态优先，按需路由显式声明）

- **状态**：已接受
- **日期**：2026-09-12
- **背景**：站点以内容为主（适合预渲染），但 `/music` 依赖请求期外部数据（`fetchMusic`），`/feed`、`robots.txt` 也需要按需生成；ADR-001 的「全部构建期生成」已与实际配置不符
- **决策**：保留 `output: 'server'` + 平台适配器；内容路由显式 `export const prerender = true`，其余保持按需渲染
- **后果**：内容页零函数调用、加载快；按需路由可在 `vercel.json` 配缓存头缓解成本。代价是「静态」不再是默认，新增页面需明确选择渲染模式
- **备选**：全站 `output: 'static'` —— 否决，会失去 `/music` 的请求期数据与 `/feed` 的按需生成

## ADR-007：RSS 作为路由文件而非工具函数

- **状态**：已接受
- **日期**：2026-09-12
- **背景**：原实现是 `src/utils/feed.ts` 中的处理器，未导出也无路由，长期静默失效
- **决策**：处理器直接落在 `src/pages/feed.ts` 并 `export const GET`；不在 `src/utils/` 中保留端点
- **后果**：路由自包含、可被构建器识别；避免 `unplugin-auto-import` 把工具目录中的导出（如 `GET`）注册为全局变量。URL 为 `/feed`，与 `vercel.json` 缓存头一致
- **备选**：`src/pages/rss.xml.ts` —— 否决，URL 与既有订阅地址 `/feed` 不一致
