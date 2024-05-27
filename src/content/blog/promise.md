---
title: Promise 再揭
date: 2024-03-17
tags: [ts, promise]
description: 不再仅仅只是无脑 Promise.all 了，Promise 的一些细节
---

虽然用了很久的 Promise 来处理异步事件，但一直都没系统地整理它们的一些用法 😅

## 经典的异步与事件循环

JavaScript 对于异步事件的处理是通过事件循环来实现的，核心概念是事件队列 (Event Queue) 和执行栈 (Call Stack)。执行栈用于存储代码的执行顺序，而事件队列则存储异步操作的回调函数。当执行栈为空时，事件循环会从事件队列中取出一个回调函数，放入执行栈中执行

事件循环遵循以下几个步骤，这个过程会不断循环，直到事件队列和调用栈都为空。

- 执行同步任务：首先执行当前调用栈中的所有同步任务，直到调用栈为空。
- 处理异步任务：当遇到异步任务时，将其放入事件队列中，等待执行。
- 等待：等待调用栈为空。
- 执行回调：当调用栈为空时，事件循环会从事件队列中取出一个回调函数，放入调用栈中执行。

在 JavaScript 中，常见的异步操作包括定时器 (setTimeout，setInterval)、Promise、事件监听器等。这些异步操作会在事件循环中被处理，确保它们能够按照正确的顺序执行。

虽然支持传入 Promise 数组来运行，但实际上因为默认下 js 是单线程的，这些 Promise 只是在不断地切换的并发运行，而不是真正的并行运行。得切到 worker 里才能真正多线程运行

## API 用法

### new Promise 实例

通常我们要等一个回调函数里的值，并在该函数外面使用，例如等待 img.onload 之后的操作，这时就需要用 promise 来包装它

```ts
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

// to use
const img = await loadImage('https://example.com/image.jpg')
conoole.log(img.width)
```

这样就可以在外面使用 img 了，而不是通过传一个回调函数的参数来使用。这种做法就叫做 **promisify**，可以写成一个通用的函数：

```ts
function promisify<T = any>(fn: Function): (...args: any[]) => Promise<T> {
  return (...args: any[]) => {
    return new Promise((resolve, reject) => {
      fn(...args, (err: any, data: T) => {
        if (err)
          reject(err)
        else
          resolve(data)
      })
    })
  }
}
```

### Promise.all

Promise.all 接收一个 promise 数组，返回一个新的 promise 数组，按传入的排序，但完成时机与顺序无关

只有当所有的 promise 都 resolve 时，新的 promise 才会 resolve；任意一个 promise reject 时，新的 promise 就会 reject。最终 resolve 的时机为数组里最久完成的那个，reject 的时机为数组里最先 reject 的那个

通常用在多个异步操作都完成后再执行某个操作的场景

### Promise.allSettled

Promise.allSettled 与 Promise.all 类似，但不会因为某个 promise reject 而 reject，而是会等待所有的 promise 都 settle (resolve 或 reject) 后才 resolve

reject 的结果将呈现在 then 的结果中，而不会被 catch 捕获，类型如下：

```ts
type ThenDataInfo = {
  status: 'fulfilled'
  value: unknow
} | {
  status: 'rejected'
  reason: Error
}
```

### Promise.any 和 Promise.race

any 是指任意一个 promise resolve 时，新的 promise 就会 resolve；只有当所有的 promise 都 reject 时，新的 promise 才会 reject

而 race 则是指任意一个 promise settle 时，新的 promise 就会 settle，不管是 resolve 还是 reject

then 里它只会返回第一个 resolve 的 promise 的结果，而不会返回一个数组

## 场景应用

### 超时拒绝 Promise

这就看传入的 promise 与 setTimeout 相比谁先完成了

```ts
export function timeoutPromise<T>(
  promise: Promise<T>,
  timeout: number,
  message?: string,
) {
  return Promise.race([
    promise,
    new Promise<T>((resolve, reject) => {
      setTimeout(() => {
        reject(new Error(message || 'timeout'))
      }, timeout)
    }),
  ])
}
```

### 错误重试

经典的 fetch 失败重试

```ts
export function retryPromise<T>(
  promise: () => Promise<T>,
  retryCount = 5,
  interval = 1000,
) {
  return new Promise<T>((resolve, reject) => {
    let count = 0
    const run = () => {
      promise()
        .then(resolve)
        .catch((error) => {
          if (count < retryCount) {
            count += 1
            setTimeout(run, interval)
          }
          else {
            reject(error)
          }
        })
    }
    run()
  })
}
```

### 可中断的

其实 fetch 本身可以将 signal 作为第二个参数传入，来实现中断

```ts
export function interruptablePromise<T>(
  promise: Promise<T>,
  abortSignal: AbortSignal,
) {
  return new Promise<T>((resolve, reject) => {
    abortSignal.addEventListener('abort', () => {
      reject(new Error('abort'))
    })

    promise
      .then(resolve)
      .catch(reject)
  })
}

// 使用
const abortController = new AbortController()
const promise = interruptablePromise(fetch('https://example.com'), abortController.signal)

// 手动中断
abortController.abort()
```

### 串行执行

这个场景下，我们需要等待上一个 promise 完成后再执行下一个 promise

```ts
export function serialPromise<T>(
  promises: (() => Promise<T>)[],
) {
  return promises.reduce(
    (prev, next) => prev.then(next),
    Promise.resolve(),
  )
}

// 使用
const promises = [
  () => fetch('https://example.com/1'),
  () => fetch('https://example.com/2'),
  () => fetch('https://example.com/3'),
]

await serialPromise(promises)
```
