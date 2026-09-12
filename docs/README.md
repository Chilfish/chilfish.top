# 项目文档

chilfish.top 的文档体系。所有文档用中文；README（根级）、CHANGELOG、CONTRIBUTING、LICENSE 用英文例外。

## 项目文档索引

### planning/ — 架构与规划

| 文档                                          | 说明                       | 何时阅读         |
| --------------------------------------------- | -------------------------- | ---------------- |
| [architecture.md](./planning/architecture.md) | 系统架构总览 + ADR 记录    | 任何架构级变更前 |
| [backlog.md](./planning/backlog.md)           | 未决任务清单（含前置条件） | 规划下一阶段任务 |

### engineering/ — 工程规范

| 文档                                                       | 说明                                     | 何时阅读         |
| ---------------------------------------------------------- | ---------------------------------------- | ---------------- |
| [git-workflow.md](./engineering/git-workflow.md)           | 分支模型 / Commit 规范 / 验证门禁 / 发布 | 每次 commit / PR |
| [code-style.md](./engineering/code-style.md)               | Astro/Vue/UnoCSS 命名与约定、禁止事项    | 写代码前         |
| [release-checklist.md](./engineering/release-checklist.md) | 发布清单（验证门禁 + 功能冒烟）          | 发布前           |

### postmortem/ — 事后分析

| 文档                                    | 说明                                           |
| --------------------------------------- | ---------------------------------------------- |
| [README.md](./postmortem/README.md)     | 索引 + 高频雷区自查（写码前必读，防复现）      |
| [TEMPLATE.md](./postmortem/TEMPLATE.md) | 新增 postmortem 的模板（frontmatter + 行动项） |

### development-log/ — 开发日志

| 文档                                     | 说明                    |
| ---------------------------------------- | ----------------------- |
| [README.md](./development-log/README.md) | 按天日志索引 + 记录约定 |

## 根级文档

| 文档                                  | 说明                               |
| ------------------------------------- | ---------------------------------- |
| [AGENTS.md](../AGENTS.md)             | AI 编码助手协作指南（意图 → 文件） |
| [CHANGELOG.md](../CHANGELOG.md)       | 变更记录（Keep a Changelog）       |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | 贡献指南                           |
| [README.md](../README.md)             | 项目说明                           |

## 规划中的目录（按需补充）

- `requirements/` — 需求文档（PRD / user-stories），新增大功能时建立
- `reviews/` — 代码审查记录（review-YYYY-MM-DD.md）
- `archive/` — 已完成阶段计划文档的归档（用 `git mv` 移入，不主动读取）
- `ui-design/` — 设计规范（若建立独立设计系统）

## 约定

1. 所有文档用中文（根级 README/CHANGELOG/CONTRIBUTING/LICENSE 除外）
2. 需求/行为变更时同步更新对应文档
3. 关键架构决策记录在 [planning/architecture.md](./planning/architecture.md)（ADR 格式）
4. 所有 PR 更新 CHANGELOG（Unreleased 节）
5. 开发日志按天记录在 [development-log/YYYY-MM-DD.md](./development-log/README.md)
6. 已完成阶段的计划文档用 `git mv` 移到 archive/；存档不主动读取
7. 新 Bug 模式写 postmortem，预防项同步到 AGENTS.md / engineering/git-workflow.md
