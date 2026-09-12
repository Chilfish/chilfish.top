# chilfish.top — AI Agent 协作指南

> 本文档为 AI 编码助手提供 chilfish.top 项目的快速导航。人类贡献者请先阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 意图 → 文件映射

| 任务意图                   | 关键文件                                                                               | 操作类型                    |
| -------------------------- | -------------------------------------------------------------------------------------- | --------------------------- |
| 添加博客文章               | `src/content/blog/**/*.md`（含 `dev-log/`、`diary/`、`tips/`）                         | 写 Markdown + frontmatter   |
| 添加笔记                   | `src/content/note/**/*.md`                                                             | 写 Markdown + frontmatter   |
| 修改内容 schema            | `src/content.config.ts` + `src/constant/zodTypes.ts`                                   | 改 z 定义（blog/note 共用） |
| 添加页面                   | `src/pages/*.astro`；分类/分页见 `[type]/[...page].astro`；文章见 `posts/[slug].astro` | 新建/改 Astro 页面          |
| 添加重定向                 | `src/constant/redirects.ts` + `src/pages/[...all].ts`                                  | 改重定向映射                |
| 修改全局布局               | `src/layouts/Layout.astro` + `src/components/common/Header.astro` / `Footer.astro`     | 改布局/组件                 |
| 修改文章详情/列表          | `src/layouts/PostDetails.astro` + `src/components/post/`                               | 改布局/组件                 |
| 修改交互组件（Vue island） | `src/components/**/*.vue`（Comments / TableOfContent / ImagePreview）                  | 改 Vue 组件                 |
| 修改样式/主题              | `src/assets/*.scss` + `uno.config.ts`                                                  | CSS / UnoCSS 规则           |
| 修改内容解析管线           | `src/plugins/`（markdownParse、rehype-image、rehype-link）                             | 改插件                      |
| 修改订阅端点               | `src/pages/feed.ts`（`@astrojs/rss` + `markdownCompiler`）                             | 改路由                      |
| 修改渲染模式               | 页面 `export const prerender` + `astro.config.mjs`                                     | 静态 / 按需渲染             |
| 修改工具函数               | `src/utils/`（post、date、fetchMusic、useDark）                                        | 改工具                      |
| 修改站点元信息/SEO         | `src/constant/config.ts` + `src/components/common/Head.astro`                          | 改配置/组件                 |
| 修改音乐页面               | `src/components/music/` + `src/utils/fetchMusic.ts`                                    | 改组件/工具                 |
| 修改 Astro 配置            | `astro.config.mjs`                                                                     | 改配置                      |

## 文档索引

| 文档     | 路径                                    | 何时阅读         |
| -------- | --------------------------------------- | ---------------- |
| 系统架构 | `docs/planning/architecture.md`         | 任何架构级变更前 |
| 任务清单 | `docs/planning/backlog.md`              | 规划阶段任务     |
| Git 流程 | `docs/engineering/git-workflow.md`      | 每次 commit / PR |
| 代码规范 | `docs/engineering/code-style.md`        | 写代码前         |
| 发布清单 | `docs/engineering/release-checklist.md` | 发布前           |
| 事后分析 | `docs/postmortem/README.md`             | 防止重复犯错     |
| 开发日志 | `docs/development-log/README.md`        | 了解历史决策     |
| 文档索引 | `docs/README.md`                        | 文档总览 + 约定  |

## 核心约定

### 内容 frontmatter（blog / note 共用，见 `src/content.config.ts`）

```ts
title: string          // 必填
date: Date             // 必填（z.date()，YAML 需写日期）
cover?: string
tags: string[]         // 默认 ['blog']
keywords: string       // 默认 'Blog'
author: string         // 默认 'Chilfish'
description: string    // 默认 ''
draft?: boolean        // 默认 false，true 时不发布
modifiedDate?: Date    // 修订日期，可选
maxDepthTOC?: number   // TOC 最大深度，可选
```

- 新增文章必须提供 `title` + `date`
- 未完成的文章用 `draft: true`，合入前去掉
- 修改历史文章时若内容有实质变更，更新 `modifiedDate`

### 静态站导航

chilfish.top 是 Astro 静态优先站（混合渲染，`output: 'server'` + 显式 `prerender`），**非 SPA**，页面间导航直接用 `<a href>`。Vue 组件是 island，**不引入 vue-router 做客户端路由**。

### 渲染模式

- 内容路由（`posts/[slug]`、分类 / 标签分页）必须 `export const prerender = true`
- 需要请求期数据（`/music`）或按需生成的（`/feed`、`robots.txt`）保持默认按需渲染
- 详见 [architecture.md](./docs/planning/architecture.md) ADR-006

### 样式

- 优先 UnoCSS 工具类与 `src/assets/*.scss` 中已有的变量，**禁止硬编码色值**
- Dark mode 是必需能力，新增组件须同时兼容明暗（参考 `src/utils/useDark.ts` 与 `DarkToggle`）
- 全局样式收敛在 `src/assets/main.scss`，页面级样式就近放对应 `*.scss`

### 组件边界

- **静态展示** → `.astro` 组件（SFC、Astro islands 自动剔除 JS）
- **需要客户端交互**（评论、TOC 滚动、图片预览）→ `.vue` 组件，逻辑收敛在 Vue SFC 内
- 通用小组件放 `src/components/common/`，按功能域分目录（`post/`、`music/`）

### 内容管线

- Markdown 解析/增强走 `src/plugins/`（markdownParse、rehype-image、rehype-link），新增转换逻辑优先放这里而非散落在页面组件
- 站点元信息与重定向集中在 `src/constant/`，不要在各页面内联重复配置

## 架构速览

```
浏览器（无客户端路由）
  └─ .astro 静态组件 + .vue islands（评论 / TOC / 图片预览）
       │
       ├─ 构建期：Astro 内容集合
       │    glob: src/content/blog|note/**/*.md
       │    schema: postSchema (zod)
       │
       └─ 页面: src/pages/
            预渲染：posts/[slug]、[type]/[...page]、tags/[tag]/[...page]
            按需：  index、archives、music、sponsors、404、robots.txt、feed
            [...all].ts → redirects.ts（旧链接跳转）
```

### 关键文件层次

```
src/
├── content.config.ts      # blog/note collection + postSchema
├── content/
│   ├── blog/              # 博客文章（dev-log/、diary/、tips/）
│   └── note/              # 笔记
├── pages/                 # 路由（混合渲染，见「渲染模式」）
├── layouts/               # Layout / BlogListLayout / PostDetails
├── components/            # common/、post/、music/（.astro + .vue）
├── plugins/               # markdownParse / rehype-image / rehype-link
├── utils/                 # post / date / fetchMusic / useDark
├── constant/              # config / redirects / techs / hostIcons / zodTypes
├── types/                 # 类型 + auto-imports 声明
└── assets/                # *.scss 样式
```

## 开发工作流

1. **理解现状**：阅读对应文档 → 阅读相关源码
2. **参考事后分析**：`docs/postmortem/README.md` 防止复现已知问题
3. **修改代码**：遵循上述约定与 [code-style.md](./docs/engineering/code-style.md)
4. **验证**：
   ```bash
   bun run check    # astro check（类型 + 内容 schema）
   bun run lint     # ESLint（@antfu + astro）
   bun run build    # 生产构建
   ```
   - 构建绿灯不等于功能存在：端点 / 路由改动须**实际请求一次**（见 [postmortem/001](./docs/postmortem/001-silent-failure.md)）
   - 产物级检查：`dist/` 有预期端点、HTML 无 `Invalid Date`、日志无调试输出
5. **Commit**：遵循 Conventional Commits（见 [git-workflow.md](./docs/engineering/git-workflow.md)）
   ```
   feat(blog): add xxx post
   fix(theme): fix dark mode contrast
   refactor(utils): extract date helpers
   ```

## 常见反模式（禁止）

| 反模式                                           | 正确做法                           | 说明     |
| ------------------------------------------------ | ---------------------------------- | -------- |
| 硬编码色值 / 内联样式                            | 复用 SCSS 变量 / UnoCSS 工具类     | 样式收敛 |
| `.astro` 里塞交互逻辑                            | 拆成 `.vue` island                 | 组件边界 |
| 各页面内联重复站点配置                           | 集中到 `src/constant/`             | 单一来源 |
| 绕过 `src/plugins/` 写一次性解析逻辑             | 插件化到 `src/plugins/`            | 内容管线 |
| 引入 vue-router 做客户端路由                     | 静态 `<a>` 导航                    | 静态站   |
| `draft: true` 未去除就合并                       | 发布前去掉 draft                   | 内容发布 |
| `--no-verify` 跳过 git hooks                     | 修复 lint 问题后正常提交           | 门禁     |
| 弃用功能以注释形式留存                           | 直接删除（git 历史可追溯）         | 死代码   |
| 调试 `Astro.redirect()` / `console.log` 留在路由 | 用完即删；重定向只走 `[...all].ts` | 静默失效 |
| 端点未 `export`（如 `const _GET`）               | `export const GET` 并实测请求      | 静默失效 |
