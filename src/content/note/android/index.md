---
title: Android 开发
date: 2023-03-14
tags: [note, android]
---

> 由 GPT 与 GitHub Copilot 强力驱动

### Tips | Notes

- [安卓开发总览](devSummary.md)
- [Logs](Logs.md)
- [获取文件 IO](FileIO.md)
- [Fragment](Fragment.md)

**XML View**

- [Adapter](XMLView/Adapter.md)
- [自定义组件](XMLView/customView.md)
- [Fragment 组件](XMLView/Fragment.md)
- [DataBinding](XMLView/DataBinding.md)
- [用 java 控制 view 属性](XMLView/Java4Views.md)

> 在接触到 DataBinding 时，开始用的时候觉得很方便，超大重构之后被 Jetpack 给吸引过去了，先是换到了 Kotlin，然后现在就在用 Compose 了，所以 XML 的部分就不大用得到了 hh

**Jetpack Compose**

- [介绍](Jetpack/index.md)
- [组件化](Jetpack/Components.md)
- [ViewModel](Jetpack/ViewModel.md)
- [数据层](Jetpack/DataLayer.md)
- [DataStore](Jetpack/DataLayer.md)

<br />

### SDK、NDK、AVD、ADB

**SDK（Software Development Kit）**

- SDK 是安卓开发的必备工具，它包含了开发安卓应用所需的各种开发工具、代码库、模拟器等等。SDK 提供了一系列 API，开发者可以使用这些 API 来构建自己的应用

**NDK（Native Development Kit）**

- NDK 是一个用于开发 C/C++ 代码的工具集，可以用于开发一些高性能的应用，比如游戏、图像处理等。NDK 提供了一些专门的工具和 API，可以让开发者使用 C/C++ 语言来编写安卓应用的核心部分

**AVD（Android Virtual Device）**

- AVD 是安卓模拟器，可以在开发者的电脑上模拟安卓设备的运行环境，开发者可以在 AVD 上测试自己的应用。AVD 可以模拟不同的设备、不同的安卓版本和不同的屏幕分辨率等等，以便开发者能够测试自己的应用在各种情况下的表现

**ADB（Android Debug Bridge）**

- 是一种命令行工具，用于在开发者的电脑和安卓设备之间进行通信和调试。开发者可以使用 ADB 来安装、卸载、调试应用程序、管理设备、查看日志以及执行其他各种任务

- ADB 可以通过 USB 连接或者 Wi-Fi 连接来连接开发者的电脑和安卓设备。开发者可以在电脑上使用 ADB 命令来控制设备，例如安装应用程序、启动应用程序、复制文件到设备等等。同时，开发者也可以使用 ADB 命令来查看设备的状态信息、日志信息等等，以便更好地调试自己的应用程序

### API 安卓版本

安卓 API level 是指安卓系统提供的一组应用程序接口（API）的版本号。每个 API level 都包含了一系列的新特性、改进和 bug 修复，以及对之前版本的 API 的兼容性支持。开发者可以根据 API level 来确定所使用的 API 是否可用，并在不同的 API level 上进行开发和测试

![<a target="_blank" href="https://developer.android.com/guide/topics/manifest/uses-sdk-element">谷歌文档：API level</a>](/blog/cs/API-Level.webp)

### 处理器架构

当前安卓处理器的主要架构有 ARM、x86 和 MIPS

- **ARM 架构**：ARM 架构是目前最常见的处理器架构，它采用精简指令集（RISC）设计，具有低功耗、高性能、低成本等特点，广泛应用于移动设备、智能家居、工业控制等领域

- **x86 架构**：x86 架构是传统 PC 处理器架构，它采用复杂指令集（CISC）设计，具有较高的性能和兼容性，但功耗较高，主要应用于台式机、笔记本电脑等领域。目前 x86 架构在 Android 设备市场中的份额相对较小，因为大多数 Android 设备都使用 ARM 架构的处理器。<br> 但是，随着 Intel 在移动领域的发展和应用程序的不断优化，x86 架构在 Android 设备中的使用逐渐增多，特别是在一些平板电脑和 2 合 1 笔记本电脑中，x86 架构的 CPU 已经成为常见的选择之一

- **MIPS 架构**：MIPS 架构是一种 RISC 类型的处理器架构，主要应用于嵌入式系统、路由器、游戏机等领域，具有低功耗、高性能、高可靠性等特点

其中，Arm 架构是当前安卓手机的主流，各架构之间的安装包不兼容。其中，Arm 又分为：

- **armeabi-v7a** 是 ARM 架构的一种变体，它是 ARMv7 指令集的一个子集。它是 32 位 ARM 处理器的一种，支持浮点运算和 NEON 指令集，适用于大多数当前的 Android 设备。在 Android 开发中，armeabi-v7a 是常用的 CPU 架构之一，可以在大多数 Android 设备上运行。但是，一些较老的 Android 设备可能不支持它，因此需要提供其他 CPU 架构的版本以确保应用程序的兼容性

- **arm64-v8a** 是 ARM 架构的最新版本，它是 ARMv7 的后继者，引入了 64 位指令集。与之前的 32 位 ARMv7 不同，ARMv8 指令集支持 64 位地址和数据，可以提供更高的处理能力和更大的内存访问空间。同时，ARMv8 还引入了新的虚拟化和安全功能，以支持更高的安全性和可靠性。在 Android 设备中，支持 ARMv8 的 CPU 架构为 arm64-v8a，它可以提供更高的性能和更好的能耗管理，同时也支持 32 位应用程序的兼容性

> 这下看懂了 Release 里的安装包们了
