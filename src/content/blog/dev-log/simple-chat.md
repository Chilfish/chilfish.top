---
title: 经典的基于 Socket.io 的实时聊天应用
date: 2023-01-12
tags: [logs]
category: blog
---

> 始于 `2022-12-28 22:34` 的新建文件夹，到 `2023-01-05` 基本完成了 Web 前端、后端除了“同意好友添加、账号密码验证”，基本的*纯文本*聊天大体上是可以动了）
>
> 然后就瘫玩了一星期（归咎于新冠后遗症（））……连后来才想起来的“开发日志”也是拖着没写，那大体地按时间顺序吧
>
> 后来大致完成后才想到移动到 `~/Projects` 下，在这之前的 commit 记录可以看 [这个时间点的 SocketServer](https://github.com/Chilfish/FishCode/tree/c9f13d58a133126de9e0b884a278a2f4f4f67996/Web/node/SocketServer)，之后就到 [/tree/main/](https://github.com/Chilfish/FishCode/tree/main/Projects/SocketServer) 下了
>
> （private 了，到时候有空捡起来再 public 吧......

> 其实算是归档了，已经完全不想碰了......

### 动机

2022-12-23：临睡前 B 站给推荐了 [[Qt | OpenGL] 计算机图形学大作业（摆烂）| 场景编辑器](https://www.bilibili.com/video/BV1LG411N7EE/)，可能是之前看了几个好玩的图形学作业。瞬间感觉墙，Qt 还能这么玩，于是顺手点进主页，然后就看到了……

![看起来也太好玩了吧）](/blog/dev-log/motivation.jpg)

2022-12-24：爬起后突然好奇下学期的安卓作业要怎么写，然后翻到学校前几届在 GitHub 上的 lab 的选题列表：[HzuApps](https://github.com/hzuapps/android-labs-2020/issues)。本来想做个音乐播放器的，但想了又想，反复打开网易云和 QQ 音乐，意识到也太折腾了）毕竟连 Vue 版本都没动工…… 最后还是打算做个简易的私聊聊天器）

然后花了三四天摸了下 `Android Studio`，后来才意识到得先过了 Java 项目管理之类的再说，就先放下了。其中有了解到了 Flutter、React Native 之类的框架，打算是做完后再用 Flutter 重构好了

### Logs

既然是实时聊天，那一般都是用 WebSocket 协议来保持持久连接了。之前有知道 Node.js 有个 `Socket.io` 库对它做了封装。在咨询了 ChatGPT 的建议后，决定后端的服务器就用 Node 了，客户端就先用原生 js 来复健下，差不多后再去开发安卓

其中先试手了 [socket.io-client-java](https://github.com/socketio/socket.io-client-java) 库，毕竟 `socket.io` 与原生 `WebSocket` 不能直接通信，客户端得要用相应的库

在找案例的时候，发现大都是一种 channel 的聊天室，而我更多是要私聊（后来才知道都基本差不多的，只是 `socket.join(room)` 的房间不同而已

我是先开发前端，用死数据填充，差不多后就用 fetch json 文件来模拟从后端获取数据，然后填充到 `<template>` 里

在 UI 设计上主要参考了 Telegram 的深色模式，想到了之前看到的 `tailWind.css`，就顺便用下了）大家都说用了就回不去了，看了蛮多博客也用这个

#### 22-12-29

29 号当天边学 tailWind 边设计页面了。遇到的第一个坑还是，当时有点偷懒就没用 npm 包了，就直接用了 CDN 或本地 js 。但这样 VSCode 会没有代码补全（文档）

最后还是按 [推荐](https://tailwindcss.com/docs/installation) 地下 npm 包和 `input.css`

总体用下来还是很舒服的，复用的话就带上 `@apply`。虽然后来才注意到 `Working mobile-first`，它的媒体查询是手机端优先的，所以要设计桌面端的话，得加上断点 `sm:h-5` 之类的，表示屏幕尺寸大于 sm 值时应用 `h-5`

此时大概的文件目录如下

```shell
├─tailwind.config.cjs #tailwind.css 配置文件
├─src
|  ├─server #服务器目录
|  |   └─index.js
|  ├─client #客户端目录
|  |   ├─index.html
|  |   ├─input.css
|  |   └─Script
|  |      └─index.js
|  └─Data #模拟数据库的数据
|      ├─ChillFish.json
|      └─OrganicFish.json
└─public #资源文件
    └─img
```

当天完成了 HTML 的部分，还找到了一些图标库：[tailwind toolbox](https://tailwindtoolbox.com/icons)，[heroicons](https://heroicons.com/)。可以说超复刻了）

![这时还没写js和手机端](/blog/dev-log/main.png)

![后来补上的手机响应式](/blog/dev-log/phone.png)

#### 22-12-30

接着是写些基础的交互 js，像是选中私聊对象后的动作，刷新界面。我这用 URL 来保存当前私聊的对象，如：`urlBase/#/?chatUser=ChillFish`

因为我又想像别处那样即便只输入了 URL 也能定位到当前的聊天对象。于是我把左侧的列表每个 li 套了层 `<a href="#/?chatUser=xxx"/>`。这里用锚点是因为，既然没写路由控制，而导致直接点时会刷新页面来跳转，但我只想部分刷新，就用锚点配合 urlQuery 了。而且用了 history 的 api 来控制历史记录的返回前进时的动作

这样每当切换聊天对象或刷新重新载入时，就能从 urlQuery 里获取数据了。此时新建了个 `loadData.js` 来处理聊天记录的加载

就先 `fetch('/src/data/${chatUser}.json')`，然后读取数据，修改 DOM。一开始是根据 json 的 isOwn 来决定消息的发送者。而且特别蠢地定义 class 来定义方法，但结果并用不上这个特性 hhh

此时遇到的最大困难在于，想着在页面初始化刷新时，先从服务器获取聊天列表，然后才有对列表事件的监听。虽然有 await 了 fetch 后才 querySelector，但此时始终获取到的 NodeList 总是空的……

好吧这实在是太蠢了……异步和 Promise 机制

```html
<ul></ul>
<script>
  const ul = document.querySelector("ul");
  async function get() {
    await (await fetch("urlBase/data.json")).json().then((res) => {
      res.forEach((ele) => {
        ul.innerHTML += `<li>${ele}</li>`;
      });
    });
  }

  (async () => {
    await get();
    console.log(document.querySelectorAll("li"));
  })();
</script>
```

#### 22-12-31

这时候前端 js 部分大体好了，也有 sendMesHandler，就着手于后端的 `socket.io` 和数据库的设计了

之前看到的一个案例中有用到了 Redis，看了眼感觉还不是很用得上。而且为了方便启动客户端，加了个 `live-server` 的 npm 包

然后就一直在看 MongoDB 了，但顺便又看到了由此封装后的更好的 `Mongoose.js`，感觉妙耶

就是在连接数据库之前，经典的得先开启数据库服务： `net start mongodb`（管理员 shell）

而且感觉 Schema 和 Model 的概念……原来是这样啊的感觉了

#### 23-01-01

但最大的疑惑在于，socket.io 官网中 [客户端的配置](https://socket.io/zh-CN/docs/v4/client-installation/) 中

```html
<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io();
</script>
```

的 `/socket.io/socket.io.js` 究竟在哪……

后来才翻到 [CSDN](https://blog.csdn.net/wang839305939/article/details/79316152)，这要去 `node_modules/socket.io/client-dist/` 复制出 `socket.io.js` 和 `socket.io.js.map` 放到 `/socket.io/` 文件夹下才能引用……

然后客户端终于能连接上了……服务器端就用官网的案例，借用 express 就好，跨域问题加句：`const io = new Server(httpServer, { cors: true });`

#### 23-01-02

这时想加上登录的功能了，毕竟得要试多窗口聊天。对比几个方案后选用了 Token 的方式身份验证了，即 npm：`JWT: JSON Web Token`

这本身用起来也很简单，照着 index 给的 api 封装一下就好

大抵就是前端每次请求都带上登录时后端返回的 Token（通常存在 Cookie 或 localStorage 中 ），服务器再对传来的 Token 用私钥解密，没错则通过鉴权

同时又加上了 生成随机 id 的`uuid`、读取项目配置文件的`dotenv` 的 npm 包

```js
// 配置文件写在根目录下的 .env 再就好
import dotenv from 'dotenv'

dotenv.config()

const port = process.env.SOCKET_PORT || 3000
const dbUri = process.env.MONGODB || 'mongodb://localhost:27017/Chat'
const { JWT_TOKENS_SECRET: secret, JWT_EXPIRY: expiry } = process.env
```

登录的处理的话，就用 express 来处理就好，前端 fetch 这个 api。登录或注册成功后就存下 Token 和登录 username，然后才连上 `socket.io`。而带 Token 的连接则：

```js
// Client
// Server
import { Token } from './JWT.js'

const socket = await io.connect(socketUrl, {
  query: `token=${localStorage.getItem('token')}`,
})
// 未通过认证或未登录就访问
socket.on('unauthorized', () => {
  setTimeout(() => {
    socket.disconnect()
    window.location = './login.html'
  }, 1000)
})
io.on('connection', async (socket) => {
  const token = socket.request._query.token
  let curUser = ''

  // 封装后的JWT，对传来的Token解码
  await Token.decrypt(token)
    .then((res) => {
      curUser = res.name.name
    })
    .catch((err) => {
      console.log(`error! ${err}`)
      socket.emit('unauthorized')
      socket.disconnect()
    })
})
```

还设计了 Mongoose 数据库，用户们、聊天记录、登录注册

```js
const userSchema = new Schema({
  uid: String,
  name: String,
  registerTime: String,
  face: { type: String, default: 'default.png' },
  friends: [{ type: Schema.Types.ObjectId, ref: 'users' }],
})

const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'users' },
  receiver: { type: Schema.Types.ObjectId, ref: 'users' },
  message: String,
  time: String,
  // type: String,
  // read: Boolean,
})
```

chatGPT 大好人啊）对好友数组的数据直接用用户的 `_id` 是我没想到的了，虽然想想会觉得是理所当然的了，聊天记录表的用户也是用 `_id` 来存了，这样可以让数据库很快地找到

还把前端的 js 都改为了 `type="module"`，import 和 export…… 虽然没什么，但只要是我整了个 拆分时间的 util、统一 socket 的 emit 和 on 的接口

```js
// socketApi.js
export const api = {
  getFriends: 'get friends',
  addFriend: 'add friend',
  search: 'search people',

  join: 'join to chat',
  sendMessage: 'send message',
  message: 'got message',
  chatRecord: 'chat record',
}
```

// to use:

```js
import { api } from '../socketApi.js'

socket.emit(api.sendMessage, data)
socket.on(api.message, () => {})
```

#### 23-01-04

添加了个退出登录的按钮……这只要 remove 掉 localStorage 里的 Token 就好

这下又到 UI 困扰了……想输入的消息能换行，于是就把 input 改为了 textarea，然后也模仿下换行时增高输入框的高度，直到最大值

但实在是脑抽了没整得出来，问了问 chatGPT。其实他一开始就给出了答案，但……

```js
mesInput.oninput = function () {
  this.style.height = '' // 忘记了……
  const height = this.scrollHeight + this.offsetHeight - this.clientHeight
  this.style.height = `${height}px`
  chatMain.scrollTop = chatMain.scrollHeight
}
```

它是要每次输入都要重新计算高度，但我一开始忘记先重置高度的值，导致一直没变化……而且 CSS 方面也没写对，后来改好了

```html
<div class="w-full min-h-14 py-2 mr-4 bg-main-4 ">
  <textarea
    id="mes"
    class="w-full max-h-40 h-8 leading-8 border-0
        bg-transparent focus:outline-none resize-none"
    rows="1"
    type="text"
    autocomplete="off"
    placeholder="Write a message..."
  ></textarea>
</div>
```

服务器方面，把 Socket 的处理给瞅了出来，`socketHandler(socket, curUser);` 就好。还改了下数据库的连接方式）不知怎么想的一开始居然每次执行函数都要连接断开……

```js
httpServer.listen(port, async () => {
  console.log(`server is running on ws://localhost:${port}`)
  await mongoose.connect(dbUri).then(() => {
    console.log('MongoDB is connecting')
  })
})

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected')
    process.exit(0)
  })
})
```

#### 23-01-05

也是这天，把这两天在想的问题突然开朗……就是我得怎样实现私聊啊，看了眼 api，就是得让两人 `socket.join(room)` 到同一个 room 里，这样 a 给 b 发消息 `socket.to(room).emit(api.sendMessage, data)` 时，只有这个房间里除了发送方之外的都接收到信息，然后更新到 UI 中

但问题在于要怎么决定 room 呢……群聊的话用上群名称加标识符就好，但私聊的话……顺序是个问题：｛a2b：`ab`；b2a：`ba`｝，这样就不在一个房间里啊…chatGPT 说用哈希，但也不对啊，`ab` 和 `ba` 哈希出来的还是不同

这时已经半夜了，睡一觉后突然意识到直接把两人放到数组里在排序不就好了嘛……好吧这实在是太蠢了

```js
socket.on(api.join, (user) => {
  const chat = [user, curUser].sort()
  chatRoom = `${chat[0]} ${chat[1]}`
  socket.join(chatRoom)
})
```

解决了这个后发消息什么的也没问题了，前端都做好了就等消息接收……再改改细节就交一发 push 了

然后才想起来是不是得写一个开发日志什么的记录下坑……但先玩再说吧，然后正好一星期就过去了…尽在互联网冲浪了，果然就停不下来了

做完后再补上项目的 index 好了

> （后续来看）其实不大对，只要登陆进去的时候将自己加入`client.join(userId);`，就能够用这个来私聊了 `server.to(message.receiveId).emit('message', message);`
