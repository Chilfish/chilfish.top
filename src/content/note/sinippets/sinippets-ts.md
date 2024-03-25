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
        observer.disconnect()
        resolve(element)
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })
}
```

### 防抖函数

```ts
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300,
): T {
  let timer: number | null = null
  return function (this: any, ...args: Parameters<T>) {
    if (timer)
      clearTimeout(timer)

    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  } as T
}
```

### 节流函数

```ts
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300,
): T {
  let lastTime = 0
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()
    if (now - lastTime > delay) {
      fn.apply(this, args)
      lastTime = now
    }
  } as T
}
```

### 经典深拷贝

```ts
interface Obj { [key: string]: any }
interface CloneOptions {
  /** 包含继承来的原型 */
  includeProto?: boolean
}

export function deepClone<T = any>(
  x: T,
  options: CloneOptions = {
    includeProto: false,
  },
): T {
  const isObj = (x: any): x is Obj => x && Object.prototype.toString.call(x) === '[object Object]'
  const set = (obj: any) => isObj(obj) ? deepClone(obj) : obj

  if (!isObj(x))
    return x

  if (Array.isArray(x)) {
    const output = Array(x.length)
    x.forEach((value, index) => output[index] = set(value))
    return output as T
  }

  const output: Obj = {}
  for (const key in x) {
    if (Object.hasOwnProperty.call(x, key)) {
      output[key] = set(x[key])
    }
    else if (options.includeProto) {
      console.log(key)
      Object.defineProperty(output, key, {
        value: set(x[key]),
        writable: true,
        enumerable: true,
        configurable: true,
      })
    }
  }

  return output as T
}
```
