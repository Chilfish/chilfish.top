# Git 开发流程

**项目**: chilfish.top | **最后更新**: 2026-08-09

> 本文档对齐 chill-s3 项目（Float 规范）的 Git Workflow，适配 chilfish.top（Astro + Vue + UnoCSS + Bun）技术栈。

## 分支模型

采用 **Trunk-Based Development**（简化版）：

```
main ─────●─────●─────●─────●──→ (始终可部署)
           \     /
feat/xxx ──●───●
```

| 分支类型     | 命名格式                      | 用途                 | 生命周期   |
| ------------ | ----------------------------- | -------------------- | ---------- |
| `main`       | —                             | 稳定分支，始终可部署 | 永久       |
| `feat/*`     | `feat/add-algo-note`          | 功能开发             | 合并后删除 |
| `fix/*`      | `fix/dark-mode-contrast`      | Bug 修复             | 合并后删除 |
| `refactor/*` | `refactor/extract-date-utils` | 重构                 | 合并后删除 |
| `docs/*`     | `docs/adopt-float-structure`  | 文档更新             | 合并后删除 |
| `content/*`  | `content/add-rustify-post`    | 内容（文章/笔记）    | 合并后删除 |

## Commit 规范

遵循 [Conventional Commits 1.0.0](https://www.conventionalcommits.org/)。

### 格式

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Type

| Type       | 说明                  | 示例                                        |
| ---------- | --------------------- | ------------------------------------------- |
| `feat`     | 新功能 / 新页面       | `feat(blog): add xx post`                   |
| `fix`      | Bug 修复              | `fix(theme): fix dark mode contrast`        |
| `refactor` | 重构（不改变行为）    | `refactor(utils): extract date helpers`     |
| `content`  | 内容更新（文章/笔记） | `content(note): add event-emitter note`     |
| `docs`     | 文档                  | `docs: adopt Float documentation structure` |
| `style`    | 格式化                | `style: apply eslint --fix`                 |
| `chore`    | 构建/工具/依赖        | `chore(build): add eslint-plugin-astro`     |
| `perf`     | 性能优化              | `perf(assets): trim unused scss`            |

### Scope

`scope` 使用模块名或功能名：

`blog`、`note`、`theme`、`layout`、`page`、`utils`、`plugins`、`music`、`build`、`docs`、`content`

### 规则

- **Description 用英文祈使句**（命令式）：`add`、`fix`、`remove`（不用 `added`、`fixed`）
- 首字母小写，不加句号，不超过 72 字符
- **Breaking change**：footer 中标记 `BREAKING CHANGE: description`

### Commit 纪律

> **先想 commit message，再动工写代码。** 避免"上帝 commit"（一个超大 commit 包含所有变更）。

1. **写代码前**，先用 Conventional Commit 格式确定 commit message（如 `feat(blog): add xx post`）
2. **围绕这个 message 的范围编写代码**，超出范围的工作留给下一个 commit
3. **当 diff 变大时（>10 文件或 >200 行），主动拆分**为多个独立 commit
4. 每个 commit 应能独立通过验证（`check` + `lint` + `build`）
5. 模块创建、功能实现、配置修改、文档更新应分开 commit

典型拆分示例：

```bash
# Commit 1: 构建配置
git commit -m "chore(build): add eslint-plugin-astro"

# Commit 2: 功能实现
git commit -m "feat(post): add TableOfContent component"

# Commit 3: 文档
git commit -m "docs: update code-style for vue islands"
```

## 验证门禁

每个 commit / PR 合并前必须通过：

```bash
bun run check      # astro check（类型 + content schema）
bun run lint       # ESLint（@antfu/eslint-config + eslint-plugin-astro）
bun run build      # 生产构建（astro build）
```

- `simple-git-hooks` 在 `prepare` 自动安装，pre-commit 钩子已配置（lint-staged + eslint --fix）
- **禁止 `--no-verify` 跳过钩子**；钩子失败必须修复根因
- 测试门禁：当前项目尚无测试脚本；补充 Vitest 后，pre-push 门禁加入 `bun run test`

## 代码审查

### PR 流程

1. 创建 PR → 跑通验证门禁
2. 至少 1 人 Approve；AI 辅助先进行自动化 Code Review
3. 所有检查通过后 Merge（Create a Merge Commit，保留原子 commit）
4. Merge 后删除 feature 分支

### 审查清单

- [ ] 代码逻辑正确，覆盖边界情况
- [ ] 遵循 [code-style.md](./code-style.md)
- [ ] 无硬编码色值、无 `any`、无 TODO 遗留
- [ ] 交互逻辑放在 `.vue` island，而非 `.astro` 静态组件
- [ ] 站点配置集中在 `src/constant/`，无页面内联重复
- [ ] 内容文章 frontmatter 完整（title + date 必填）
- [ ] Dark mode 兼容
- [ ] UI 变更附带截图（浏览器实测）
- [ ] 相关文档已更新；新 Bug 模式写 postmortem

### Merge 策略

- **Create a Merge Commit** — 保留 PR 内每个原子 commit + `Merge pull request #N` 合并提交
- 若 PR 内含大量 WIP / 格式修正，先本地 `git rebase -i` 整理为原子 commit 再合并

## 发布流程

chilfish.top 部署到 Vercel（`vercel.json` 已配置）：

### 常规部署

- `main` 分支推送自动触发 Vercel 部署（Previews + Production）

### 里程碑发布（按需）

1. 从 `main` 创建 `release/x.y.z` 分支（或直接 main）
2. 更新 `CHANGELOG.md`（Unreleased → 版本节）
3. 更新 `docs/README.md` 索引
4. Merge 到 `main` → Vercel Production 部署
5. 打 Tag：`git tag v0.1.0 && git push --tags`
6. GitHub Release：`gh release create v0.1.0 --generate-notes`

## AI 协作开发

- 优先使用 `gh` CLI 进行 GitHub 全流程管理
- 新功能先写 spike 验证跨系统边界假设（PM 004 教训，见 [postmortem](../postmortem/README.md)）
- 新库 API 行为先写 5 行 spike 验证（PM 007 教训）
