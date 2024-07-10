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
        Java基础巩固 ，熟悉常用集合及数据结构，了解线程池、锁机制、网络编程等基础知识。
      </li>
      <li>
        熟练使用 Vue3 生态链及相关构建工具 和 TypeScript、小程序跨端开发，并熟练运用 ElementPlus 等UI框架。
      </li>
      <li>
        熟练使用 SpringBoot、MyBatisPlus、SpringMVC 等技术和相关设计模式；熟悉 Nodejs 及 Web 全栈开发。
      </li>
      <li>
        熟练使用 MySQL 并熟悉索引 事务 锁机制等相关知识，及 Redis 的相关数据类型使用场景、持久化和过期策略等。
      </li>
      <li>
        熟悉计算机网络等相关知识，了解常用的数据结构和算法思想，有良好的代码风格习惯。
      </li>
      <li>
        熟悉 Git 与 GitHub 的协作工作流，了解 CI/CD 流程、Linux 相关指令与 docker 部署。
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
      <li><ColdChain /></li>
      <li><Weibo /></li>
    </ul>
  </section>
</template>
