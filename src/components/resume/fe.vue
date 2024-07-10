<script setup lang="tsx">
import Main from './main.vue'
import { ColdChain, Weibo } from './projects'
</script>

<template>
  <Main />

  <section>
    <h2 class="resume-title">
      专业技能
    </h2>
    <ul>
      <li>
        熟练使用 Vue3 和 TypeScript，基础扎实，跟随最新规范；有小程序和跨端开发经验。
      </li>
      <li>
        熟练如 Pinia、Vueuse 等 Vue 生态库及相关构建工具；熟练运用 Nuxt 等开发框架和 ElementPlus 等UI框架。
      </li>
      <li>
        熟悉 Nodejs 及 CLI 开发及Web 全栈开发，包括 Nest.js、Spring Boot、MySQL 等后端技术。
      </li>
      <li>
        熟悉计算机网络等相关知识，了解常用的数据结构和算法思想，有良好的代码风格习惯。
      </li>
      <li>
        熟悉 Git 与 GitHub 的协作工作流，了解 CI/CD 流程，高效管理和部署项目。
      </li>
      <li>
        能够高效检索信息、解决问题，注重代码的健壮性和可扩展性；积极参与开源项目，热衷于开发易用且实用的产品。
      </li>
    </ul>
  </section>

  <section>
    <h2 class="resume-title">
      项目经验
    </h2>
    <ul class="projects">
      <li><Weibo /></li>
      <li><ColdChain /></li>
    </ul>
  </section>
</template>
