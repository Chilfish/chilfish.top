---
title: 使用 Stream 流式处理数据，而不是全载入内存里
date: 2024-03-17
tags: [ts, node]
description: Stream 是一种流式处理数据的方式，它可以在读取流到写入流的过程中进行各种处理，如压缩、加解密、转码等
---

### 场景

都是处理二进制文件，但相较于 Buffer 或是 Blob 这种一次性载入内存的方式，Stream 则是按需加载

在处理大文件时，我们不希望一次性将整个文件载入内存，而是希望能够通过滑动的窗口流式处理数据，这样可以节省内存。配合上管道操作，可以在从读取流到写入流的过程中进行各种处理，如压缩、加解密、转码等

Stream 的 api 基本上在浏览器和 Node 环境都能使用，但也有一些不同的地方。如在浏览器里是没有 pipeline 的，要使用 [pipeThrough] 方法

#### 读取文件，并压缩

下面的代码使用了 `pipeline` 函数，它是 Node 里的一个工具函数，用于将多个流连接起来，当其中一个流出错时，会自动关闭所有流。它在管道中对数据进行了 gzip 压缩

```ts
import { pipeline as _pipeline } from 'node:stream'
import { createReadStream, createWriteStream } from 'node:fs'
import { createGzip } from 'node:zlib'
import { promisify } from 'node:util'

const pipeline = promisify(_pipeline)

await pipeline(
  createReadStream('package.json'),
  createGzip(),
  createWriteStream('package.json.gz'),
)
```

#### 实现文件下载进度的监听

流式传输的一大用处就是可以在下载文件的时候监听进度，但 fetch 尚不支持上传的监听

```ts
async function downloadFile(url: string) {
  const response = await fetch(url)

  if (response.status >= 400)
    throw new Error(`Bad response from server: ${response.status}`)
  if (!response.body)
    throw new Error('No body')

  const size = Number(response.headers.get('content-length')) || Number.POSITIVE_INFINITY
  const reader = response.body.getReader()

  const readStream = new ReadableStream({
    start(controller) {
      let received = 0
      read()

      async function read() {
        const { done, value } = await reader.read()
        if (done) {
          controller.close()
          return
        }

        received += value.byteLength
        const parsed = Math.floor((received / size) * 100)

        // 或者是其他的报告进度方式
        console.log(`Received ${parsed}% of the file`)
        controller.enqueue(value)
        read()
      }
    },
  })

  return new Response(readStream)
}
```

[pipeThrough]: https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream/pipeThrough
