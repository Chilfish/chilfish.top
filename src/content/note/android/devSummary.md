---
title: 开发总览
date: 2023-03-14
tags: [note, android]
---

## 开始

每个 Android 应用都处于各自的安全沙盒中，并受以下 Android 安全功能的保护：

- Android 操作系统是一种多用户 Linux 系统，其中的每个应用都是一个不同的用户
- 默认情况下，系统会为每个应用分配一个唯一的 Linux 用户 ID（该 ID 仅由系统使用，应用并不知晓）。系统会为应用中的所有文件设置权限，使得只有分配给该应用的用户 ID 才能访问这些文件
- 每个进程都拥有自己的虚拟机 (VM)，因此应用代码独立于其他应用而运行
- 默认情况下，每个应用都在其自己的 Linux 进程内运行。Android 系统会在需要执行任何应用组件时启动该进程，然后当不再需要该进程或系统必须为其他应用恢复内存时，其便会关闭该进程

Android 系统实现了最小权限原则。换言之，默认情况下，每个应用只能访问执行其工作所需的组件，而不能访问其他组件。这样便能创建非常安全的环境，在此环境中，应用无法访问其未获得权限的系统部分（应用可以申请访问设备数据的权限）

一个安卓应用可以由这四种应用组件类型组成：Activity、服务、广播接收器、内容提供程序

### 应用组件

#### Activity

安卓的 activity 是安卓系统中的一个组件，用于管理用户界面和应用程序的交互，是用户交互的入口。它提供了一个窗口，用于展示应用程序的用户界面，并处理用户输入和系统事件。每个 activity 都必须有一个唯一的标识符，用于与其他组件进行通信

举例来说，当用户点击应用程序的图标时，系统会启动一个 activity，显示应用程序的主界面。当用户与应用程序交互时，activity 会接收和处理用户输入事件，并更新界面以反映用户的操作。当用户切换到另一个应用程序时，当前的 activity 会被暂停或停止，直到用户再次返回该应用程序

另外，activity 还可以启动其他 activity，从而实现多个界面之间的切换和交互。例如，一个图片浏览应用程序可能会有一个主界面 activity 和一个显示图片详细信息的 activity，当用户点击一张图片时，主界面 activity 会启动详细信息 activity，并将图片的信息传递给它

#### 服务

安卓的服务是一种在后台运行的组件，它可以执行一些长时间运行的操作，如播放音乐、下载文件、更新数据等。服务是在后台运行的，不会干扰用户的操作，可以在应用关闭后继续运行

安卓的服务有两种类型：前台服务和后台服务

- 前台服务是用户可以看到的服务，可以在通知栏中显示状态信息，如播放音乐时显示歌曲名、歌手等信息。前台服务需要持续通知用户服务正在运行，以保证用户知道该服务正在后台运行
- 后台服务是用户看不到的服务，可以执行一些不需要用户交互的任务，如下载文件、更新数据等。后台服务不需要通知用户服务正在运行，因为用户不需要知道这些信息

#### 广播

安卓的广播是一种系统级别的消息传递机制。它允许应用程序在系统中发送和接收消息。广播可以用来通知应用程序关于系统事件的信息，例如设备启动、网络连接状态的改变电池电量变化等

应用程序可以注册广播接收器来监听这些事件，从而能够作出相应的动作或者更新 UI 界面。广播机制是安卓系统中重要的组件之一，它可以帮助应用程序更好地与系统交互，提高应用程序的性能和用户体验

例如没在一个聊天应用中，可以有下面的广播程序

- 接收新消息的通知：聊天软件可以注册一个广播接收器，监听系统的网络状态变化，当有新消息到达时，应用程序会发送一个广播通知接收器，接收器收到通知后可以更新 UI 界面，显示新消息

- 发送消息的通知：当用户发送一条消息时，聊天软件可以通过广播机制发送一个广播，通知其他应用程序，例如通知栏，显示一条新消息

- 消息已读的通知：当用户阅读了一条消息后，聊天软件可以通过广播机制发送一个广播，通知其他应用程序例如服务器，将该消息的已读状态更新为已读

#### 内容提供程序

安卓的内容提供程序是一种**数据共享机制**，允许应用程序在不直接访问数据的情况下，通过请求其他应用程序或系统来获取数据。内容提供程序提供了一种标准化的方式来共享和访问数据，以便应用程序之间更好地协作和共享数据

举例来说，假设我们有一个名为“Contacts”的应用程序，它存储了用户的联系人信息。其他应用程序可以通过内容提供程序访问这些联系人信息，而不必直接访问“Contacts”应用程序的数据库。这样可以确保数据的安全性和一致性，并且其他应用程序不必了解“Contacts”应用程序的内部实现细节

另一个例子是安卓系统自带的内容提供程序，例如“MediaStore”。它提供了访问设备上的多媒体文件（如音频、视频和图片）的标准化接口。这样，其他应用程序可以使用“MediaStore”来获取设备上的多媒体文件，而不必了解设备上的文件系统结构和存储位置

## 项目开始

### 项目结构

根目录：

```bash
├── APPName.iml            # as用到的配置文件。不管它，as会自动修改它的
├── app                    # 应用相关的东西都在里面
│   ├── app.iml            # as用到的配置文件。不管它，as会自动修改它的
│   ├── build              # 编译的产物。某些情况下，可以手动把它整个删掉
│   ├── build.gradle       # 非常重要，app的构建配置。俗称“app的gradle文件”
│   ├── libs               # 依赖包可以放这里，比如一些jar文件
│   ├── proguard-rules.pro # 先不管。这个是混淆配置
│   └── src                # 代码在这。非常重要
├── build.gradle           # 很重要。项目级的配置。俗称“项目gradle文件”
├── gradle                 # 这个先不用管
├── gradle.properties      # 先不管
├── gradlew                # 先不管
├── gradlew.bat            # 先不管
├── local.properties       # 本地配置文件，一般不上传
└── settings.gradle        # gralde的项目级配置，先不管
```

源码一般在 `$ROOT/aoo/src/main/java` 中，同级目录的 res 为资源文件

<br>

> Java 安卓开发应该怎么组织项目的文件？例如 `.ui.activities` 来专门放 Activity 类，而在软件包根目录 . 中有一个与项目同名的类当做入口，那么这样的话，是不是可以根据当前 App 的状态来判断开屏应该启动哪个 Activity？

Java 安卓开发中，一般可以按照以下方式组织项目的文件：

- 在软件包根目录下，创建一个与项目同名的类作为入口，如 `MyApplication.java`，用于初始化应用程序的全局数据和配置

- 在软件包下创建一个 ui 包，用于存放所有的 Activity、Fragment 等用户界面相关的类，如`.ui.activities`、`.ui.fragments` 等

- 在软件包下创建一个 `utils` 包，用于存放一些工具类，如网络请求、图片加载、数据处理等

- 在软件包下创建一个 `model` 包，用于存放数据模型相关的类，如 JavaBean、数据库操作类等

- 在软件包下创建一个 `adapter` 包，用于存放适配器相关的类，如 RecyclerView 的 Adapter、ViewPager 的 Adapter 等

- 在软件包下创建一个 `service` 包，用于存放服务相关的类，如后台服务、IntentService 等

以上是一种常见的文件组织方式，但具体组织方式可以根据项目的需求和开发团队的习惯进行调整

关于启动 Activity 的问题，可以在 `MyApplication` 中添加一个方法，用于根据当前应用程序的状态来判断启动哪个 Activity。可以在 `onCreate()` 方法中初始化应用程序的全局数据和配置，然后在 `onResume()` 方法中判断应用程序的状态，并根据状态启动相应的 Activity

> 那么它是怎么知道我的入口文件在哪里？

在 Java 安卓开发中，应用程序的入口文件通常是在 `AndroidManifest.xml` 文件中声明的：

```xml
<application
  android:name=".MyApplication">
  ...
</application>
```

其中，`android:name` 属性指定了应用程序的入口文件为 `MyApplication `类。这样，在应用程序启动时，系统会自动创建 `MyApplication` 实例，并调用其 `onCreate()` 方法，从而初始化应用程序的全局数据和配置

> 那我要怎么在 MyApplication 类中启动程序呢？我想启动时就打开 aActivity

在 MyApplication 类中启动 aActivity，可以通过创建一个 `Intent 对象` 并调用 `startActivity()` 方法来实现。具体步骤如下：

在 MyApplication 类中获取当前应用程序的上下文 `Context` 对象，可以通过 `getApplicationContext()` 方法来获取。创建一个 Intent 对象，并指定要启动的 Activity 类。调用 `startActivity()` 方法启动 Activity

```java
public class Main extends Application {
  @Override
  public void onCreate() {
    super.onCreate();
    Intent intent = new Intent(getApplicationContext(), MainActivity.class);
    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    startActivity(intent);
    Log.d("HELLO", "HI~");
  }
}
```

- 其中，`setFlags()` 方法用于设置启动 Activity 的标志位，例如 `Intent.FLAG_ACTIVITY_NEW_TASK` 表示在新的任务中启动 Activity

需要注意的是，在 MyApplication 类中启动 Activity 时，需要先判断当前应用程序的状态，例如是否已经启动了其他 Activity 或者服务

如果当前应用程序已经启动了其他 Activity 或者服务，则不应该再启动 aActivity。可以通过 `ActivityLifecycleCallbacks` 和 `ServiceConnection `等接口来监听应用程序的状态变化，并在需要时启动 aActivity

### 清单文件

安卓的清单文件是 AndroidManifest.xml，它是一个 XML 文件，用于描述应用程序的基本信息、组件、权限、启动器等等。具体来说，它的作用包括：

- 定义应用程序的组件，包括 Activity、Service、BroadcastReceiver、Content Provider 等等

- 声明应用程序需要的权限，包括网络访问、读写文件、访问联系人等等

- 声明应用程序的启动方式，包括默认启动 Activity、应用程序的入口点等等

- 声明应用程序需要的硬件和软件特性，例如摄像头、蓝牙、GPS 等等

- 声明应用程序的版本信息、应用程序名称、图标等等

如果未在清单文件中声明源代码中包含的 Activity、服务和内容提供程序，则这些组件对系统不可见，因此也永远不会运行。不过，您可以 BroadcastReceiver 对象的形式，在清单中声明或在代码中动态创建广播接收器；以及通过调用 registerReceiver()，在系统中注册广播接收器

### 资源文件

除了源码外，安卓还有与源代码分离的资源，如图像、音频文件以及任何与应用的视觉呈现有关的内容

在 Android 项目中加入的每一项资源，SDK 构建工具均会定义**唯一的整型 ID**。例如一个 logo.png 的图像文件（保存在 `res/drawable/` 目录中），则 SDK 工具会生成名为 `R.drawable.logo` 的资源 ID。此 ID 映射到应用特定的整型数，可以利用它来引用该图像，并将其插入界面

其中资源文件的结构如下

- **layout**：用于存放布局文件，包括 XML 文件和 UI 界面的设计，例如 `activity_main.xml`

- **drawable**：用于存放图片资源，包括 png、jpg、gif 等格式的图片文件

- **values**：用于存放一些常量和字符串资源，例如：

  - **colors.xml**：用于定义应用程序中使用的颜色值

  - **dimens.xml**：用于定义应用程序中使用的尺寸值，例如控件的宽度和高度

  - **strings.xml**：用于定义应用程序中使用的字符串资源

  - **styles.xml**：用于定义应用程序中使用的样式，例如控件的背景颜色和字体大小等

  - **arrays.xml**：用于定义应用程序中使用的数组资源

  - **attrs.xml**：用于定义自定义控件的属性，例如自定义控件的背景颜色和边框大小等

  - **themes.xml**：用于定义应用程序中使用的主题样式，例如应用程序的主题颜色和字体大小等

- **mipmap**：用于存放应用程序图标和启动画面等不同密度的图片资源

- **anim**：用于存放动画效果的 XML 文件，例如 `fade_in.xml` 和 `rotate.xml` 等

- **menu**：用于存放菜单资源，例如 `menu.xml`

- **raw**：用于存放应用程序使用的原始文件，例如音频文件和视频文件

- **xml**：用于存放一些配置文件，例如 `preferences.xml` 等

- **font**：用于存放字体文件，例如 .ttf 和.otf 等

> 令见：[应用资源 概况](https://developer.android.com/guide/topics/resources/providing-resources)

### 换源

众所周知，使用包管理之前的第一步都是要换源）在 `~/.gradle/` 目录中创建文件 `init.gradle`，这里是全局配置。也可以在项目级的 `build.gradle` 中配置，并且它有可能会覆盖全局配置

```groovy
// gradle全局配置
settingsEvaluated { settings ->
    println "aliyun pluginManagement"
    settings.pluginManagement {
        repositories {
            maven { url "https://maven.aliyun.com/repository/gradle-plugin" }
            maven { url "https://maven.aliyun.com/repository/spring-plugin" }
            gradlePluginPortal()
        }
    }
}

buildscript {
    repositories {
        println "aliyun repositories"
        maven { url 'https://maven.aliyun.com/repository/google' }
        maven { url 'https://maven.aliyun.com/repository/central' }
        maven { url 'https://maven.aliyun.com/repository/public' }
    }

    allprojects {
        println "aliyun allprojects ${project.name}"
        repositories {
            maven { url 'https://maven.aliyun.com/repository/google' }
            maven { url 'https://maven.aliyun.com/repository/central' }
            maven { url 'https://maven.aliyun.com/repository/public' }
        }
    }
}
```
