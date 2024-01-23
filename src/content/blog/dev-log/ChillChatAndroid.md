---
title: Jetpack Compose Chat app
date: 2023-05-11
tags: [logs, Android]
category: blog
---

### 开始

总算是大致地学好了 Compose，现在终于新建文件夹了...... 这其实是安卓期末课设来着的，但队友不学安卓，他们整后端去了，那我就可以自由开发了 hhh

先大概地过了 XML 部分，RecycleView、Fragment 什么的一通嗦了，然后新建项目的时候被 AS 用 [DataBinding][DataBinding] 给吸引过去了。了解到是属于 [Jetpack][Jetpack] 的一部分后，以及顺便用 AS 迁移到了 Kotlin，补了点语法（一堆 api 和用法真完全是为了实用而开发的了），然后就正式地换用 Compose 来写了

当然，后来也是有用 Jetpack 组件 + XML 的方式来重构或练习了，但对比下来，还是 Compose 舒服多了

### Compose，Yes！

写了一整子的 demo，发现这太 React/Vue 的感觉了 hhh，特别像是组件以及它们的 [状态][Compose_State] 什么的。而且它也能写路由来跳转控制，不禁地想起了这不可以整 SPA 那样的单 Activity，其他的就用路由来导航了，进而地就是它的 [架构设计][Compose_Structure] 了

它会设计成 UI 与逻辑、数据分离的架构，Composable 函数就只负责绘制 UI；ViewModel 来存放页面的状态和数据，以及它们的事件；数据层方面，会用 Jetpack Room 来代替原生 SQLite，用 repository 来当做数据与 UI 的桥梁，像是从本地还是 api 获取数据什么的都由它来完成，再 export 出方法给 ViewModel 调用

而 Compose 推崇的是单向数据流，所有的对象基本只会实例化一次，然后通过像是函数参数那样向下传递，通过函数式编程的将函数当参数来向上传递事件来更改。同时地，它通常还会将可变变量设为 private，是能在类内修改，然后暴露不可变的值，外部只能通过调用成员函数来修改

<br />

开发时长：![wakatime](https://wakatime.com/badge/user/0842a71f-c026-4b09-8aa0-f8398b4c3423/project/eba71aa8-b520-4043-a683-355b918aa75c.svg)

### 复制照搬！

hh 其实在一开始写 XML 的时候就想好了期末选题，所以一直以来都在写 Chat 的界面，到 Composable 也是。所以只要复制过来再改改就好了，但为了舒服的 commits，还是按功能来拆分 commit 了）还好没全复制过来，因为后来新学好了 MVI 的架构，对于史来说的旧项目，还是得重构蛮久的

<figure align="center"><img src="/img/dev-log/commits.webp"/><figcaption>
  得亏有写过，直接搬组件过来就好）
</figcaption></figure>

然后是截至 5 月 11 号的 UI，但其实 UI 没写多少（都在之前学的时候写好了），主要是 Room 数据库和 ViewModel 这些的设计了

<figure align="center"><img src="/img/dev-log/screenshot_0511.webp"/><figcaption>
  Material 3，Yes！
</figcaption></figure>

> 先睡再说了）

### 05-12 -> 13

此时的 UI：

<figure align="center"><img class="w40" src="/img/dev-log/message.webp"/><figcaption>
  大概的样子）仿了
</figcaption></figure>

差不多就差插到 Room 里了，其他就先完成本地修改的吧，然后再处理 server 端

#### Room

一开始很蠢地为每个 Entity 都按流程地创 Dao、Repository 和 Database 实例，直到要 join 查表的时候才意识到应该是同一个 db 然后多个表才对（其实也是到实例化他们的时候觉得太怪了）

再就是明明已经 insert 进了 fake Data，但还是没创 db 一样，只有退出重进之后才会创文件，只好预先地在 init 中先 query 一遍

<figure align="center"><img src="/img/dev-log/repoProvider.webp"/><figcaption>
 还整了一个暴露出来的单例
</figcaption></figure>

再就是写着写着忘记应该异步来写了（虽然这协程就是为了异步）

<figure align="center"><img src="/img/dev-log/async.webp"/><figcaption>
  JS to Kotlin）
</figcaption></figure>

#### 路由......

比较难搞的点还是路由跳转的传参了......一开始想的就只是传 uid 然后在 ViewModel 再查 room，但想想这也太蠢了。但是翻了一遍虽然是可以传 Bundle 或 Parcelable 对象，但要么获取方法被弃用了，又或者必须安卓 13......而且可 null 的 argument Log 出来的一直都是 null 了

于是还是老实地换回了传 json 过去。但一大坑点就是如果数据包含 URL，而路由的格式就是以 URL 的 `/` 作为分隔的，就被认为了深层路由...... 所以再转 json 的时候需要先将 `/` 转为 `%2F` 这样的 URLEncode，然后再解码

#### 键盘又挡住了 input

不是说在 Manifest 中写好 `android:windowSoftInputMode="adjustResize"` 就能自动调整了嘛......哦我用 Scaffold 来布局啊，那还得再多写点

得手动为 input 的部分加 imePadding

```kotlin
val topBarState = rememberTopAppBarState()
Scaffold(
    contentWindowInsets = ScaffoldDefaults
        .contentWindowInsets
        .exclude(WindowInsets.ime)
) { padding ->
    Column(Modifier.fillMaxSize().padding(padding)) {
        UserInput(
            modifier = Modifier
                .navigationBarsPadding()
                .imePadding(),
        )
    }
}
```

> 这还是在 Compose 的 example —— [JetChat][JetChat] 中看到的，先放一个 yes！在这里

\> \_ \<

> 其实还是因为两星期没写了......

### MVI 架构

### 依赖注入！

依赖注入的主要目的是将对象的创建和配置与它们的使用分离开来，从而使代码更加灵活和可扩展。通过使用依赖注入，我们可以将对象的创建和配置委托给容器，容器负责管理对象的生命周期和依赖关系，而不是由对象自己来管理

在依赖注入中，我们可以使用不同的作用域来控制对象的生命周期。例如，`@Singleton` 注释可以将对象的生命周期限定为应用程序的整个生命周期，而 `@ActivityScoped` 注释可以将对象的生命周期限定为 Activity 的生命周期。在这种情况下，对象只会被实例化一次，并且在需要时自动引用这个实例

### 编辑信息

### Debug Page

### 比 Retrofit2 更好的网络请求 —— com.drake.net

### 连接 SocketIO

[DataBinding]: ../../../cs/android/XMLView/DataBinding.md
[Jetpack]: ../../../cs/android/Jetpack/README.md
[Compose_State]: ../../../gpt/android/ComposeState.md
[Compose_Structure]: ../../../gpt/android/ComposeStructure.md
[JetChat]: https://github.com/android/compose-samples/blob/main/Jetchat/app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt#L148-L150
