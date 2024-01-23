---
title: Kotlin
date: 2023-05-02
---

:::info
主要是 Android Compose 方面的 Kotlin
:::

## 数据类型

### 函数

委托类 -> val by

函数可以说是一等公民了，特别地函数式

匿名函数和 lambda 是完全区分开来的，前者的参数列表和返回值必须指定类型，即便逻辑上是可以自动推导出来的，而 Lambda 则不用。在 forEach 的例子中，更多地还是使用 lambda，虽然这时候的 return 就必须指定上 label：return@forEach 了，不然就直接将 for 外围的函数返回了（感觉又有些像 js 的 lambda 和 function 中 this 的关系 hhh）

## 协程

`lifecycleScope.launch` 是一个用于在 `LifecycleCoroutineScope` 中启动协程的方法。`LifecycleCoroutineScope` 是一个与 Lifecycle 绑定的协程作用域，它可以确保在 Lifecycle 销毁时取消所有正在运行的协程

例如使用 `lifecycleScope.launch` 来启动一个协程，该协程将在 LoginActivity 的生命周期内运行。这意味着，如果 LoginActivity 被销毁（例如，当用户离开该页面时），正在运行的协程将被自动取消

在协程中，我们可以使用挂起函数来执行异步操作，例如从 DataStore 读取数据。由于这些操作可能需要一些时间才能完成，因此我们需要在协程中执行它们，以避免阻塞主线程

总之，l`ifecycleScope.launch` 是一种在与生命周期绑定的协程作用域中启动协程的方法，它可以让我们在协程中执行异步操作，并确保在生命周期结束时取消所有正在运行的协程

`withContext(Dispatchers.IO)` 将协程的执行操作移至一个 I/O 线程，这样一来，我们的调用函数便是主线程安全的，并且支持根据需要更新界面

然后就可以实现点击登录后主线程更新 UI 成 Loading 动画，同时协程地处理网络 IO，拿到结果后再更新相应的主线程的 UI
