# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Adopt Float documentation structure (`docs/`) and AI collaboration guide (`AGENTS.md`)
- RSS 订阅端点 `/feed`（`src/pages/feed.ts`），输出最近 15 篇博客
- 首条正式事后分析 `docs/postmortem/001-silent-failure.md`

### Fixed

- SEO：文章页 `article:published_time` / `article:modified_time` 改为 ISO 时间；无 `date` 的列表、标签、归档页不再输出 `article:*`（原为 `Invalid Date`）
- RSS：文章链接由 `/blog/<slug>/` 修正为 `/posts/<slug>/`；`excludes` tag 过滤改为排除命中任一 tag 的文章
- 移除 `src/pages/[type]/[...page].astro` 中遗留的调试 `Astro.redirect()` 与 `console.log`（在预渲染下被静默忽略）
- 修复 `rehype-image.ts` 残留引用已移除的 `localImgHost` 导致的构建失败（`MISSING_EXPORT`）

### Removed

- `src/plugins/read-time.ts`、`src/utils/post.ts` 的 `getWords()`，以及 `PostMeta.astro` / `archives.astro` 中的注释代码块（阅读时长与字数统计从未启用）
- 全仓零引用的 `src/components/post/LatestBlogs.astro`
- 空壳端点 `src/pages/api/endpoint.ts`
- `src/utils/feed.ts`（内容迁移为路由 `src/pages/feed.ts`，避免工具目录被自动导入为全局 `GET`）
- `src/constant/config.ts` 的 `isDev` / `localImgHost` 及 `rehype-image.ts` 的本地图片源替换分支（图床固定为远程地址）
- `src/constant/index.ts` 末尾的调试 `console.log(total)`
