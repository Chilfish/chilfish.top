---
title: RxJs & @ngify/http
date: 2023-07-17
tags: [ts]
---

## RxJs

“响应式编程” 最先想到的是 Vue 的 ref 了，用观察者模式监听数据的变化以做出对应的动作；“声明式 (函数式) 编程” 即为像 Lodash 或 ES6 的 Array 方法一样，使用一系列的 lambda 函数将要达成的目的组合起来，而不用手动地一个个实现内部细节

> RxJs 就是在**时间维度**上以**流**的方式处理事件的类 Lodash 库

RxJs 对常用的事件请求都做了相当多的封装，节流防抖、过滤、转换、缓存等

Rx 系列中还有一个是 RxJava，它将被 Kotlin 的 Flow 所代替，这在之前写的 Android Jetpack Compose 中一直有使用着，所以换到 js 中就迁移一下 api 语法就行了

：[从业务视角来聊一聊为什么我们需要 RxJS？][Why RxJs]

### 概念及应用

RxJs 基本由以下概念组成：

- **Observable**：表示一个可观察的数据流，可以被订阅
- **Observer**：观察者，用来接收 Observable 发出的数据
- **Subscription**：订阅，表示 Observable 和 Observer 之间的连接
- **Subject**：既是 Observable 又是 Observer，可以用来多播数据流
- **Scheduler**：调度器，用来控制数据流的执行时机
- **Operator**：操作符，用于对处理数据流操作

它有以下的应用场景

**表单验证**

在表单验证中，我们经常需要在用户输入时实时验证输入内容的有效性。但是，如果每次输入都触发验证，会造成性能浪费。这时，我们可以使用 RxJs 的 debounceTime 操作符来实现防抖功能，只有在用户停止输入一段时间后才触发验证

```js
const input = document.querySelector('input')
const inputStream = fromEvent(input, 'input')

inputStream
  .pipe(
    map(event => event.target.value),
    debounceTime(500),
  )
  .subscribe((value) => {
    // 验证输入内容
  })
```

**搜索建议**

在搜索框中，我们经常需要根据用户输入的关键词来提供搜索建议。但是，如果每次输入都触发搜索建议请求，会造成大量无用请求。这时，我们可以使用 RxJs 的 switchMap 操作符来实现搜索建议功能，只有在用户停止输入一段时间后才触发搜索建议请求，并且只保留最新的请求结果

```js
const input = document.querySelector('input')
const inputStream = fromEvent(input, 'input')

inputStream
  .pipe(
    map(event => event.target.value),
    debounceTime(500),
    switchMap(keyword => getSearchSuggestions(keyword)),
  )
  .subscribe((suggestions) => {
    // 显示搜索建议
  })

function getSearchSuggestions(keyword) {
  // 发起搜索建议请求
}
```

**分页加载**

在分页加载中，我们经常需要在用户滚动到页面底部时自动加载下一页内容。这时，我们可以使用 RxJs 的 concatAll 操作符来实现无限滚动功能，将每次加载的数据流连接在一起，形成一个无限数据流

```js
const scrollStream = fromEvent(document, 'scroll')

scrollStream
  .pipe(
    map(() => isScrollToBottom()),
    filter(isBottom => isBottom),
    map(() => getNextPageData()),
    concatAll(),
  )
  .subscribe((data) => {
    // 显示下一页内容
  })
```

可以看到它很多的方法和 Lodash 十分甚至九分的相像，不同在于 RxJs 将数据或事件转成流的形式 (fromEvent)，通过管道符 pipe 内的一系列的操作符将流进行处理，并传递给下一个操作符处理，最后将返回的数据 (map 或 filter 等处理数据的) 传给订阅者收集

## @ngify/http

`@ngify/http` 是一个基于 RxJS 的请求库，提供了一种简洁、灵活和响应式的方式来处理异步数据流

与 fetch 和 axios 相比，`@ngify/http` 有以下几个不同之处：

- 基于 RxJS：使用了 RxJS 的 Observable 和操作符来处理异步数据流，也就是它的请求默认返回的都是 `Observable<T>`。这使得它具有更强大的功能，比如可以方便地进行数据转换、错误处理和取消请求等

- 简洁的 API：@ngify/http 提供了一种简洁的 API，使得发送 HTTP 请求变得更加直观和易于使用。它使用了类似于 Angular 的 HttpClient 的语法，可以方便地设置请求头、查询参数和请求体等

下面是一个使用 @ngify/http 发送 GET 请求的示例：

```ts
import { http } from '@ngify/http'

http.get('https://api.example.com/users').subscribe(
  (response) => {
    console.log(response.data)
  },
  (error) => {
    console.error(error)
  },
)
```

在使用了 RxJS 的项目中，为什么要使用 @ngify/http 呢？因为 @ngify/http 提供了一种基于响应式编程的方式来处理异步数据流，这与 RxJS 的理念非常契合。它可以方便地与其他 RxJS 操作符和 Observable 进行组合，实现更复杂的数据处理逻辑

例如，我们可以使用 @ngify/http 和 RxJS 的操作符来实现自动重试、轮询和数据转换等功能。这使得我们可以更好地管理和处理异步数据流，提高代码的可读性和维护性

## 以搜索为例

-> [预览]

要实现的功能是经典的搜索请求，当搜索框有变化时发起请求，渲染结果。同时应该也要有过滤空、重复请求，也要有防抖，竟态的先后请求问题等

同时，我们将请求的部分放到专门的 Services 层来维护，Vue 部分就只有逻辑和 UI

先放 code：

```ts
const githubService = new GithubService()

fromEvent(searchInput.value!, 'input')
  .pipe(
    map(e => (e.target as HTMLInputElement).value.trim()),
    tap((val) => {
      if (val.length === 0)
        repoStatus.value = 'idle'
    }),
    filter(val => val.length !== 0),
    debounceTime(500),
    distinctUntilChanged(),
    switchMap((val: string) => {
      repoStatus.value = 'loading'
      return githubService.getRepos(val)
    }),
  )
  .subscribe({
    next: (data) => {
      repoStatus.value = data.length === 0 ? 'notFound' : 'success'
      repos.value = data
    },
    error: (error) => {
      console.error(error.message)
      repoStatus.value = 'error'
    },
  })
```

首先将输入框的 input 事件转为流，这里的 searchInput 是一个 `ref<HTMLInputElement | null>`，所以需要将这一段放到 `onMounted` 中，等 Dom 渲染完成得到 input 框才到下一步

在管道中，使用 map 操作符将事件对象转换为输入框的值，并使用 trim 方法去除首尾空格。这样可以确保输入的值是干净的。使用 filter 操作符过滤掉空输入，即长度为 0 的值。这样可以避免发送不必要的请求

使用 `debounceTime` 操作符设置防抖时间为 500 毫秒。这意味着只有在用户停止输入 500 毫秒后才会发起请求。这样可以避免频繁的请求，减轻服务器的负担

使用 `distinctUntilChanged` 操作符确保只有在输入值发生变化时才会发起请求。这样可以避免发送重复的请求，提高性能

使用 switchMap 将最终的 query 值交由 service 请求。switchMap 的特点是只保留最新的内部 `Observable` 流，当新的请求到来时，会取消之前的请求。这样可以解决竟态问题，确保只有最新的请求结果被处理

最后，订阅这个 service 的结果，返回给 Vue 的数据层

其中 service 这么写

```ts
export class GithubService {
  private http: HttpClient

  constructor() {
    this.http = new HttpClient()
  }

  getRepos(input: string) {
    return this.http
      .get<{ items: GithubRepo[] }>(`${api}/search/repositories?q=${input}`)
      .pipe(map(res => res.items))
  }
}
```

直接返回 `http.get` 这一个 `Observable`

[Why RxJs]: https://juejin.cn/post/7090422222195523621
[预览]: https://vue.chilfish.top/github
