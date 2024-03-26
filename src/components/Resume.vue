<!-- eslint-disable antfu/top-level-function -->
<script setup lang="tsx">
import type { SetupContext } from 'vue'

const {
  DEV: isDev,
  RESUME_INFO: resumeInfo = 'Chilfish;131xxxxxx94;xx学院;',
} = import.meta.env

const avatar = isDev
  ? 'http://localhost:5173/private/证件.png'
  : 'https://p.chilfish.top/wechat.webp'

const info = resumeInfo.split(';')

const MyInfo = () => (
  <div class="center-col items-start gap-4">
    <h1 class="font-bold">
      <span class="mr-3 text-6">
        {info[0]}
      </span>
      <span class="text-4">
        Web 前端开发工程师
      </span>
    </h1>

    <div
      class="resume-info gap-2 text-gray-6"
      uno-grid="~ cols-1 sm:cols-2"
    >
      <div>
        <i class="i-tabler:user" />
        <span>男 | 21岁</span>
      </div>

      <div>
        <i class="i-tabler-phone" />
        <span>{info[1]}</span>
      </div>

      <div>
        <i class="i-tabler:mail" />
        <a
          href="mailto:chill4fish@gmail.com"
        >
          chill4fish@gmail.com
        </a>
      </div>

      <div>
        <i class="i-tabler:brand-github" />
        <a
          href="https://github.com/Chilfish"
          target="_blank"
        >
          https://github.com/Chilfish
        </a>
      </div>
    </div>
  </div>
)

interface TProjectTitle {
  title: string
  url: string
  stars: number
  date: string
}

const ProjectTitle = (props: TProjectTitle, context: SetupContext) => (
  <>
    <div class="project-title">
      <div class="flex flex-wrap items-center justify-start">
        <a href={props.url} target="_blank">
          {props.title}
        </a>
        <span
          class="ml icon-box inline-flex gap-1px"
        >
          <i class="i-tabler:star" />
          <span>
            {`${props.stars} Stars`}
          </span>
        </span>
      </div>
      <time>{props.date}</time>
    </div>
    {context.slots.default?.()}
  </>
)
</script>

<template>
  <section class="flex items-center justify-between">
    <MyInfo />

    <img
      class="w-20 rounded-1 object-cover"
      alt="个人照片"
      :src="avatar"
    >
  </section>

  <section>
    <h2 class="resume-title">
      教育背景
    </h2>
    <div class="my-2 center justify-between text-4">
      <span>{{ info[2] }} | 软件工程 | 本科</span>
      <time>2021 - 2025</time>
    </div>
    <p>获得英语四级证书、蓝桥杯省二等奖</p>
  </section>

  <section>
    <h2 class="resume-title">
      专业技能
    </h2>
    <ul>
      <li>
        熟练使用 Vue3 和 TypeScript，JavaScript 基础扎实。
      </li>
      <li>
        熟练如 pinia、vueuse 的 Vue 生态库；熟练运用 Nuxt3、Astro 等开发框架；有小程序和 Electron 跨端经验。
      </li>
      <li>
        熟悉 Node.js 开发，了解 Web 全栈开发，包括 Nest.js、Nitro.js、DrizzleORM 等后端技术。
      </li>
      <li>
        熟练阅读并理解英文文档，能够高效检索信息，注重代码的健壮性和可扩展性；积极参与开源项目，热衷于开发易用且实用的产品，乐于帮助他人解决问题。
      </li>
    </ul>
  </section>

  <section>
    <h2 class="resume-title">
      项目经验
    </h2>
    <ul class="projects">
      <li>
        <ProjectTitle
          title="Weibo-archiver - 微博备份工具"
          url="https://github.com/Chilfish/weibo-archiver"
          date="2023.10 至今"
          :stars="136"
        >
          <p>
            介绍：针对现有微博爬虫工具缺乏直观用户界面的问题，开发了一套集数据爬取、存储、及在线查看于一体的解决方案，下载量达到3k+。该项目使用到了Vue、Vite、油猴插件、NaiveUI、UnoCSS、Pinia、Nuxt、IndexedDB等技术。
          </p>
        </ProjectTitle>

        <ul>
          <li>
            利用油猴脚本技术，实现了在微博用户页面动态注 入Vue 构建的控制面板 UI，为用户提供丰富的数据导出选项。
          </li>
          <li>
            通过调用微博API爬取用户数据，并采用 IndexedDB 进行数据暂存，避免大量数据一次性加载至内存中，优化了内存使用并支持从断点续爬功能。
          </li>
          <li>
            实现了数据的解析清洗工作，并提供了包含微博图片链接的 CSV 文件导出功能，方便用户下载图片。
          </li>
          <li>
            开发了在线查看平台，用户可导入爬取的微博数据，通过 IndexedDB 在浏览器端存储数据，无需后端数据库支持，确保了数据的私密性。
          </li>
          <li>
            在线平台支持基于 fuse.js 的本地微博搜索、时间范围筛选、分页查看等功能，利用 IndexedDB 的索引和游标技术，大幅提升了数据检索速度和用户体验。
          </li>
          <li>
            采用 GitHub Issues 和 PR 管理项目开发流程，通过 GitHub Actions 实现 CI/CD 集成，确保了代码质量和项目的持续集成、快速部署。
          </li>
          <li>
            选用 Nuxt 框架基于 SSG 特性进行页面预渲染，优化了 SEO 并提升了首屏加载速度。
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>

<style>
.resume-info > div {
  --uno: icon-box w-fit;
}

.resume-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  padding: 0.5rem 0;
}

a:hover {
  text-decoration-line: underline;
  text-underline-offset: 5px;
}

section ul {
  padding-left: 1.5rem;
}
section li {
  list-style: disc;
  margin-top: 0.4rem;
}

.project-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  a {
    color: #333;
    font-size: 1rem;
    font-weight: bold;
  }
  a:hover {
    text-decoration-line: underline;
    text-underline-offset: 5px;
  }
}

ul.projects {
  padding-left: 0;
  & > li {
    list-style: none;
  }
  p {
    margin: 0.5rem 0;
  }
}

time {
  color: #94a3b8;
  font-weight: bold;
}
</style>
