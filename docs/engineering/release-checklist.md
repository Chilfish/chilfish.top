# 发布清单

**项目**: chilfish.top | **最后更新**: 2026-08-09

> 对齐 chill-s3（Float 规范）的 Release Checklist，适配 Astro + Vercel。发布于合并到 `main` 触发 Vercel 生产部署前执行。

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

## 2. 功能冒烟

按页面逐项核对（浏览器实测，含移动端宽度）：

- [ ] **首页** `index.astro`：最新博客列表、Sponsor/Socials 渲染
- [ ] **文章详情** `posts/[slug]`：正文渲染、代码高亮、TOC 滚动、相邻文章、评论区（giscus）加载
- [ ] **分类 / 分页** `[type]/[page]`：blog / note 分类切换、分页正确
- [ ] **标签** `tags/[tag]`：标签聚合与分页
- [ ] **归档** `archives.astro`：时间线/归档列表
- [ ] **音乐页** `music.astro`：歌单 / 歌曲数据（`fetchMusic`）正常
- [ ] **Sponsors / 404**：页面渲染正常
- [ ] **重定向**：`redirects.ts` 中已知路径跳转正确
- [ ] **暗色模式**：`DarkToggle` 切换，新增组件明暗均正常
- [ ] **SEO / 订阅**：`robots.txt`、sitemap、RSS feed 生成正确
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
