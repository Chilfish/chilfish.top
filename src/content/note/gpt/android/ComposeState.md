---
title: Compose 的组件状态
date: 2023-04-21
tags: [GPT]
---

> 感觉这里的“状态”都很像 React 的 Status、Vue 的 Ref 这样的概念

没错，Jetpack Compose 中的状态(State)和 React 中的状态(State)、Vue 中的 Ref 概念非常相似。它们都是用于管理 UI 中的数据，当数据发生变化时，UI 会自动更新

在 Jetpack Compose 中，状态是可变的，可以通过`mutableStateOf()`方法来创建。例如，下面的代码创建了一个名为 count 的状态，初始值为 0：

```kotlin
var count by remember { mutableStateOf(0) }
```

在 UI 中使用该状态，可以直接将其作为参数传递给 Compose 组件，如：

```kotlin
Text(text = "Count: $count")
```

当该状态发生变化时，UI 会自动更新

需要注意的是，状态的变化只能在 Compose 函数内部进行，而不能在函数外部进行。如果需要在函数外部修改状态，可以使用`rememberSaveable()`方法，它会将状态保存在组件的状态恢复栈中，以便在组件被重建时恢复状态。例如：

```kotlin
var count by rememberSaveable { mutableStateOf(0) }
```

这样，在组件被重建时，count 的值会被恢复。但需要注意的是，由于状态的保存和恢复需要一定的时间，因此使用`rememberSaveable()`方法可能会导致 UI 的性能下降，应该谨慎使用

> 那我应该也能用 React 的那套思想来编码

是的，如果你已经熟悉了 React 中的状态管理和组件化思想，那么在使用 Jetpack Compose 时也可以借鉴这些思想

例如，在 React 中，我们通常会将组件分成两种类型：有状态组件和无状态组件。有状态组件包含自己的状态(State)，可以响应用户的交互事件和数据变化；而无状态组件则只负责展示 UI，没有自己的状态

在 Jetpack Compose 中，也可以根据需要将组件分成这两种类型。有状态组件可以使用`@Composable`注解来定义，同时定义一个或多个状态并在组件内部使用；而无状态组件则可以直接定义一个函数，使用`@Composable`注解来标记

例如，下面的代码定义了一个有状态组件`Counter`，它包含一个名为`count`的状态和一个名为`onCountChange`的回调函数：

```kotlin
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }

    fun onCountChange(newCount: Int) {
        count = newCount
    }

    Button(onClick = { onCountChange(count + 1) }) {
        Text(text = "Count: $count")
    }
}
```

在这个组件中，我们使用`mutableStateOf()`方法创建了一个名为`count`的状态，并在`Button`组件的`onClick`回调函数中调用了`onCountChange()`函数来修改`count`的值

需要注意的是，由于 Jetpack Compose 是基于函数式编程的思想来设计的，因此在组件中应该避免使用可变的全局变量或静态变量，而应该尽可能地将状态和逻辑封装在组件内部。这样可以使组件更加独立和可复用

> 能理解，那它组件之间是怎么通信的呢

在 Jetpack Compose 中，组件之间的通信可以通过参数、回调函数和状态共享来实现

首先，组件可以通过参数来接收外部传递的数据，例如：

```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}
```

在这个组件中，我们定义了一个名为`Greeting`的无状态组件，并通过参数`name`来接收外部传递的数据

其次，组件之间也可以通过回调函数来实现通信。例如：

```kotlin
@Composable
fun Counter(onCountChange: (Int) -> Unit) {
    var count by remember { mutableStateOf(0) }

    fun increaseCount() {
        count++
        onCountChange(count)
    }

    Button(onClick = { increaseCount() }) {
        Text(text = "Count: $count")
    }
}
```

在这个组件中，我们定义了一个名为`Counter`的有状态组件，并通过回调函数`onCountChange`来将`count`的值传递给外部组件

最后，组件之间也可以通过状态共享来实现通信。例如：

```kotlin
val counterState = remember { mutableStateOf(0) }

@Composable
fun Counter() {
    Button(onClick = { counterState.value++ }) {
        Text(text = "Count: ${counterState.value}")
    }
}

@Composable
fun DisplayCount() {
    Text(text = "Count: ${counterState.value}")
}
```

在这个例子中，我们使用`remember()`方法创建了一个名为`counterState`的状态，并在`Counter`组件和`DisplayCount`组件中共享了这个状态。当`Counter`组件中的按钮被点击时，`counterState`的值会发生变化，从而也会影响到`DisplayCount`组件中的 UI 展示

需要注意的是，状态共享是一种非常方便的组件通信方式，但也需要谨慎使用，因为过度的状态共享可能会导致组件之间的耦合度过高，从而影响代码的可维护性和可复用性。在使用状态共享时，应该尽可能地将状态的作用范围控制在需要共享的组件之间

> 它是 prop 似的单向数据流吗

是的，可以将 Jetpack Compose 中的数据流看作类似于 React 中的单向数据流，即数据只能从父组件传递到子组件，而不能反向传递

在 Jetpack Compose 中，父组件可以通过参数的形式将数据传递给子组件，而子组件只能通过回调函数的形式将数据传递给父组件，不能直接修改父组件的数据。这种单向数据流的设计可以使组件之间的数据流更加清晰和可控

例如，在下面的代码中，我们定义了一个名为`Counter`的有状态组件，并通过参数`count`来接收父组件传递的数据。当`Counter`组件中的按钮被点击时，我们通过回调函数`onCountChange`将新的`count`值传递给父组件：

```kotlin
@Composable
fun Counter(count: Int, onCountChange: (Int) -> Unit) {
    Button(onClick = { onCountChange(count + 1) }) {
        Text(text = "Count: $count")
    }
}
```

在父组件中，我们可以通过`remember()`方法来创建一个名为`count`的状态，并将其作为参数传递给`Counter`组件。当`Counter`组件中的按钮被点击时，我们可以通过回调函数来修改父组件中的`count`状态：

```kotlin
@Composable
fun MyScreen() {
    var count by remember { mutableStateOf(0) }

    Counter(count = count, onCountChange = { newCount ->
        count = newCount
    })
}
```

需要注意的是，由于 Jetpack Compose 是基于函数式编程的思想来设计的，因此在组件之间传递数据时，应该尽可能地使用不可变的数据类型，以避免出现意外的副作用。同时，也应该尽量避免在组件之间传递过于复杂的数据结构，以保持代码的可读性和可维护性

> 这里第一个参数是父组件传下去的，而回调中的 newCount 是子组件传上来的

非常抱歉，是我说错了，回调中的`newCount`是子组件传递给父组件的数据，确实是子组件传上来的。感谢你的指正

在上面的例子中，`count`是父组件传递给`Counter`组件的数据，而`onCountChange`是父组件传递给`Counter`组件的回调函数。当`Counter`组件中的按钮被点击时，它会调用`onCountChange`回调函数，并将新的`count`值作为参数传递给该函数。父组件中的回调函数会更新`count`状态的值，从而实现了数据的双向绑定

需要注意的是，虽然 Jetpack Compose 中的数据流是单向的，但通过回调函数的形式，可以实现数据的双向绑定。这种双向绑定的实现方式也可以使组件之间的数据流更加清晰和可控

> 好的，那么 rememberSaveable 是？

`rememberSaveable`是 Jetpack Compose 中的一个状态管理函数，它可以用于创建可保存的状态，以便在组件被销毁或重建时保存和恢复状态

在 Jetpack Compose 中，当一个组件被销毁或重建时，它的状态会丢失，这可能会导致用户体验的不连贯或数据的丢失。为了解决这个问题，Jetpack Compose 提供了`rememberSaveable`函数，它可以将状态保存在组件的状态恢复栈中，以便在组件被重建时恢复状态

`rememberSaveable`函数的用法和`remember`函数类似，它也接受一个 lambda 表达式作为参数，该表达式返回一个状态对象。例如：

```kotlin
var count by rememberSaveable { mutableStateOf(0) }
```

在这个例子中，我们使用`rememberSaveable`函数创建了一个名为`count`的状态，并将其初始值设置为 0。当组件被销毁或重建时，`count`的值会被保存在状态恢复栈中，以便在组件被重建时恢复

需要注意的是，由于状态的保存和恢复需要一定的时间，因此使用`rememberSaveable`函数可能会导致 UI 的性能下降，应该谨慎使用。同时，也应该注意将状态的作用范围控制在需要保存和恢复的组件之间，以避免出现意外的副作用

> 具体例子可以理解为是填写表单时，跳到二级页面再返回后原本的数据就没了，是吗？

是的，你可以将`rememberSaveable`函数看作是解决类似于填写表单时数据丢失的问题的一种方式

假设你有一个表单页面，用户可以在该页面上填写一些信息。当用户点击“提交”按钮时，你需要将用户填写的信息保存到数据库中。但是，如果用户在填写表单的过程中，意外离开了页面，或者页面被销毁或重建了，用户填写的信息就会丢失，这可能会导致用户体验的不连贯或数据的丢失

为了解决这个问题，你可以使用`rememberSaveable`函数来保存用户填写的信息。例如：

```kotlin
data class UserInfo(
    val name: String,
    val age: Int,
    val email: String,
    // ...
)

@Composable
fun UserInfoForm() {
    var userInfo by rememberSaveable { mutableStateOf(UserInfo("", 0, "")) }

    // ...

    // 保存用户信息
    fun saveUserInfo() {
        // 将userInfo保存到数据库中
    }

    // ...
}
```

在这个例子中，我们使用`rememberSaveable`函数创建了一个名为`userInfo`的状态，并将其初始值设置为空的`UserInfo`对象。当用户填写完表单后，我们可以通过回调函数或其他方式来更新`userInfo`的值

当用户离开页面或页面被销毁或重建时，`userInfo`的值会被保存在状态恢复栈中。当用户重新进入页面时，`userInfo`的值会被自动恢复，从而保证用户填写的信息不会丢失

需要注意的是，虽然`rememberSaveable`函数可以解决数据丢失的问题，但它也可能会导致 UI 的性能下降，因此应该谨慎使用。同时，也应该注意将状态的作用范围控制在需要保存和恢复的组件之间，以避免出现意外的副作用

> 在状态管理中，请为 rememberSaveable 的使用举个简单的例子

当我们使用 Jetpack Compose 构建 UI 时，通常需要使用一些状态来控制 UI 的展示和行为。而这些状态可能会在屏幕旋转、进入后台等情况下被销毁，这时候我们就需要使用`rememberSaveable`来保存这些状态并在恢复时重新加载

举个简单的例子，假设我们需要在屏幕上显示一个计数器，每次点击按钮计数器就会增加 1。我们可以使用`rememberSaveable`来保存计数器的值，如下所示：

```kotlin
@Composable
fun Counter() {
    var count by rememberSaveable { mutableStateOf(0) }
    Button(onClick = { count++ }) {
        Text("Count: $count")
    }
}
```

在上面的代码中，我们使用了`rememberSaveable`来保存计数器的值。每次点击按钮时，计数器的值会增加 1。当屏幕旋转或进入后台时，`rememberSaveable`会将计数器的值保存下来。当我们再次返回到应用时，计数器的值会被恢复

需要注意的是，`rememberSaveable`只能用于保存一些简单的状态，如果需要保存复杂的状态，比如包含自定义对象等，需要自己实现`Parcelable`或`Serializable`接口来进行序列化和反序列化

> 似乎还能用 saver 来自定义规则

是的，`rememberSaveable`函数还可以接收一个`saver`参数，用于自定义状态的保存和恢复规则

`saver`是一个函数类型，接收状态值作为参数，返回一个`Saver`对象。`Saver`对象用于保存和恢复状态值。`Saver`对象有两个方法：`restore()`和`save()`。`restore()`方法用于从 Bundle 中恢复状态值，`save()`方法用于将状态值保存到 Bundle 中

下面是一个自定义`saver`的例子，假设我们需要保存一个包含姓名和年龄的用户对象：

```kotlin
data class User(val name: String, val age: Int)

fun UserSaver(): Saver<User, Bundle> = Saver(
    save = { user -> Bundle().apply { putString("name", user.name); putInt("age", user.age) } },
    restore = { bundle -> User(bundle.getString("name")!!, bundle.getInt("age")) }
)

@Composable
fun UserForm() {
    var user by rememberSaveable(saver = UserSaver()) { mutableStateOf(User("", 0)) }
    TextField(
        value = user.name,
        onValueChange = { user = user.copy(name = it) },
        label = { Text("Name") }
    )
    TextField(
        value = user.age.toString(),
        onValueChange = { user = user.copy(age = it.toIntOrNull() ?: 0) },
        label = { Text("Age") }
    )
}
```

在上面的代码中，我们定义了一个`UserSaver`函数，用于将`User`对象保存到 Bundle 中并从 Bundle 中恢复。然后在`rememberSaveable`函数中使用了这个`saver`。这样，当我们在屏幕旋转或进入后台时，用户对象的状态就会被保存下来并在恢复时重新加载

> 这不是有 ListSaver 和 MapSaver 吗

是的，Jetpack Compose 提供了一些默认的`saver`，包括`ListSaver`和`MapSaver`，用于保存和恢复`List`和`Map`类型的状态

`ListSaver`用于保存和恢复`List`类型的状态，`MapSaver`用于保存和恢复`Map`类型的状态。这些`saver`都是通用的，不需要为每个具体的`List`或`Map`类型实现自定义`saver`

下面是一个使用`ListSaver`的例子，假设我们需要保存一个包含字符串的列表：

```kotlin
@Composable
fun TextList() {
    val (textList, setTextList) = rememberSaveable { mutableStateOf(emptyList<String>()) }
    Column {
        Row {
            Button(onClick = { setTextList(textList + "Text") }) {
                Text("Add Text")
            }
            Button(
                onClick = { setTextList(textList.dropLast(1)) },
                modifier = Modifier.padding(horizontal = padding)
            ) {
                Text("Pop Text")
            }
            Button(onClick = { setTextList(emptyList()) }) {
                Text("Clear Text")
            }
        }
        TextListView(textList = textList)
    }
}

@Composable
fun TextListView(textList: List<String>) {
    Column {
        textList.forEach { text ->
            Text(text)
        }
    }
}
```

在上面的代码中，我们使用了`ListSaver<String>()`来保存和恢复一个包含字符串的列表。每次用户添加一个新的字符串时，列表会被更新，并在屏幕旋转或进入后台时保存下来。当我们再次返回到应用时，列表的状态会被恢复

需要注意的是，`ListSaver`和`MapSaver`只能用于保存和恢复基本类型的列表和映射，如果需要保存和恢复自定义对象的列表或映射，还需要自己实现相应的`saver`

> 还有就是，什么是提升状态？什么时候会用得到

在 Jetpack Compose 中，当我们需要在不同的组件之间共享状态时，可以使用提升状态的方式

提升状态指的是将某个状态从子组件中提升到父组件中，使得多个子组件可以共享这个状态。这样可以简化子组件的代码，避免重复定义状态，同时也可以方便地管理状态的生命周期

在使用提升状态时，通常需要将状态定义在父组件中，并将状态和状态更新函数作为参数传递给子组件。子组件可以通过这些参数来读取和更新状态

下面是一个使用提升状态的例子，假设我们需要在一个列表中显示一些文本，同时可以通过一个按钮来增加列表中的文本：

```kotlin
@Composable
fun TextList() {
    var textList by rememberSaveable { mutableStateOf(emptyList<String>()) }
    Column {
        Button(onClick = { textList = textList + "New Text" }) {
            Text("Add Text")
        }
        TextListView(textList = textList, onTextListChange = { textList = it })
    }
}

@Composable
fun TextListView(textList: List<String>, onTextListChange: (List<String>) -> Unit) {
    Column {
        textList.forEach { text ->
            Text(text)
        }
    }
}
```

在上面的代码中，我们将`textList`状态定义在`TextList`组件中，并将`textList`和`onTextListChange`函数作为参数传递给`TextListView`组件。在`TextListView`组件中，我们可以通过`textList`参数来读取状态，通过`onTextListChange`函数来更新状态。当我们点击`Add Text`按钮时，`textList`状态会被更新，并且会重新渲染`TextListView`组件

需要注意的是，提升状态并不是一定要使用的方式，有时候在子组件中定义状态也可以更简单地实现需求。但是当多个组件需要共享同一个状态时，提升状态可以使得代码更加清晰和易于维护

> 那保存 UI 状态是指？

保存 UI 状态指的是在应用程序生命周期中，将 UI 组件的状态保存下来，并在需要时恢复这些状态，使得应用程序能够在恢复后继续从之前的状态继续执行，而不是从头开始

在 Android 开发中，保存 UI 状态通常是通过`onSaveInstanceState`和`onRestoreInstanceState`方法来实现的。当应用程序被销毁并重新创建时，`onSaveInstanceState`方法会被调用，我们可以在这个方法中将需要保存的 UI 状态保存到`Bundle`对象中，然后在`onRestoreInstanceState`方法中从`Bundle`对象中恢复这些状态

在 Jetpack Compose 中，保存 UI 状态的方式与传统的 Android 开发方式略有不同。通常使用`rememberSaveable`函数来保存 UI 状态。`rememberSaveable`函数可以将某个状态保存到 Bundle 中，并在需要时恢复这个状态。当应用程序被销毁并重新创建时，`rememberSaveable`会自动从 Bundle 中恢复这个状态

下面是一个使用`rememberSaveable`函数保存 UI 状态的例子，假设我们需要保存一个文本框中的文本：

```kotlin
@Composable
fun TextEditor() {
    var text by rememberSaveable { mutableStateOf("") }
    TextField(
        value = text,
        onValueChange = { text = it },
        label = { Text("Enter text") }
    )
}
```

在上面的代码中，我们使用了`rememberSaveable`函数来保存文本框中的文本。每次用户输入文本时，文本的状态就会被保存下来。当应用程序被销毁并重新创建时，文本的状态会被自动恢复

需要注意的是，`rememberSaveable`函数只能用于保存一些简单的状态，如果需要保存复杂的状态，比如包含自定义对象等，需要自己实现`Parcelable`或`Serializable`接口来进行序列化和反序列化

> 请详细解释 MutableStateFlow

MutableStateFlow 是 Kotlin 协程库中的一个类，它提供了一种简单而强大的方式来处理状态流。MutableStateFlow 是一个可变的状态流，可以用于在应用程序中传递和存储状态。它提供了一种轻量级的、可观察的方式来管理应用程序的状态，并且非常适合 Jetpack Compose 中的状态管理

MutableStateFlow 是一个可观察的数据流，它可以被订阅，当数据发生变化时，订阅者将收到更新的通知。它的值可以通过 setValue()方法来更新，而订阅者可以使用 collect()方法来接收这些更新。例如：

```kotlin
val count = MutableStateFlow(0)

// 订阅状态流
count.collect { value ->
    println("The current value is $value")
}

// 更新状态流
count.value = 1
```

在上面的例子中，我们创建了一个名为 count 的 MutableStateFlow，并将其初始值设置为 0。然后，我们订阅了这个状态流，并在每次状态发生变化时打印出当前值。最后，我们通过将 count 的值设置为 1 来更新状态流

MutableStateFlow 还有一个非常有用的特性，它允许我们访问最新的状态值。我们可以通过 value 属性来获取最新的状态值，例如：

```kotlin
val count = MutableStateFlow(0)

// 获取最新的状态值
val currentValue = count.value
println("The current value is $currentValue")
```

在 Jetpack Compose 中，MutableStateFlow 经常用于管理 UI 状态，例如保存表单数据、控制 UI 切换等。例如，我们可以使用 MutableStateFlow 来保存一个简单的登录表单：

```kotlin
data class LoginFormState(
    val username: String = "",
    val password: String = "",
    val isSubmitEnabled: Boolean = false
)

val loginFormState = MutableStateFlow(LoginFormState())

// 更新表单状态
loginFormState.value = LoginFormState(
    username = "example",
    password = "password",
    isSubmitEnabled = true
)

// 订阅表单状态
loginFormState.collect { state ->
    // 更新UI
}
```

在上面的例子中，我们使用 MutableStateFlow 来保存一个名为 loginFormState 的表单状态，包括用户名、密码和提交按钮是否可用。我们可以使用 setValue()方法来更新表单状态，并使用 collect()方法来订阅表单状态的变化，并在每次状态发生变化时更新 UI

总之，MutableStateFlow 是一个非常有用的工具，可以帮助我们管理应用程序的状态，并在 Jetpack Compose 中实现响应式 UI。它的简单性和可观察性使其成为状态管理的理想选择

> 什么是响应式流 Reactive Streams？

响应式流（Reactive Streams）是一种异步的、非阻塞的、基于事件的编程模型，用于处理数据流。它是一种标准化的异步编程模型，通过定义一组规范，使得流处理库可以在不同的环境中互操作

响应式流的关键特性包括：

- 异步和非阻塞：响应式流的处理是异步和非阻塞的，它不会阻塞主线程，可以提高系统的吞吐量和性能
- 基于事件：响应式流是基于事件的，当有新的数据到达时，会触发相应的事件
- 背压支持：响应式流支持背压（Backpressure），可以控制数据流的速度，防止数据流过快导致内存溢出的问题

响应式流不仅仅是一种编程模型，还是一种思想方式。它强调的是数据流的处理，而不是数据的存储和获取。它适用于处理大量的、连续的、实时的数据流，例如网络通信、传感器数据、日志处理等场景

在 Java 生态系统中，响应式流有一个标准化的实现，即 Reactive Streams 规范。它定义了一组接口和规范，使得不同的流处理库可以互相兼容，例如 RxJava、Project Reactor、Akka Streams 等。这些库都实现了 Reactive Streams 规范，可以在不同的环境中互相操作

在 Android 开发中，响应式流也得到了广泛的应用。Jetpack 中的 LiveData、ViewModel、Data Binding 等都是响应式编程的应用。另外，RxJava 也是 Android 开发中广泛使用的流处理库，可以帮助开发者处理异步任务、UI 事件、网络请求等场景

总之，响应式流是一种异步、非阻塞、基于事件的编程模型，用于处理大量的、连续的、实时的数据流。它强调的是数据流的处理，适用于网络通信、传感器数据、日志处理等场景。在 Java 生态系统中，响应式流有一个标准化的实现，即 Reactive Streams 规范

> 好，那讲讲 Kotlin 的 Flow

Kotlin 的 Flow 是 Kotlin 协程库中的一个类，它提供了一种基于协程的异步编程模型，用于处理流式数据。Flow 是一个冷流，类似于 Java 中的 RxJava，可以处理异步任务、网络请求、数据库查询等异步操作

Flow 的特点包括：

- 基于协程：Flow 是基于协程的异步编程模型，它可以通过协程上下文来控制协程的生命周期和线程调度
- 冷流：Flow 是一种冷流，当有订阅者时才会开始执行，每个订阅者都会收到完整的数据流
- 可取消：Flow 支持取消操作，可以通过协程的取消机制来取消 Flow 的执行
- 支持背压：Flow 支持背压（Backpressure），可以控制数据流的速度，防止数据流过快导致内存溢出的问题

Flow 的使用方式类似于 Java 中的 Stream，可以通过一系列的操作来处理流式数据，例如 map、filter、reduce 等。例如：

```kotlin
fun getNumbers(): Flow<Int> = flow {
    for (i in 1..10) {
        delay(100)
        emit(i)
    }
}

fun main() = runBlocking<Unit> {
    getNumbers()
        .map { it * 2 }
        .filter { it % 3 == 0 }
        .reduce { acc, i -> acc + i }
        .collect { println(it) }
}
```

在上面的例子中，我们定义了一个名为 getNumbers()的 Flow，它会返回 1 到 10 的数字流。然后，我们通过 map、filter、reduce 等操作来处理这个流，最终输出符合条件的数字。在 collect()方法中，我们订阅了这个流，并在每次流发生变化时输出结果

在 Jetpack Compose 中，Flow 经常用于管理异步数据，例如网络请求、数据库查询等。例如，我们可以使用 Flow 来获取一个简单的用户列表：

```kotlin
data class User(val name: String, val age: Int)

suspend fun getUsers(): Flow<List<User>> {
    return flow {
        val response = api.getUsers()
        emit(response.body())
    }
}

@Composable
fun UserList() {
    val users = remember { mutableStateOf(emptyList<User>()) }

    LaunchedEffect(Unit) {
        getUsers().collect { userList ->
            users.value = userList
        }
    }

    // 显示用户列表
}
```

在上面的例子中，我们使用 Flow 来获取用户列表，并通过 collect()方法来订阅这个流。当数据发生变化时，我们更新 UI 来显示用户列表。注意，我们使用了 LaunchedEffect 来启动协程，并在协程中订阅流，这样可以确保订阅者和协程在同一个生命周期内

总之，Kotlin 的 Flow 是一种基于协程的异步编程模型，用于处理流式数据。它类似于 Java 中的 Stream，支持一系列的操作来处理数据流，同时也支持取消操作和背压控制。在 Jetpack Compose 中，Flow 经常用于管理异步数据，例如网络请求、数据库查询等
