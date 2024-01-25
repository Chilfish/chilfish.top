---
title: TypeScript 代码片段们
date: 2023-12-30
tags: [note, ts]
---

### Image ArrayBuffer to URL

```ts
export function toURL(arrayBuffer: ArrayBuffer) {
  if (!(arrayBuffer instanceof ArrayBuffer)) {
    throw new TypeError(
      'Invalid parameter: arrayBuffer must be an instance of ArrayBuffer',
    )
  }

  let type = 'image/png'
  const buffer = new Uint8Array(arrayBuffer)

  if (buffer.byteLength > 0 && buffer[0] === 60)
    type = 'image/svg+xml'

  else if (
    buffer.byteLength > 3
    && buffer[0] === 71
    && buffer[1] === 73
    && buffer[2] === 70
  )
    type = 'image/gif'

  else if (buffer.byteLength > 2 && buffer[0] === 255 && buffer[1] === 216)
    type = 'image/jpeg'

  const url = URL.createObjectURL(new Blob([buffer], { type }))

  // 在适当的时机手动释放URL对象
  const cleanup = () => {
    URL.revokeObjectURL(url)
  }

  // 返回URL，并在外部调用cleanup函数来释放资源
  return { url, cleanup }
}
```

### Get Image Size

```ts
export function getImageSize(url: string) {
  return new Promise<{ width: number, height: number }>((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = reject
    img.src = url
  })
}
```

### Cross Window Message

Send message to another window

```ts
export function sendAnotherWindowMessage(
  target: Window,
  origin: string,
  message: any,
  transfer?: Transferable[],
) {
  target.postMessage(message, origin, transfer)
}
```

Receive message from another window

```ts
export function getAnotherWindowMessage(
  target: Window,
  origin: string,
  timeout = 5000,
  errorHandler?: (error: Error) => void,
  eventType = 'message',
) {
  return new Promise<MessageEvent>((resolve, reject) => {
    const timer = setTimeout(() => {
      const error = new Error('timeout')
      if (errorHandler)
        errorHandler(error)

      reject(error)
    }, timeout)

    const handler = (event: MessageEvent) => {
      if (event.origin === origin) {
        clearTimeout(timer)
        target.removeEventListener(eventType, handler)
        resolve(event)
      }
    }

    target.addEventListener(eventType, handler)
  })
}
```

### Wait for element

```ts
function waitForElement(
  selector: string,
  $: (e: string) => Element | null = e => document.querySelector(e),
): Promise<Element> {
  return new Promise((resolve) => {
    const element = $(selector)
    if (element) {
      resolve(element)
      return
    }

    const observer = new MutationObserver(() => {
      const element = $(selector)
      if (element) {
        resolve(element)
        observer.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })
}
```

### Promise

#### 超时 Promise

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

#### 错误重试

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

#### 可中断的

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

其实 fetch 本身可以将 signal 作为第二个参数传入，来实现中断

####
