---
title: Fragment 组件
date: 2023-03-26
tags: [note, android]
---

[Fragment in XML View](XMLView/Fragment.md)

## 概念

安卓的 Fragment 是一种可以嵌入在 Activity 中的 **UI 组件**，它可以帮助开发者更加灵活地管理应用的 UI 界面，实现动态添加、移除和替换 UI 组件等功能

Fragment 的主要作用包括：

- 实现灵活的 UI 布局：通过将 UI 界面划分为多个 Fragment，可以更加灵活地组合和管理 UI 布局，适应不同屏幕尺寸和设备方向的变化

- 实现模块化开发：将应用的不同模块拆分为多个 Fragment，可以更加方便地进行模块化开发和维护，提高代码的复用性和可维护性

- 实现动态添加和替换 UI 组件：通过 Fragment 的生命周期和管理方法，可以方便地动态添加、替换和移除 UI 组件，实现动态 UI 效果和交互效果

### 组件化

也就是说，它更像是一个微缩的 Activity，并且多个 Fragment 组合起来形成一个完整的 Activity。Fragment 是一种组件，是 Android 系统提供的一种 UI 管理机制，用于实现复杂的 UI 布局和界面切换。而自定义 View 则是一种控件，是继承自 View 的自定义类，用于实现特定的 UI 效果和交互行为

两者的主要区别在于，Fragment 主要用于组织和管理 UI 界面，而自定义 View 则主要用于实现特定的 UI 效果和交互行为

例如，如果要做导航栏，那肯定不是来回切换 Activity 或者别的，而是切换 Fragment。同时还能在绘制 Fragment 之前载入参数 arguments，来达到组件的状态管理

这一点就很像 React 中的 props（属性）和 state（状态）的概念。在 React 中，组件通过 props 来接收父组件传递过来的参数，通过 state 来管理组件自身的状态

### 组件之间的通信

同样地，在 Android 中，Fragment 通过 `getArguments()` 方法获取到父组件传递过来的参数，通过 `setArguments()` 方法设置自身的参数。这种方式都是为了实现组件之间的数据传递和状态管理，从而实现不同的业务需求

同时，组件之间的通信还可以通过：

- **通过接口回调通信**：定义一个接口，在 Fragment 中实现该接口，并在 Activity 中实例化 Fragment 时将 Activity 自身传递给 Fragment，然后在 Fragment 中调用 Activity 实现的接口方法来实现通信

- **通过广播通信**：在 Fragment 中发送广播，Activity 中注册广播接收器并接收广播，从而实现通信

- **通过 EventBus 通信**：可以使用 EventBus 发送事件，在其他组件中注册事件监听器来接收事件，从而实现通信

- **通过 ViewModel 通信**：多个 Fragment 可以共享同一个 ViewModel 实例，从而实现通信

### 组件自身的状态管理

**组件的状态管理**是指如何在组件中管理和维护数据和状态。在应用程序中，组件通常需要保存一些数据和状态，例如**用户输入的数据、组件的显示状态**等等。如果没有良好的状态管理机制，这些数据和状态可能会被错误地处理或丢失，从而导致应用程序出现各种问题

举个例子，比如一个购物车的应用程序，用户可以在不同的页面中添加商品到购物车中。如果购物车的数据不进行状态管理，当用户跳转页面或者退出应用程序后，购物车中的商品数据可能会丢失或者重复添加。因此，需要在购物车组件中使用状态管理机制，来管理购物车中的商品数据，从而保证购物车的正常运行

而在 React 中，组件的状态管理通常是通过 state 来实现的。组件的 state 是组件内部的状态，可以用来保存组件的数据和状态。通过 setState 方法可以修改组件的 state，从而更新组件的显示状态

使用状态管理可以使得组件的代码更加清晰和易于维护。例如，如果需要在组件中保存一些数据，可以将这些数据保存在组件的 state 中，然后在组件的 render 方法中使用这些数据来渲染组件的界面。当这些数据发生变化时，只需要调用 setState 方法来更新组件的 state，React 会自动重新渲染组件的界面，从而更新组件的显示状态

而 Fragment 组件自身的状态管理可以：

- **通过 Bundle 保存和恢复状态**：例如在 Fragment 的 `onSaveInstanceState` 和 `onActivityCreated` 方法中分别保存和恢复状态

- **通过 ViewModel 管理状态**：多个 Fragment 可以共享同一个 ViewModel 实例，从而实现状态共享和管理

- **通过 `SharedPreferences` 保存和恢复状态**：例如在 Fragment 的 `onSaveInstanceState` 和 `onActivityCreated` 方法中分别保存和恢复状态

- **通过数据库管理状态**：可以使用数据库来管理状态，例如在 Fragment 中使用 SQLite 数据库来保存和恢复状态
