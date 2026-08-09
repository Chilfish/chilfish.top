# 贡献指南

欢迎为 chilfish.top 贡献代码。本文档包含开发环境搭建、代码规范、提交流程和质量标准。

## 前置条件

- **[Bun](https://bun.sh/)**（推荐）或 Node.js 22+
- 一个 Vercel 账号（用于部署）

## 快速开始

```bash
# 克隆仓库
git clone <repo-url>
cd chilfish.top

# 安装依赖
bun install

# 启动开发服务器
bun dev

# 生产构建
bun run build

# 类型 + 内容 schema 检查
bun run check

# Lint
bun run lint
```

## 项目结构

```
chilfish.top/
├── src/
│   ├── content/            # 内容集合（blog/、note/，Markdown）
│   ├── pages/              # 页面路由（Astro 静态生成）
│   ├── layouts/            # 布局（Layout / PostDetails / BlogListLayout）
│   ├── components/         # common/、post/、music/（.astro + .vue island）
│   ├── plugins/            # Markdown 解析/增强管线
│   ├── utils/              # 工具函数（post / date / feed / fetchMusic / useDark）
│   ├── constant/           # 站点配置 / 重定向 / 技术栈
│   ├── types/              # 类型 + auto-imports 声明
│   └── assets/             # *.scss 样式
├── docs/                   # 项目文档（Float 结构）
│   ├── planning/           #   架构 / 任务清单
│   ├── engineering/        #   工程规范
│   ├── postmortem/         #   事后分析
│   └── development-log/    #   按天开发日志
└── package.json
```

## Commit 规范

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/) 规范：

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**类型**（type）：

- `feat` — 新功能 / 新页面
- `fix` — Bug 修复
- `docs` — 文档变更
- `refactor` — 重构（无功能变化）
- `perf` — 性能优化
- `test` — 测试
- `chore` — 构建/工具配置
- `style` — 格式/样式
- `content` — 内容更新（文章 / 笔记）

**范围**（scope）：`blog`、`note`、`theme`、`layout`、`page`、`utils`、`plugins`、`music`、`build` 等

**示例**：

```
feat(blog): add remarkjs-diy-md post
fix(theme): fix dark mode contrast
content(note): add event-emitter note
docs: adopt Float documentation structure
```

## 代码风格

详细规范见 [docs/engineering/code-style.md](./docs/engineering/code-style.md)。

### TypeScript

- **Strict mode 开启**：`tsconfig.json` 中 `strict: true`
- 所有函数参数和返回值必须有类型注解
- 避免 `any`；必要时用 `unknown` + 类型守卫

### Astro / Vue

- **静态展示组件用 `.astro`**；交互组件（评论 / TOC / 图片预览）用 `.vue` island
- Astro 组件用 `interface Props` 显式声明 props
- Vue 组件用 `defineProps<T>()` / `defineEmits`，`window`/`document` 访问放 `onMounted`
- 组件文件 PascalCase（本项目既有约定）

### ESLint

项目使用 `@antfu/eslint-config` + `eslint-plugin-astro`，运行：

```bash
bun run lint
```

## 样式规则

- **优先 UnoCSS 工具类**；全局/页面样式用 `src/assets/*.scss`
- **禁止硬编码颜色**：复用 SCSS 变量 / UnoCSS 主题色板
- **Dark Mode 一等公民**：所有组件必须兼容浅色/深色主题
- **移动端优先**：用 `sm:`/`md:`/`lg:` 增强

## 内容约定

- 博客 / 笔记 frontmatter 遵循 `src/content.config.ts` 的 `postSchema`：`title` + `date` 必填，`draft: true` 不发布
- Markdown 增强走 `src/plugins/`，不在文章内散落一次性逻辑

## PR 流程

### PR 前自查

- [ ] 类型检查通过：`bun run check`
- [ ] Lint 通过：`bun run lint`
- [ ] 构建成功：`bun run build`
- [ ] 无硬编码色值
- [ ] Dark Mode 兼容
- [ ] 交互逻辑在 `.vue` island，而非 `.astro`
- [ ] 站点配置集中在 `src/constant/`，无页面内联重复
- [ ] 内容文章 frontmatter 完整
- [ ] UI 变更附带截图（浏览器实测）

### Commit 信息

- 遵循 Conventional Commits
- 英文描述（`feat(blog): ...`）
- 关联 Issue 时在 body/footer 中引用

## 测试指南

当前项目尚未引入测试框架（Vitest 接入见 `docs/planning/backlog.md` A2）。引入后 `src/utils/`、`src/plugins/` 的纯函数优先补测试。

## 文档

- 新功能需更新 `docs/engineering/` 或 `docs/planning/` 下对应文档（索引见 [docs/README.md](./docs/README.md)）
- 重大架构变更需更新 `docs/planning/architecture.md`（ADR 格式）
- 新的 Bug 模式需创建 Postmortem 报告（参考 [docs/postmortem/TEMPLATE.md](./docs/postmortem/TEMPLATE.md)）
- 开发记录写入 `docs/development-log/YYYY-MM-DD.md`

## 相关资源

- [Astro 文档](https://docs.astro.build/)
- [Vue 3 文档](https://vuejs.org/)
- [UnoCSS 文档](https://unocss.dev/)
- [astro-expressive-code](https://expressive-code.com/)
