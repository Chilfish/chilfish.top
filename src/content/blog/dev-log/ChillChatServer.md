---
title: Chill Chat app Server
date: 2023-05-29
tags: [logs]
category: blog
---

### 再次的全包

原以为我就写安卓端就好了，后来讨论过后，依旧还是我又来负责后端了......

但这样也好在选择更加自由了，以及后面来看确实有些正确的，主要原因还是一开始就没设计好像是架构、数据库字段之类的。在开发后端的过程中就是在不断地重构推翻自己，但也好在只用和自己争论 hhh

选择上，原本打算接手寒假时写的 [Chat 前后端][Chat-Full]，那也是用了 express 和 SocketIO + MongoDB。但发现写得实在是太鞑便了，不仅除了登录外的所有的请求都由 SocketIO 接手，js 项目写的也是一坨

后来才算是知道，严格来说 Express.js 并不算是一个框架，它并没有要求开发者以什么的结构去写，就以至于我写得毫无架构可言。看了一圈，还是用上了 [Nest.js][Nest.js]。它可以理解为是 Express 的再封装，不过它完全是一个框架来的，而且完全支持 TypeScript

数据库上从 mongoose 换到了 TypeScript 环境下的 [Typegoose][Typegoose]，并且为了适配 Nest.js，还得装个封装好的 [kindagoose][kindagoose]

时间：![wakatime][wakatime]

最后是一星期从上手到基本完成基本要求，虽然从架构上来说还差了挺多的，虽然感觉应该够应付了

[Chat-Full]: ./ChillChatAndroid.md
[Nest.js]: https://nestjs.com
[Typegoose]: https://typegoose.github.io/
[kindagoose]: https://github.com/GrapeoffJS/kindagoose
[wakatime]: https://wakatime.com/badge/user/0842a71f-c026-4b09-8aa0-f8398b4c3423/project/bf267b0a-5fdb-406b-889d-bbd1ccb800d5.svg
