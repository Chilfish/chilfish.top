---
title: Dev logs
date: 2023-03-21
tags: [Android]
---

> 还不知道要怎么分类，那就还是先整在一起吧

## 布局

在原生 Android 中，有多种布局类型可供选择。这些布局类型包括线性布局、相对布局、帧布局、表格布局和约束布局

线性布局是一种单的布局类型，它将视图沿着水平或垂直方向排列。线性布局的优点是易于使用和理解，但缺点是不够灵活，不能很好地处理复杂的 UI 设计

相对布局是另一种常见的布局类型，它允许开发人员根据视图之间的相对位置来定位视图。相对布局的优点是可以轻松地创建复杂的 UI 设计，但缺点是可能会变得混乱和难以维护

帧布局是一种简单的布局类型，它允许开发人员将视图放置在屏幕上的任何位置。帧布局的优点是可以轻松地创建自定义 UI 设计，但缺点是可能会导致视图重叠和难以管理

表格布局是一种复杂的布局类型，它允许开发人员将视图放置在一个网格中。表格布局的优点是可以轻松地创建复杂的 UI 设计，但缺点是可能会变得混乱和难以维护

约束布局是最新的布局类型，它允许开发人员基于视图之间的关系来定位视图。约束布局的优点是可以轻松地创建杂的 UI 设计，并提供更好的性能和可读性，但缺点是可能需要花费更多的时间来学习和使用

总的来说，每种布局类型都适用于不同的情况。例如，线性布局适用于简单的 UI 设计，而约束布局适用于更复杂的 UI 设计。开发人员应该根据项目的需求和 UI 设计的要求选择最合适的布局类型

## UI 组件

- [列表和 Adapter](XMLView/Adapter.md)
- [自定义组件](XMLView/customView.md)
- [Fragment 组件](XMLView/Fragment.md)

## Others

### Context 类

在 Android 中，Context 是一个非常重要的类，它代表了应用程序的上下文环境。Context 类提供了许多有用的方法，例如获取应用程序的资源、启动 Activity、发送 Broadcast 等等。Context 类也是 Android 中的四大组件(Activity、Service、BroadcastReceiver、ContentProvider)的基础类，每个组件都会持有一个 Context 对象

Context 的继承示意

```txt
Context
├── ContextImpl
└── ContextWrapper
    ├── Application
    ├── ContextThemeWrapper
    │   └── Activity
    └── Service
```

Context 类通常被用于获取应用程序的全局信息，例如应用程序的包名、文件路径、资源目录等等。通过 Context 类，我们可以获取 Android 系统的各种资源，例如获取 SharedPreferences、获取系统服务等等。Context 类还可以用于启动 Activity、发送 Broadcast、启动 Service 等等

#### 作用域与生命周期

Context 的作用域包括应用程序级别和组件级别。应用程序级别的 Context 通常是指 Application Context，它是全局唯一的，生命周期与应用程序一致，可以在任何地方使用。组件级别的 Context 则是指 Activity Context、Service Context、BroadcastReceiver Context 等，它们的生命周期与组件的生命周期相关联，只能在组件内部使用

Context 的生命周期取决于它所属的组件的生命周期。比如，Application Context 的生命周期与应用程序一致，而 Activity Context 的生命周期与 Activity 相关联，当 Activity 被销毁时，它的 Context 也会被销毁。因此，在使用 Context 时，需要注意它的生命周期，避免造成内存泄漏等问题

一般来说，获取 assets 文件、sharedPreference 等全局属性时，我们会使用 Application Context。因为 Application Context 是全局唯一的，生命周期与应用程序一致，而且不会随着 Activity 的销毁而被销毁，因此可以安全地在整个应用程序中使用

获取 Application Context 的方法有很多种，比如可以通过 `getApplicationContext()` 方法获取。在 Activity 中，也可以通过 `this.getApplication()` 方法获取 Activity 所在的 Application 对象，进而获取 Application Context。需要注意的是，如果在 Activity 中使用了 Activity Context 来获取全局属性，可能会导致内存泄漏等问题，因此应该尽量使用 Application Context

所以就可以 **在程序的入口类** 中定义一个 **全局的静态 Application Context**，来获取与应用关联的全局属性

```java
public class Main extends Application {
  @SuppressLint("StaticFieldLeak")
  public static Context AppCONTEXT;

  @Override
  public void onCreate() {
    super.onCreate();
    AppCONTEXT = getApplicationContext();

    Intent intent = new Intent(AppCONTEXT, MainActivity.class);
    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    startActivity(intent);
  }
}
```

之后像是获取 SharedPreference 就可以直接引用这个静态成员

```java
import static com.example.Main.AppCONTEXT;

SharedPreferences SP = AppCONTEXT.getSharedPreferences("profile", Context.MODE_PRIVATE);
```
