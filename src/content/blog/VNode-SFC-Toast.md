---
title: 用 createVNode 封装一个 Toast
date: 2023-08-20
tags: [Vue]
---

### 开始

一直很想封装一个 Toast 来着，但想到用函数的形式来调用 `Toast('hello')`，才意识到这似乎有一点难搞，于是就去翻看了 element-plus 的实现：[el-message]

果然还是要用到函数式渲染的 createVNode 来调用组件 SFC，完整可见：[Github]

### Vue Plugin

我们按 “它是怎么被导入并调用” 的思路来理解源码

先从 [引入 element-plus] 的文档开始，它只要 import 并 `app.use(ElementPlus)` 就能使用了，而 [vue app.use] 指的是安装一个插件，[vue Plugin] 是一个有 `install()` 方法的用在 Vue 全局的工具代码

element-plus 是一个 monorepo，在 /packages 下是项目各个包的根目录，从 `import ElementPlus from 'element-plus'` 在仓库中找到 [/packages/element-plus] 这就是它的入口处。在 index.ts 中可以看出它导出了将所有组件和插件设为 vue installer 插件

```ts
// /packages/element-plus/default
import { makeInstaller } from './make-installer'
import Components from './component'
import Plugins from './plugin'

export default makeInstaller([...Components, ...Plugins])
```

顺着过去找到 makeInstaller 的定义，它的作用就是将这些组件们打包成一个 element-plus 插件，然后就可以在 vue 入口处使用了（app.use()）

```ts
/**
 * Create a component installer that installs all the components
 * @param components the components or plugins to install
 * @returns the plugin installer
 */
export function makeInstaller(components: Plugin[] = []) {
  return {
    install(app: App) {
      // already installed the plugin
      if ((this as any)[INSTALLED_KEY])
        return;
      (this as any)[INSTALLED_KEY] = true

      // install all components
      components.forEach((component) => {
        app.use(component)
      })
    },
  }
}
```

上面是它简化后的样子，其实他还有一个前置步骤是将组件包装成 vue 插件，然后再在这里全部导入（从 forEach 就可以看出，这就是文档说的 全量导入）。这时候我们再点进 `/packages/components` 里的一个组件（如 Message），可以看出它是这样写的

```ts
// 这其实引用的是本仓库的包，这就是 monorepo 的应用之一，用类似别名的方式，告别费脑子的相对路径
import { withInstallFunction } from '@element-plus/utils'
import Message from './src/method'

export const ElMessage = withInstallFunction(Message, '$message')
export default ElMessage
```

重点就是这个 `withInstallFunction`，它是将函数组件打包成可调用的关键，但我们先看看远处的组件引用再回过头来看就能更好地李姐了

### Component With Install

我们先换一个常规点的组件来看，例如 button，它的使用方式就是简单的 `<el-button/>` 就好了。在 button 的定义中，简化一下就是 `export const ElButton = withInstall(Button) // Button.vue`，这个 `withInstall` 写法如下

```ts
/**
 * @description mark a component as installable
 */
export type SFCWithInstall<T> = T & Plugin

/**
 * add install method to a component to register it globally
 * @param main the component (SFC.vue)
 * @returns the component with install method
 */
export function withInstall<T extends Component>(main: T) {
  const cp = main as SFCWithInstall<T>
  cp.install = (app: App) => {
    app.component(cp.name!, cp)
  }
  return cp
}
```

首先定义的类型是因为，其实有 [vue app.component()] 这样全局注册组件的方式，也就是说其实每个组件 SFC (\*.vue 文件) 都是可 install 的，但又不是每个 SFC 都是组件（defineComponent()），所以需要显示声明它的类型为 Plugin，同时必须要在 SFC 中指定它的名字

```vue
<script lang="ts" setup>
// 注意不要和 HTML 标签重名了，大小写不敏感，毕竟推崇的是 <my-button/> 的使用方法
defineOptions({
  name: 'MyButton',
})
</script>
```

所以这个函数做的就是全局注册这些组件，然后只要 `export const MyButton = withInstall(Button)` 就好，然后再统一在 components.ts 中导入并导出给 installer，最后只需要在 vue 的入口 main.ts 中 `app.use(installer)` 就完成了组件注册

这么做的原因是为了可以直接在入口处统一导入，而不用一次次地 `app.component()`

### Function With Install

如果想要以函数的方式来召唤组件，就要使用 createVNode 来创建组件。与组件注册不同的是，它是注册到全局方法中，并要为它指定全局上下文 context，以访问一些全局的信息（如依赖注入或是其他的 app.config.globalProperties 方法）

```ts
/**
 * @description mark a function as installable and add a context property
 */
export type SFCInstallWithContext<T> = SFCWithInstall<T> & {
  _context: AppContext | null
}

/**
 * @description add a function as a globalProperties and installable
 */
export function withInstallFunction<T>(fn: T, name: string) {
  const fnWithContext = fn as SFCInstallWithContext<T>;

  (fn as SFCWithInstall<T>).install = (app: App) => {
    fnWithContext._context = app._context
    app.config.globalProperties[name] = fn // use $name to access the function
  }

  return fnWithContext
}
```

至此，全局组件的封装大致就是这些了，接下来是如何用函数来调用组件

### createVNode

我们先写好 `Toast.vue`，并为了方便管理，将 props 抽离出来，以 [props 运行时声明] 的形式来写，再在 SFC 中 import

```ts
export const definePropType = <T>(val: any): PropType<T> => val

export const toastDefault = {
  id: '',
  message: '',
  type: 'info',
  appendTo: isClient ? document.body : (undefined as never),
  offset: 16,
  onClose: undefined,
} as const

export const toastProps = {
  message: {
    type: String,
    default: toastDefault.message,
  },

  type: {
    type: String,
    default: toastDefault.type,
  },

  onClose: {
    type: definePropType<() => void>(Function),
  },
  // ...
} as const
```

其中，为了能够给它完整的一生...命周期，用 `transition` 和 `v-show` 的形式绑定 hooks，这样就能在 Toast 消失后回收它，而不只是 `v-if`。毕竟每一个 Toast 都是一个新的实例，没用了就要销毁，不然可能会内存堆积（好像是吧）

```vue
<template>
  <transition name="fade" @before-leave="onClose" @after-leave="onDestroy">
    <div
      v-show="show"
      ref="toastRef"
      class="toast"
      :class="type"
      :style="{ top: `${offset}px` }"
    >
      {{ message }}
    </div>
  </transition>
</template>
```

那么要怎么调用这个生命 hook 呢？因为我们把它写在了 props 中，于是就要在调用方声明它

```ts
import ToastConstructor from './Toast.vue'

function createToast(
  { appendTo, ...options }: ToastParamsNormalized,
  context?: AppContext | null,
): ToastInstance {
  const container = document.createElement('div')
  const id = `toast-${id_++}`

  const props = {
    ...options,
    id,
    onClose: () => {
      rmInstance(id) // 会有一个专门的 instance.ts 来管理这些实例
    },
    onDestroy: () => {
      render(null, container) // 这样就能从 body 中移除这个标签了
    },
  }

  const vnode = createVNode(ToastConstructor, props)
  vnode.appContext = context || toast._context // 上文说的要指定它的 context

  render(vnode, container) // 渲染成 HTML

  // 当 destroy 的时候，gc 会自动回收这个 div 的
  appendTo.appendChild(container.firstElementChild!)

  // Toast.vue 组件本身，目的是为了能够获取它的一些信息
  // 如高度和 offset，这样才能让 Toast 们那位置排列好而不是叠在一起
  const vm = vnode.component!
  const instance: ToastInstance = {
    id,
    vm,
    vnode,
    props: (vnode.component as any).props,
  }
  instances.push(instance) // 先进先出，后来者在最下面

  return instance
}
```

### Toast Offset

Toast 通常是 `position: fix;`，为了不让创建出来的组件全堆在一起，我们需要为它指定 `top: ${offset}px`。这时候就需要维护一个 Toast 实例的数组，获取当前显示的 Toasts 中最后一个的 offset。并且这一切都得是响应式的，在先出的组件消失之后，后续的 offset 也要随之减少以适应位置

```ts
export const instances: ToastInstance[] = shallowReactive([])

export function getInstance(id: string) {
  const idx = instances.findIndex(item => item.id === id)
  const curr = instances[idx]
  let prev: ToastInstance | undefined
  if (idx > 0)
    prev = instances[idx - 1]

  return { curr, prev }
}

export function rmInstance(id: string) {
  const idx = instances.findIndex(item => item.id === id)
  if (idx === -1)
    return
  instances[idx].handler.close()
  instances.splice(idx, 1)
}

export function getLastOffset(id: string) {
  const { prev } = getInstance(id)
  if (!prev)
    return toastDefault.offset
  return prev.vm.exposed!.bottom.value // 来自 Toast.vue 的 defineExpose
}

export function getOffsetOrSpace(id: string, offset: number) {
  const idx = instances.findIndex(item => item.id === id)
  return idx > 0 ? toastDefault.offset : offset
}
```

然后在 Toast.vue 中堆计算属性就行（下面的示例忽略了计时器的处理）

```ts
import { useResizeObserver } from '@vueuse/core'

const toastRef = ref<HTMLElement>()
const height = ref(0)
// 上一个 Toast 的底部位置
const lastOffset = computed(() => getLastOffset(props.id))

// 这个 Toast 的 offset 就等于 上一个 bottom + 固定 offset
const offset = computed(
  () => getOffsetOrSpace(props.id, props.offset) + lastOffset.value,
)

// 这个 Toast 的底部位置
const bottom = computed((): number => height.value + offset.value)

useResizeObserver(toastRef, () => {
  // 获取 Toast 的高度
  height.value = toastRef.value!.getBoundingClientRect().height
})

defineExpose({
  bottom,
})
```

到这里，基本原理基本就是讲完了，但最重要的还是传参的设置与类型安全

### Toast Options Params

调用这个 Toast，可能有下面这些方式

```ts
Toast('hello') // default to info Toast

Toast({ message: 'hello', type: 'info' })

Toast.error({ message: 'error', duration: 4000 })
```

首先要将所有的参数都设为可选的 （Partial\<T\>），对于 type，虽然是 string，但要限定于 `'info' | 'error'` 等这些类型。这就是为什么要把 props 抽离出来，这也是为了方便管理这些参数

```ts
import type {
  AppContext,
  ComponentInternalInstance,
  ExtractPropTypes,
  VNode,
} from 'vue'

export type ToastType = 'info' | 'success' | 'warning' | 'error'

export type ToastProps = ExtractPropTypes<
  Omit<typeof toastProps, 'type'> & {
    readonly type?: ToastType // 这是为了将 string 类型转为上面那几种
  }
>

// 从 props 中排除掉 id 并全设为可选的
// 同时 appendTo 是在 createVNode 那边指定的，并不在 Toast.vue 中，所以要另外指定，这也是可选的
export type ToastOptions = Partial<Omit<ToastProps, 'id'>> & {
  appendTo?: HTMLElement
}

// Toast 的参数，string 或是 options 对象
export type ToastParams = ToastOptions | ToastOptions['message']

// 为了能够将纯 string 解析为原先默认的 options 对象
// 这里就全是必选的
export type ToastParamsNormalized = Omit<ToastProps, 'id'> & {
  appendTo: HTMLElement
}

// Toast 函数的返回，为了能让调用方手动提前 close
export interface ToastHandler {
  close(): void
}

// Toast 函数本体
export interface ToastFn {
  (options?: ToastParams, context?: AppContext | null): ToastHandler
}

// 包含 Toast 信息的实例
export interface ToastInstance {
  id: string
  props: ToastProps
  vm: ComponentInternalInstance
  vnode: VNode
  handler: ToastHandler
}
```

[ExtractPropTypes] 是为了能够将 props 转为类型，但体验下来还是 sxzz 写的 [buildProp] 好用很多

于是我们这么定义 toast 函数

```ts
export const toast: ToastFn &
  Partial<ToastFn> & { _context: AppContext | null } = (
    options = {},
    context,
  ) => {
    const norOptions = normalizeOptions(options) // 解析参数为 option 对象
    const instance = createToast(norOptions, context)

    return instance.handler
  }
```

在解析参数中，主要就是覆盖上默认参数了

```ts
function normalizeOptions(params?: ToastParams): ToastParamsNormalized {
  const options: ToastOptions
    = typeof params === 'string' || !params // 如果是纯 string，就套成对象
      ? { message: params }
      : params

  const normalized = {
    ...toastDefault,
    ...options, // 注意顺序，下面的覆盖上面的
  }

  // 默认推到 body 中
  if (!normalized.appendTo) {
    normalized.appendTo = document.body
  }
  // 不然就找选择器，但最后默认还是在 body
  else if (typeof normalized.appendTo === 'string') {
    let appendTo = document.querySelector<HTMLElement>(normalized.appendTo)
    if (!appendTo)
      appendTo = document.body
    normalized.appendTo = appendTo
  }

  return normalized as ToastParamsNormalized
}
```

### Migrate to Nuxt3

迁移到 Nuxt3 中第一个问题就是 app.use 没了，该怎么转换

好在这个本质上也是一个插件来的，只要定义到 Nuxt3 的插件上就行了。但由于用到了诸如 document 这样 SSR 没有的方法，最好将它注册为纯客户端插件。同时为了避免与自动导入等冲突了，最好还是将它另起目录，而不是一同在 ~/components 中

```ts
// ~/plugins/installCp.client.ts
import Components from '~/appCP'

export default defineNuxtPlugin((nuxtApp) => {
  const installer = makeInstaller([...Components])
  nuxtApp.vueApp.use(installer)
})
```

第二个就是 document not defined 了，这需要特判，`export const isClient = process.client` （eslint 或许会提示要用 node:process，但那就更冲突了，client 端是没有 node 的...... disable 就好 `/* eslint-disable n/prefer-global/process */`）

```ts
// 在 normalizeOptions 的使用 document 之前加上

if (!isClient) {
  normalized.appendTo = undefined as never
  return normalized as ToastParamsNormalized
}

// 在 props.ts 改一下
export const toastDefault = {
  // ...
  appendTo: isClient ? document.body : (undefined as never),
} as const
```

至此，基本就完成了

[el-message]: https://github.com/element-plus/element-plus/tree/dev/packages/components/message/
[Github]: https://github.com/Chilfish/learn-vue/tree/vue/src/components/Toast
[引入 element-plus]: https://element-plus.org/zh-CN/guide/quickstart.html
[vue app.use]: https://cn.vuejs.org/api/application.html#app-use
[vue Plugin]: https://cn.vuejs.org/guide/reusability/plugins.html
[/packages/element-plus]: https://github.com/element-plus/element-plus/tree/dev/packages/element-plus
[vue app.component()]: https://cn.vuejs.org/guide/components/registration.html#global-registration
[props 运行时声明]: https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props
[ExtractPropTypes]: https://cn.vuejs.org/api/utility-types.html#extractproptypes
[buildProp]: https://github.com/element-plus/element-plus/blob/e69f322b36f85c15698a78e6520f48838031e2b2/packages/utils/vue/props/runtime.ts#L45C24-L45C24
