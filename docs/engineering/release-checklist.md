# 发布清单

**项目**: chilfish.top | **最后更新**: 2026-08-09

## 1. 验证门禁

本地全绿后再推送：

```bash
bun run check      # astro check（类型 + content schema）
bun run lint       # ESLint
bun run build      # 生产构建
```

- [ ] `check` 无类型错误、无 schema 校验失败
- [ ] `lint` 无 error（warning 可接受，但无遗留 `any` / `console.log`）
- [ ] `build` 成功，`dist/` 产出正常

### 产物级核验（构建绿灯之外）

构建通过不能证明功能存在（[PM 001](../postmortem/001-silent-failure.md)），需核对产物：

- [ ] `dist/` 中存在预期端点（`/feed` 等），而非只有 sitemap
- [ ] `dist/client/**/*.html` 中无 `Invalid Date`、无 `content="undefined"`
- [ ] 构建日志无遗留调试输出
- [ ] 按需路由至少实测一次（`IS_NODE=TRUE bun run build` + `bun run preview`）

## 2. 功能冒烟

按页面逐项核对（浏览器实测，含移动端宽度）：

- [ ] **首页** `index.astro`：自我介绍、Projects、Socials 渲染
- [ ] **文章详情** `posts/[slug]`：正文渲染、代码高亮、TOC 滚动、相邻文章、评论区（giscus）加载
- [ ] **分类 / 分页** `[type]/[page]`：blog / note 分类切换、分页正确
- [ ] **标签** `tags/[tag]`：标签聚合与分页
- [ ] **归档** `archives.astro`：时间线/归档列表
- [ ] **音乐页** `music.astro`：歌单 / 歌曲数据（`fetchMusic`）正常
- [ ] **Sponsors / 404**：页面渲染正常
- [ ] **重定向**：`redirects.ts` 中已知路径跳转正确
- [ ] **暗色模式**：`DarkToggle` 切换，新增组件明暗均正常
- [ ] **SEO**：`robots.txt`、sitemap 生成正确；文章页 `article:published_time` 为 ISO 时间
- [ ] **订阅** `/feed`：返回 `200` + `application/xml`，条目链接为绝对地址（`https://chilfish.top/posts/<slug>/`）
- [ ] 图片懒加载与预览（`ImagePreview`）正常

## 3. 内容一致性

- [ ] 新增文章的 frontmatter 完整（title + date 必填，无遗留 `draft: true`）
- [ ] 死链检查：文章内链接、图片路径有效
- [ ] 站点元信息（`src/constant/config.ts`）与部署环境一致

## 4. 版本与发布

- [ ] `CHANGELOG.md`：Unreleased 节汇总本里程碑变更
- [ ] 里程碑发布：Unreleased → 版本节，打 Tag + `gh release create`
- [ ] Merge 到 `main` → 确认 Vercel Production 部署成功
- [ ] 部署后访问生产域名复核首页与任一文章页
