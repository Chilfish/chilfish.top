<!-- eslint-disable antfu/top-level-function -->
<script setup lang="tsx">
import type { SetupContext } from 'vue'

const avatar = import.meta.env.DEV
  ? 'http://localhost:5173/private/证件.png'
  : 'https://chilfish.top/avatar.webp'

const MyInfo = () => (
  <div class="center-col items-start gap-3">
    <h1 class="font-bold">
      <span class="mr-3 text-6">
        Chilfish
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
        <span>131xxxx1794</span>
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
      <div class="center">
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
    <div
      class="text- center justify-between"
    >
      <span>xx学院 | 软件工程 | 本科</span>
      <time>2021 - 2025</time>
    </div>
  </section>

  <section>
    <h2 class="resume-title">
      专业技能
    </h2>
    <ul>
      <li>熟练掌握</li>
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
          :stars="135"
        >
          <p>
            介绍：利用油猴脚本爬虫导出用户的微博数据，在提供的在线平台导入查看，解决了其他微博爬虫项目中缺少UI页面查看数据的痛点。使用到的技术：Vue、vite 油猴插件、NaiveUI、UnoCSS、Pinia、Nuxt、IndexedDB 等
          </p>
        </ProjectTitle>

        <ul>
          <li>负责前端页面设计和开发</li>
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
  padding-bottom: 0.7rem;
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
}

.project-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
