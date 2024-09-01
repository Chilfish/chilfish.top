---
title: 一个经典的事件处理器
date: 2024-03-17
description: 事件处理器是一个经典的设计模式，它可以让我们在不同的模块之间进行通信
---

事件处理器是一个经典的设计模式，它可以让我们在不同的模块之间进行通信。例如最经典的 `document.addEventListener` 就是一个事件处理器，它将监听特定名称事件的发生，然后执行特定的回调函数

或者说经典的跨组件传参数除了 props 之外，还有事件处理器。例如在 Vue 中，我们可以通过 `this.$emit` 来触发一个事件，然后在父组件中通过 `@` 来监听这个事件，然后执行特定的回调函数

但要实现全局的事件传递，我们需要一个全局的事件处理器，最经典精简的库就是 [developit/mitt] 了，不过我们可以手动实现它

```ts
type fn = (...args: any[]) => void
export function emitter() {
  const events = new Map<string, fn[]>()

  function get(name: string) {
    if (events.has(name))
      return events.get(name)!
    return []
  }

  /**
   * 订阅事件
   */
  function on(name: string, cb: fn) {
    if (!events.has(name))
      events.set(name, [])

    get(name).push(cb)

    return () => {
      off(name, cb)
    }
  }

  /**
   * 发布事件
   */
  function emit(name: string, ...args: any[]) {
    get(name).forEach(cb => cb(...args))
  }

  /**
   * 取消订阅
   */
  function off(name: string, cb: fn) {
    const cbs = get(name)
    const index = cbs.indexOf(cb)
    if (index > -1)
      cbs.splice(index, 1)
  }

  /**
   * 只订阅一次
   */
  function once(name: string, cb: fn) {
    const off = on(name, (...args: any[]) => {
      off()
      cb(...args)
    })

    return off
  }

  /**
   * 发布全部事件
   */
  function emitAll(...args: any[]) {
    events.forEach((cbs, _name) => {
      cbs.forEach(cb => cb(...args))
    })
  }

  /**
   * 清空所有事件
   */
  function clear() {
    events.clear()
  }

  return {
    on,
    emit,
    off,
    once,
    emitAll,
    clear,
  }
}

export type Emitter = ReturnType<typeof emitter>
```

说白了就是拿个 map 来键值地存事件名称及其函数，在 emit 获取这个函数并调用而已

但这个实现还有个小问题：事件的类型并不好看。因为这里事件名称都只是 string 而已，并不是用 on 注册时，能在 emit 里推导出已有的事件名称字面量类型

[developit/mitt]: https://github.com/developit/mitt/tree/main
