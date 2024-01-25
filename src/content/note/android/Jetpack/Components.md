---
title: 组件们以及组件化
date: 2023-05-02
tags: [note, android]
---

## 组件主题

简便点就直接使用 [Material3](https://developer.android.com/jetpack/compose/designsystems/material3) 就好，组件什么的查 [文档](https://m3.material.io) 就行

通常，应用的主题会在软件包根目录 `/Theme/Theme.kt` 中，里面会有一个 Composable 函数 `软件名Theme`，只要在 Activity 的 setContent 中套用这个 Theme 就行了。颜色可以在上面的 ColorScheme 中语义化地定义，一般就不用 color.xml 里的了

具体地使用可以这样

```kotlin
Text(
    modifier = Modifier.padding(start = 12.dp),
    text = name,
    style = MaterialTheme.typography.titleMedium,
    color = MaterialTheme.colorScheme.onPrimary,
)
```

## 自带组件

### Column 与 Row

LazyColumn 和 Column 的主要区别在于它们的工作方式。Column 是一个静态组件，当您将其放置在 setContent 中时，它会立即创建所有子组件并将它们放置在屏幕上。这可能会导致性能问题，特别是在加载大量数据时

相反，LazyColumn 是一个动态组件，它只在需要时创建和加载子组件。这意味着它可以更好地管理内存，并且在加载大量数据时可以提高性能。当您滚动 LazyColumn 时，它会动态加载和卸载子组件，以确保只有当前可见的组件被加载到内存中

因此，在您需要加载大量数据时，使用 LazyColumn 比使用 Column 更好，因为它可以优化性能并避免内存问题

## 组件的状态管理

[文档](https://developer.android.com/jetpack/compose/state)

组件化肯定得涉及到组件的状态管理。例如下面这个，虽然 Log 里有在增加，但 UI 却不变

```kotlin
@Composable
fun NoState() {
    var clickCount = 0
    Column {
        Button(onClick = {
            clickCount++
            Log.d("TAG", "NoState: $clickCount")
        }) {
            Text(text = "$clickCount times clicked")
        }
    }
}
```

因为 Composable 函数是纯函数，因此它们不能存储状态。为了在 Composable 函数中管理状态，我们需要使用状态管理器。只有设置为 state 对象的数据，才会引起 UI 的自动刷新。只要设置成 `var clickCount by remember { mutableStateOf(0) }` 即可

```kotlin
@Composable
fun Count() {
    val (count, setCount) = remember { mutableStateOf(0) }

    Button(onClick = { setCount(count + 1) }) {
        Text("Count: $count")
    }
}
```

> 非常地 React

其实有三种方式来创建 State

```kotlin
@Composable
fun StateFun() {
    var t by remember { mutableStateOf(0) }          // type Int
    val t2 = remember { mutableStateOf(0) }          // type mutableState<Int>
    val (t3, setT3) = remember { mutableStateOf(0) } // type (Int, (Int) -> Unit)

    // set & get
    t = 1
    setT3(t)
    t2.value = t3
}
```

需要注意的是，rememberSaveable 只能用于保存一些简单的状态，如果需要保存复杂的状态，比如包含自定义对象等，需要自己实现 Parcelable 或 Serializable 接口来进行序列化和反序列化

### 组件之间的通信

Compose 使用的是单向数据流，子组件通过事件回调的方式来通知父组件

```kotlin
@Composable
fun HelloPage() {
    val (name, setName) = rememberSaveable { mutableStateOf("") }

    HelloContent(name = name, onNameChange = { setName(it) })
}

@Composable
fun HelloContent(name: String, onNameChange: (String) -> Unit) {
    Column(modifier = Modifier.padding(16.dp)) {
        Text(
            text = "RememberSavable, $name",
            modifier = Modifier.padding(bottom = 8.dp),
            style = MaterialTheme.typography.headlineSmall
        )
        OutlinedTextField(
            value = name,
            onValueChange = onNameChange,
            label = { Text("Name") }
        )
    }
}

```
