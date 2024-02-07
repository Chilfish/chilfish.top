---
title: (2) Weibo-archiver 存档你的微博 | 开发记录
date: 2024-02-07
tags: [dev-logs, vue]
description: 将你的新浪微博存档备份，为号被完全夹没前绸缪 😭。支持导出为 HTML 文件、包含所有的图片、前15条评论
cover: https://p.chilfish.top/weibo/cover.webp
keywords: Weibo Archiver, 备份, 存档, 炸号, 保存微博, 微博, 开发记录
---

项目地址：[Chilfish/Weibo-archiver]，[前一集](weibo-archiver.md)

### 最认真的一集

在忙完烦人的期末作业后，总算是想着拾起这个项目了😅随着用的人多了起来，和竞品（雾）[speechless] 大重构了，还用 Electron 发了桌面版，就想着应该也动手了起来

一个有趣的现象是，脚本已经有好几百的下载量了，但 preview.zip 却没什么人下载，虽然已经在文档说得较为清楚了hhh。于是加了个导出时顺带自动下载它

最受宠若惊的是，想着试着把赞赏码放上去时，第二天就收到 ￥50 的打赏了……连忙把赞赏列表给刻在网站上了 [sponsors]

#### 再见了，饿了么

一开始图方便，就用了饿了么的组件库。但到后面，有时候太多的 hack 方法，和实在是看着不是很顺眼，于是就迁移到了 [naive-ui]

但没想到的是，麻烦事又多了起来hhh 还是因为油猴的部分，在打包到外部引用时，一开始我用的是 auto-import 来自动导入组件，但最终打包的时候它总会打进很多没用上的组件。最终的解决方式还是在 monkey 的 monorepo 中手动全局注册用到的组件

#### 噢我的路由们

很多 bug 还是我自己平时要用的时候才发现的，开发时就没想到……

在加功能的时候，想着将分页的状态（pageSize、page）添加到 url 中，这样不论是刷新还是什么都能保持了。写在了 [usePagination.ts] 中

#### 更现代的 monorepo

因为要开桌面版，于是先搜了一堆 electron 相关的最佳实践，发现它们的目录结构都是 `/packages` 放共用、核心的部分，在 `/apps` 则是最终的应用，如官网、web 版、桌面版等等

于是我也学着重构了一番：[pull: refactor: monorepo directory structure #8]，换了些更有意义的命名

#### 麻烦的图片

才发现图片懒加载一直都没凑效过，于是还是手动用经典的 `IntersectionObserver` 来为所有的图片懒加载了：[lazyLoadImages]。默认的 src 是一张占位图，滑动到它时再动态更换到 `data-src` 里的链接

再就是 Gallery 的宫格图片了，样式是真的难调…… CSS 好难hhh

### 规划项目

写了好几个小东西过后，逐渐意识到尽早规划的重要性😅边写边改、后续回过头来再改实在是太痛苦了，以及为了提醒自己、告知用户（画饼），完善了 README 的说明、加了一个 [项目规划]，并用 [todoist] 来写好代办

![暂时列下的 todos](/blog/dev-log/weibo-todo.webp)

同时，在每次完成之后的划掉它的感觉是真的舒服🥳成就感超大，超可视化

接下来就是先试手 Electron 开发，之后再迁移过去了

[Chilfish/Weibo-archiver]: https://github.com/chilfish/Weibo-archiver
[speechless]: https://speechless.fun/
[sponsors]: https://chilfish.top/sponsors
[naive-ui]: https://www.naiveui.com/
[usePagination.ts]: https://github.com/Chilfish/Weibo-archiver/blob/39bd46f44a2f591f4f55d81502e3d6c0c01363f9/packages/core/src/composables/pagination.ts
[pull: refactor: monorepo directory structure #8 ]: https://github.com/Chilfish/Weibo-archiver/pull/8
[lazyLoadImages]: https://github.com/Chilfish/Weibo-archiver/blob/39bd46f44a2f591f4f55d81502e3d6c0c01363f9/packages/core/src/utils/dom.ts#L26
[项目规划]: https://github.com/Chilfish/Weibo-archiver/issues/7
[todoist]: https://todoist.com/
