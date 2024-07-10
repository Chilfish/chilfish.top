<script setup lang="ts">
import { MyInfo } from './component'

const {
  DEV: isDev,
  RESUME_INFO: resumeInfo = 'Chilfish;131xxxxxx94;xx学院;',
} = import.meta.env

const avatar = isDev
  ? 'http://localhost:5173/private/证件.png'
  : 'https://p.chilfish.top/wechat.webp'

const info = resumeInfo.split(';')
</script>

<template>
  <section class="flex items-center justify-between">
    <MyInfo />

    <img
      class="w-18 rounded-1 object-cover"
      alt="个人照片"
      :src="avatar"
    >
  </section>

  <section>
    <h2 class="resume-title">
      教育背景
    </h2>
    <div class="mb-1 center justify-between text-3.5">
      <p class="font-bold">
        {{ info[2] }}（本科） 软件工程
      </p>
      <time>2021 - 2025</time>
    </div>
    <p>英语四级证书、蓝桥杯省二等奖</p>
  </section>
</template>

<style>
.resume-info > div {
  @apply: icon-box w-fit;
}

.resume-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  padding-bottom: 0.2rem;
  border-bottom: #3388bb 2px solid;
  margin-bottom: 0.8rem;
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
  a, ._title {
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
    margin-bottom: 1.5rem;
    list-style: none;
  }
  p {
    margin: 0.5rem 0;
  }
}

time {
  font-weight: bold;
  font-size: 0.875rem;
  margin-left: auto;
}
</style>
