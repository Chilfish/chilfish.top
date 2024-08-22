/* eslint-disable antfu/top-level-function */
import { ProjectTitle } from './component'

export const Weibo = () => (
  <li>
    <ProjectTitle
      title="Weibo-archiver - 开源微博备份工具"
      url="https://github.com/Chilfish/weibo-archiver"
      stars="240"
    >
      <p>
        <strong>技术：</strong>
        Vue3、Vite、油猴脚本、NaiveUI、Axios、Pinia、Nuxt、IndexedDB、CLI开发等。
      </p>
      <p>
        <strong>介绍：</strong>
        针对现有微博爬虫工具缺乏直观用户界面的问题，开发了一套集数据爬取、存储及在线查看于一体的解决方案。
      </p>
    </ProjectTitle>

    <ul>
      <li>
        利用油猴脚本技术在微博页面动态注入 Vue 控制面板 UI，实现了丰富的数据导出配置。
      </li>
      <li>
        通过 Axios 获取微博API的用户数据并动态暂存在 IndexedDB 中，以保证数据的持久化。
      </li>
      <li>
        开发了纯前端的在线查看平台，用户可导入爬取的微博数据到本地来查看，确保数据私密性。
      </li>
      <li>
        在线平台基于 fuse.js 实现微博搜索，利用 IndexedDB 的索引和游标实现时间范围筛选、分页查看等功能。
      </li>
      <li>
        在线平台选用 Nuxt 框架，基于 SSG 特性进行页面预渲染和 SEO 设置。
      </li>
      <li>
        通过 GitHub Actions 实现 CI/CD 集成，确保代码质量和项目持续集成、快速部署。
      </li>
      <li>
        项目使用 pnpm workspace 管理，各个包与构建的应用之间共享与复用，提高了项目的可维护性和扩展性。
      </li>
    </ul>
  </li>
)

export const ColdChain = () => (
  <li>
    <ProjectTitle
      title="疫苗温度与定位大屏监控系统 - 独立开发"
    >
      <p>
        <strong>技术：</strong>
        Vue3、TypeScript、EChart.js、MongoDB、SSE、SpringBoot 等。
      </p>
      <p>
        <strong>介绍：</strong>
        开发了一套用于实时监控疫苗运输过程中温度和位置的大屏展示系统，集成数据统计、异常告警、定位监控等功能。
      </p>
    </ProjectTitle>
    <ul>
      <li>
        使用 Vue3 和 Element UI 搭建前端页面，通过 ECharts 实现地图实时监控和数据可视化。
      </li>
      <li>
        前端通过 Server-Sent Events（SSE）与后端实现数据实时通信，实时地更新冷链箱子的状态。
      </li>
      <li>
        通过路由携带的信息，实现从大屏页面跳转到具体的冷链箱子的定位地图页面。
      </li>
      <li>
        地图页面接入高德地图 API，实现冷链箱子的实时定位显示。
      </li>
      <li>
        管理系统中支持注解式菜单权限拦截和数据权限拦截，确保系统权限管理的精细化和灵活性。
      </li>
    </ul>
  </li>
)
