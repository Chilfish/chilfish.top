---
title: Jetpack Compose
date: 2023-05-02
tags: [Android]
---

[组件](Components.md)、[ViewModel](ViewModel.md)、[数据层](DataLayer.md)、[DataStore](DataStore.md)

### 介绍

Jetpack Compose 是一种用于构建 Android 应用程序用户界面的现代工具包，它采用了声明式 UI 编程模型

1. **声明式 UI 编程模型**：Compose 采用了声明式 UI 编程模型，这意味着可以使用 Kotlin 编写 UI 代码，而不是使用 XML 文件或 Java 代码。这使得 UI 代码更加简洁、易于维护和测试，并且可以更轻松地实现复杂的 UI 交互

2. **更少的样板代码**：在 Compose 中，可以使用 Kotlin 中的函数和 Lambda 表达式来编写 UI 代码，这使得 UI 代码更加简洁，需要编写的样板代码更少

3. **更好的可组合性**：Compose 中的 UI 组件是可组合的，这意味着可以将它们组合在一起来构建复杂的 UI 界面。这使得 UI 代码更加模块化、易于维护和测试

4. **更好的性能**：Compose 使用了一些优化技术来提高 UI 渲染的性能。例如，Compose 使用了可观察的数据结构来避免不必要的 UI 重绘，并使用了协程来避免 UI 线程的阻塞

### 声明式 UI

声明式 UI 是一种 UI 编程模型，它允许使用声明性语法来描述应用程序的 UI，而不是编写命令式代码来操作 UI 元素。在声明式 UI 中，只需描述 UI 应该是什么样子的，而不必编写代码来实现它

声明式 UI 与传统的命令式 UI 编程模型有很大的不同。在传统的 UI 编程模型中，需要编写大量的命令式代码来操作 UI 元素，例如创建 UI 元素、设置属性、处理事件等等。这种编程模型往往会导致代码冗长、难以维护和测试，并且容易出现错误

相比之下，声明式 UI 更加简洁、易于维护和测试。在声明式 UI 中，只需描述 UI 应该是什么样子的，而不必编写代码来实现它。例如，在 Jetpack Compose 中，可以使用 Kotlin 代码来描述 UI 元素的结构和外观，例如：

```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}
```

在上面的代码中，`Greeting`是一个 Compose 组件，它接受一个`name`参数，并在 UI 中显示一个文本。`Text`是一个 Compose 组件，它用于显示文本

在声明式 UI 中，还可以使用状态来描述 UI 的变化。例如，在 Jetpack Compose 中，可以使用`remember`函数来创建一个可观察的状态，并使用`state`函数来访问它。例如：

```kotlin
@Composable
fun Counter() {
    val count = remember { mutableStateOf(0) }

    Button(onClick = { count.value++ }) {
        Text("I've been clicked ${count.value} times")
    }
}
```

在上面的代码中，`Counter`是一个 Compose 组件，它显示一个按钮和一个计数器。每次单击按钮时，计数器的值会增加，并在 UI 中显示

总的来说，声明式 UI 是一种更加简洁、易于维护和测试的 UI 编程模型，它可以使 UI 代码更加模块化、可组合和可重用。例如 React 和 Vue.js 以及其他端的 SwiftUI、Flutter 等主流的客户端开发框架都是声明式 UI

### 软件架构

在 Jetpack Compose 中，UI 和数据是紧密耦合的，这意味着 UI 的状态和数据的状态是一致的

**UI 层**

- Jetpack Compose 的 UI 层是由一系列的组件（Composables）构成的。每个组件都是一个函数，它们接收输入参数并返回一个 UI 元素。这些 UI 元素可以是简单的文本或图像，也可以是复杂的布局和交互式控件。Jetpack Compose 中的组件可以嵌套和组合，从而构建出复杂的 UI

- 同时，出于维护考虑，用于绘制 UI 的 Composable 函数最好仅仅只用来描述 UI，而不涉及复杂的逻辑（例如客户端表单验证等），这些通常会交给该页面的 ViewModel 来完成。它还是 UI 与数据之间的桥梁，不仅是用来设置该 Page 的 UI 逻辑，还是可以用来与数据进行交互

**数据层**

- Jetpack Compose 的数据层是由一系列的状态（State）和副作用（Effect）构成的。状态是可变的数据，它们可以在 UI 层和逻辑层之间共享。效果是一种异步操作，它们可以触发副作用或更新状态。在 Jetpack Compose 中，状态和效果是通过可观察对象（Observable）来实现的

#### 各层之间的交互

在 Jetpack Compose 中，UI 层、数据层和逻辑层之间的联系是通过函数调用和可观察对象来实现的

首先，UI 层和逻辑层之间的联系是通过函数调用来实现的

- 在 Jetpack Compose 中，每个 UI 组件都是一个函数，它们接收输入参数并返回一个 UI 元素。这些 UI 组件可以嵌套和组合，从而构建出复杂的 UI。逻辑层中的函数可以直接调用 UI 组件，从而更新 UI 的状态
- 例如，当用户点击一个按钮时，逻辑层的函数可以调用 UI 层的函数来更新按钮的状态或触发其他 UI 变化

其次，UI 层和数据层之间的联系是通过**可观察对象**来实现的，也就是所谓的 **观察者模式** 或是 **发布与订阅** 的模式

- 状态是可变的数据，它们可以在 UI 层和逻辑层之间共享。效果是一种异步操作，它们可以触发副作用或更新状态。当状态发生变化时，Jetpack Compose 会自动重新计算 UI 的状态，从而更新 UI
- 例如，当用户输入文本时，逻辑层的函数可以更新状态对象，从而触发 UI 的重新计算和更新
- 逻辑层的函数可以订阅状态和效果对象，从而响应状态和效果的变化。例如，当状态对象发生变化时，逻辑层的函数可以执行相应的操作，例如更新数据库或发送网络请求

#### UI 层与数据层

在 Jetpack Compose 中，UI 层和数据层之间的交互通常是通过 ViewModel 和 LiveData（现在是 Flow） 实现的

ViewModel 是一个用于管理 UI 层数据的类，它可以存储和管理应用程序的状态，并将状态更新通知给 UI 层。ViewModel 通常与 LiveData 一起使用，LiveData 是一个可观察的数据持有者，它可以在数据发生变化时通知观察者（现在更推用 Flow）

在 Jetpack Compose 中，可以使用`ViewModel`和`LiveData`来实现 UI 层和数据层之间的交互。例如，可以创建一个`ViewModel`类来存储应用程序的状态，并将状态暴露为`LiveData`对象。然后，在 Compose UI 中，可以使用`remember`函数来创建一个可观察的状态，并使用`observeAsState`函数来订阅`LiveData`对象的变化。例如：

```kotlin
class MyViewModel : ViewModel() {
    private val _count = MutableLiveData(0)
    val count: LiveData<Int>
            get() = _count

    fun incrementCount() {
        _count.value = _count.value?.plus(1)
    }
}

@Composable
fun MyScreen(viewModel: MyViewModel) {
    val count by viewModel.count.observeAsState(0)

    Column {
        Text("Count: $count")
        Button(onClick = { viewModel.incrementCount() }) {
            Text("Increment")
        }
    }
}
```

在上面的代码中，`MyViewModel`是一个`ViewModel`类，它包含了一个名为`count`的`LiveData`对象，用于存储计数器的值。`incrementCount`函数用于将计数器的值加 1

在`MyScreen`组件中，使用`remember`函数创建了一个可观察的状态`count`，并使用`observeAsState`函数订阅了`MyViewModel`中的`count`对象。每次单击按钮时，`MyViewModel`中的`count`对象的值会增加，并通知观察者（即`MyScreen`组件），`MyScreen`组件将更新

### 组件

Jetpack Compose 提供了一些用于构建 Android 应用程序用户界面的组件。这些组件可以分为两类：

1. 基础组件：这些组件是构建应用程序用户界面的基本构建块，例如`Text`、`Image`、`Button`、`TextField`等等

2. 布局组件：这些组件用于组合和排列基础组件，以构建复杂的用户界面，例如`Column`、`Row`、`Box`、`Stack`等等

除了这些组件之外，Jetpack Compose 还提供了一些用于处理状态、动画、手势和导航等方面的组件和工具

在 Jetpack Compose 中，UI 组件是可组合的，这意味着可以将它们组合在一起来构建复杂的 UI 界面。例如，可以将`Column`和`Row`组件组合在一起来构建一个复杂的布局，然后将`Button`和`TextField`等基础组件添加到布局中

#### 组件化

在 Jetpack Compose 中，UI 的组件化是通过函数的组合来实现的。每个 UI 组件都是一个函数，它们接收输入参数并返回一个 UI 元素。这些 UI 组件可以嵌套和组合，从而构建出复杂的 UI。组件之间的通信是通过函数调用和可观察对象来实现的

组件之间的通信可以分为两种类型：父子组件之间的通信和兄弟组件之间的通信

而 Compose 更推崇的是单向数据流，也就是组件的状态数据等只能是从上至下地传递，子组件只能通过事件或是说回调来提示父组件

- 父子组件之间的通信是通过**函数参数和返回值**来实现的。父组件可以将状态和事件传递给子组件，子组件可以将状态和事件传递回父组件。例如，一个父组件可以将一个状态对象传递给一个子组件，子组件可以更新状态对象并将更新后的状态传递回父组件

- 兄弟组件之间的通信是通过**共享状态对象**来实现的。在 Jetpack Compose 中，状态是可变的数据，它们可以在 UI 层和逻辑层之间共享。兄弟组件可以共享同一个状态对象，从而实现状态的共享和通信。例如，两个兄弟组件可以共享同一个状态对象，当其中一个组件更新状态时，另一个组件可以自动更新

组件的事件和状态是通过函数调用和可观察对象来和业务逻辑进行交互的。业务逻辑可以**订阅状态和效果对象**，从而响应状态和效果的变化。例如，当状态对象发生变化时，业务逻辑可以执行相应的操作，例如更新数据库或发送网络请求。业务逻辑也可以调用 UI 组件的函数来更新 UI 的状态或触发其他 UI 变化。例如，当用户点击一个按钮时，业务逻辑可以调用 UI 组件的函数来更新按钮的状态或触发其他 UI 变化

## GetStart

### 项目结构

在 Jetpack Compose 中，一个 Compose 项目的项目结构通常与传统的 Android 项目相似，但是有一些区别。下面是一个常见的 Compose 项目的项目结构：

```bash
app/
├── build.gradle
├── src/
│   ├── androidTest/
│   ├── main/
│   │   ├── java/
│   │   └── com.example.myapp/
│   │        ├── BaseActivity.kt
│   │        ├── MyApplication.kt
│   │        ├── ui/
│   │        │   ├── MyScreen.kt
│   │        │   └── components/
│   │        └── navigation/
│   └── test/
```

一般来说，我们需要在软件包的根目录设置项目的 Application 用作一些初始化设置（也要在 Manifest 中设置好 application 的 name）

为了主题的统一应用可以先套一层 BaseActivity

```kotlin
open class BaseActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        WindowCompat.setDecorFitsSystemWindows(window, false)
    }

    protected fun setContent(content: @Composable () -> Unit) {
        setContent(
            parent = null,
            content = {
              // 可替换成 /Theme/Theme.kt 中的设置
                ComposeTheme() {
                    content()
                }
            }
        )
    }

    protected inline fun <reified T : Activity> startActivity() {
        val intent = Intent(this, T::class.java)
        startActivity(intent)
    }
}
```

这样继承之后，就可以调用 setContent 来设置统一的主题了

### 页面设计

在页面设计中，完全可以用一个 Composable 函数来表示一个页面，也就是可以整想 SPA 那样的单 Activity 应用了。而不同页面之间的跳转就交给 Navigation 来设置路由，这实在是太 Crazy 了

虽然是这样，但为了维护性，通常会将一些单独的逻辑页面抽离成 Activity 或者是 Fragment，来减轻导航的成本。像是登录页、视频详情页等

同时，如果我们希望将某个页面作为一个独立的组件，来让其他 App 来启动，可以使用 Activity 来实现。例如，我们可以将一个视频详情页面作为一个独立的组件，然后将其导出为一个 Activity，这样其他应用就可以通过 Intent 来启动该页面（例如是通过视频的 ID）

而像是主页上，我们希望可以通过底部的导航栏或是 tabs 来切换页面，那么可以设置一个 MainApp，搭上脚手架

```kotlin
// MainActivity
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MainApp()
        }
    }

// MainApp.kt
@Composable
fun MainApp(
    modifier: Modifier = Modifier,
    navController: NavHostController = rememberNavController(),
) {
    Scaffold(
        modifier = modifier,
        topBar = { HomeBar() },
        bottomBar = { NavBar(navController) },
        content = { innerPadding ->
            ChillNavHost(
                navController = navController,
                modifier = Modifier.padding(innerPadding),
            )
        }
    )
}
```

至于另外的组件化和数据等就看别的了
