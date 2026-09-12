# 代码规范

**项目**: chilfish.top | **最后更新**: 2026-08-09

## TypeScript / Astro / Vue 风格

### 命名约定

| 类型               | 风格                         | 示例                                         |
| ------------------ | ---------------------------- | -------------------------------------------- |
| Astro / Vue 组件   | PascalCase                   | `Header`、`BlogList`、`TableOfContent`       |
| 组件文件           | PascalCase（本项目既有约定） | `header.astro` ❌ / `Header.astro` ✅        |
| 页面路由文件       | 小写（Astro 路由约定）       | `index.astro`、`[slug].astro`、`[...all].ts` |
| 组合式函数 / hooks | `use` + camelCase            | `useDark`、`useFetchMusic`                   |
| 函数 / 方法        | camelCase                    | `formatDate()`、`getAdjacentPosts()`         |
| 常量               | UPPER_SNAKE_CASE             | `SITE`、`SOCIAL_LINKS`                       |
| 变量 / 参数        | camelCase                    | `postMeta`、`tagName`                        |
| 类型 / 接口        | PascalCase                   | `PostSchema`、`Project`                      |
| 内容集合           | 小写                         | `blog`、`note`                               |

### 文件组织

```ts
// 1. import：外部依赖 → 路径别名（@/）→ 相对路径
import { defineCollection } from 'astro:content'
import { z } from 'astro:content'
import { SITE } from '@/constant/config'

// 2. 类型 / 常量
// 3. 组件 / 函数定义
// 4. private helpers（放文件底部）
```

### Astro 约定

- 每个 `.astro` 组件用 `interface Props` 显式声明接收的 props
- **静态展示组件用 `.astro`**，不引入客户端 JS 除非必要；需要交互再拆 `.vue` island
- `Astro.glob` / `getCollection` 在页面顶部集中取数，不要在模板内散落
- 组件样式用 `<style>` 包裹；避免全局选择器污染
- Dark mode 是必需能力，所有组件必须兼容明暗

### Vue 约定（island）

- 交互组件（评论、TOC、图片预览）用 Vue SFC，逻辑收敛在组件内
- Props 用 `defineProps<T>()` 显式类型；事件用 `defineEmits` + `onXxx` 命名
- 客户端副作用（`window` / `document`）放 `onMounted`，禁止在 setup 同步读取
- 避免 `any`（含隐式）；数据不可确定时用 `unknown` + 收窄
- 组件间共享状态用 `useState` / `provide`+`inject`，跨组件大状态才引入 store

### 禁止事项

| 禁止                                 | 替代方案                    |
| ------------------------------------ | --------------------------- |
| `any`（含隐式）                      | 明确类型 / `unknown` + 收窄 |
| 硬编码色值 / 内联样式                | SCSS 变量 / UnoCSS 工具类   |
| `.astro` 中塞交互逻辑                | 拆成 `.vue` island          |
| 渲染期读取 `window` / `document`     | `onMounted` / 客户端脚本    |
| 各页面内联重复站点配置               | 集中到 `src/constant/`      |
| wildcard import                      | 显式 import                 |
| `console.log` 遗留                   | 移除或用 lint 拦截          |
| 注释掉的弃用代码                     | 直接删除（git 历史可追溯）  |
| 绕过 `src/plugins/` 写一次性解析逻辑 | 插件化到 `src/plugins/`     |
| 引入 vue-router 做客户端路由         | 静态 `<a>` 导航             |

## UnoCSS / SCSS 约定

- **优先 UnoCSS 工具类**；通用原子类（布局、间距、显示）用 `uno.config.ts` 已注册的预设
- 全局样式收敛在 `src/assets/main.scss`，页面级样式就近放对应 `*.scss`
- 颜色复用 SCSS 变量 / UnoCSS 主题色板，禁止硬编码 hex
- 交互过渡动画 150-300ms
- 移动端优先，再用 `sm:` / `md:` / `lg:` 增强

## 内容约定

- 博客 / 笔记 frontmatter 遵循 [AGENTS.md](../../AGENTS.md) 中的 `postSchema`（title + date 必填）
- Markdown 语法高亮 / 增强统一由 `astro-expressive-code` 处理，不手动内联 `<pre>` 样式
- 图片增强走 `src/plugins/rehype-image.ts`，不在文章中写死宽高/样式

## 测试规范

当前项目尚未引入测试框架，对标 Float「测试先行」方向预留：

### 命名

`methodName_condition_expectedResult()`

```ts
describe('formatDate', () => {
  it('isoInput_returnsZhCnDate', () => { /* ... */ })
})
```

### 规则（引入 Vitest 后）

- **纯函数优先**：`src/utils/`、`src/plugins/` 的纯函数全部可独立测试，零 mock 成本
- **Fakes over Mocks**：避免 mock 语义漂移
- 测试文件与源码同目录：`*.test.ts` / `*.spec.ts`

## Lint / 类型检查

```bash
bun run lint          # ESLint（@antfu/eslint-config + eslint-plugin-astro + eslint-plugin-format）
bun run check         # astro check（类型 + content schema）
bun run build         # 生产构建
```

- 禁止 `--no-verify` 跳过 simple-git-hooks 钩子
- 无 `TODO()` 遗留（用 `FIXME` + 建 Issue）
