---
title: ViewModel
date: 2023-05-02
tags: [note, android]
---

### ViewModel

ViewModel 是一个与 UI 无关的类，它负责管理应用程序的数据和业务逻辑，同时与 UI 层进行通信

ViewModel 的主要作用是将 UI 和数据层分离，避免了在 UI 层中进行数据操作和业务逻辑处理的情况。这样可以使得 UI 层更加专注于显示数据和处理用户交互，而将数据和业务逻辑的处理交给 ViewModel 处理。这种分离可以使得代码更加清晰、易于维护和测试

像是表单验证、路由跳转等逻辑应该交由 ViewModel 来处理，而不是 Composable 函数

在 Jetpack Compose 中，ViewModel 通常与 LiveData 或 Flow 一起使用，以实现数据的响应式更新。当 ViewModel 中的数据发生变化时，LiveData 或 Flow 会通知 UI 层进行更新。这种方式可以使得 UI 层与数据层之间的通信更加简单和高效

### UI 状态

下面的一个例子是，初始值为 Hello，World，点击按钮后，就更新为 New Text。其中的 collectAsState 是下面 Flow 的用于订阅（观察） ViewModel 中 text 值的变化的

```kotlin
class MyViewModel : ViewModel() {
    private val _text = MutableStateFlow("Hello, World!")
    val text: StateFlow<String> = _text

    fun updateText(newText: String) {
        _text.value = newText
    }
}

@Composable
fun MyScreen(viewModel: MyViewModel = viewModel()) {
    val text by viewModel.text.collectAsState()

    Column {
        Text(text)
        Button(onClick = { viewModel.updateText("New Text") }) {
            Text("Update Text")
        }
    }
}
```

除此之外，通常还会定义一个名为 xxUIState 的 data class，用来定义和保存当前页面的整体状态信息。例如

```kotlin
data class GameUiState(
    val currentScrambledWord: String = "",
    val currentWordCount: Int = 1,
    val score: Int = 0,
    val isGuessedWordWrong: Boolean = false,
    val isGameOver: Boolean = false
)
```

通常将 Mutable 类型的 private，就是为了将要更改的方法集中在一个类中来维护，也就叫做“单一数据源”

```kotlin
private val _uiState = MutableStateFlow(LatestNewsUiState.Loading)
val uiState: StateFlow<LatestNewsUiState> = _uiState
```

> 跟着 [这个实验](https://developer.android.com/codelabs/basic-android-kotlin-compose-viewmodel-and-state) 走一遍也基本能了解是个怎样的情况了

### Flow

Flow 是 Kotlin 协程中的一个异步数据流框架，它可以以类似于 JS 的 async/await 的方式处理异步数据流。Flow 的一个重要特点是它可以处理无限量的数据流，而不会阻塞主线程。在 Jetpack Compose 中，我们可以使用 Flow 来处理异步数据流，例如从网络或数据库中获取数据

下面是一个简单的例子，展示如何使用 Flow 在 Compose 中更新 UI：

```kotlin
@Composable
fun MyScreen(viewModel: MyViewModel) {
    val myData by viewModel.myData.collectAsState()

    Text(text = myData)
}

class MyViewModel {
    private val _myData = MutableStateFlow("")

    val myData: StateFlow<String> = _myData.asStateFlow()

    init {
        viewModelScope.launch {
            fetchData()
        }
    }

    private suspend fun fetchData() {
        // Fetch data from network or database
        _myData.value = "New Data"
    }
}
```

在上面的例子中，我们使用了 StateFlow 来存储和更新数据。我们可以使用 collectAsState()函数来订阅 StateFlow，并在 UI 中展示最新的数据

在 MyViewModel 中，我们使用 viewModelScope 来启动一个协程，然后在 fetchData()函数中获取数据，并将其更新到\_myData 中。由于\_myData 是一个 StateFlow，因此 UI 会自动更新以显示最新的数据

除了 StateFlow，我们还可以使用 Flow 来处理异步数据流。下面是一个使用 Flow 来获取网络数据的例子：

```kotlin
class MyViewModel {
    private val _myData = MutableStateFlow("")

    val myData: StateFlow<String> = _myData.asStateFlow()

    init {
        viewModelScope.launch {
            fetchData()
        }
    }

    private suspend fun fetchData() {
        val data = flow {
            delay(1000)
            emit("New Data")
        }

        data.collect {
            _myData.value = it
        }
    }
}
```

在上面的例子中，我们使用 flow 函数来创建一个 Flow，然后在其中获取网络数据。我们使用 emit()函数将数据发送到 Flow 中，然后使用 collect()函数来订阅 Flow 并获取数据。在 collect()函数中，我们将最新的数据更新到\_myData 中，以便 UI 可以自动更新

#### 监听 Flow 的变化

在 Activity 或 Composable 中监听 Flow 值的变化，可以使用 collect 函数。collect 函数是一个挂起函数，它会阻塞当前协程并等待 Flow 中的新值。每当 Flow 中有新值时，collect 函数就会被调用，我们可以在其中更新 UI 或执行其他操作

在 Activity 中监听 Flow 值的变化，可以使用以下代码：

```kotlin
class MyActivity : AppCompatActivity() {
    private val viewModel by viewModels<MyViewModel>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        lifecycleScope.launchWhenStarted {
            viewModel.myData.collect { data ->
              // handler data
            }
        }
    }
}
```

而在 Composable 中，可以在 LaunchedEffect 副作用来启动协程

```kotlin
LaunchedEffect(viewModel.pageState) {
    viewModel.pageState.collect { pageState ->
        if (pageState.isShowAlert) {
            setIsShowAlert(true)
        }
    }
}
```

> 其实这种监听都是需要协程的，所以都会在 CoroutineScope 中来运行

#### 主线程安全

Flow 是 Kotlin 中的一个异步数据流库，它提供了一种响应式编程的方式，可以让我们以一种非阻塞的方式处理数据流。Flow 可以用于处理异步数据流，例如网络请求、数据库查询等等

主线程安全是指在 Android 应用程序中，所有 UI 操作必须在主线程中执行。如果在非主线程中执行 UI 操作，将会导致应用程序崩溃或出现其他异常

在 Jetpack Compose 中，我们可以使用 Flow 来处理异步数据流，并且确保它们是主线程安全的。Flow 提供了许多操作符，例如 map、filter、transform 等等，可以帮助我们对数据流进行转换和过滤。在使用 Flow 时，我们可以使用 `flowOn` 操作符来指定数据流的执行上下文，例如：

```kotlin
fun fetchUserData(): Flow<User> = flow {
    // 发射数据前进行异步操作
    val result = apiService.fetchUserDataAsync().await()
    // 发射数据
    emit(result)
}.flowOn(Dispatchers.IO) // 将异步操作切换到 IO 线程中
    .catch { e ->
        // 处理异常
        Log.e(TAG, "Error fetching user data: $e")
    }
```

在上面的例子中，`getUsers` 函数返回一个 `Flow<List<User>>` 对象，其中 `flowOn` 操作符指定了数据流的执行上下文为 IO 线程池。这样可以确保网络请求是在 IO 线程中执行，而数据流的转换和发射是在主线程中执行的，从而保证了主线程安全

总之，Flow 提供了一种非阻塞的方式处理异步数据流，并且可以确保数据流是主线程安全的。在 Jetpack Compose 中，我们可以使用 Flow 来处理异步数据流，并且使用 `flowOn` 操作符来指定数据流的执行上下文，从而确保主线程安全

### 协程部分

viewModelScope 是一个 CoroutineScope 对象，它是 ViewModel 类的一个扩展函数，用于在 ViewModel 的生命周期内启动协程。viewModelScope 是一个 CoroutineScope 对象，它继承自 CoroutineScope，因此它可以启动协程，并且在 ViewModel 销毁时自动取消所有未完成的协程，从而避免内存泄漏和其他潜在的问题

将 Dispatcher 作为参数，就可以相应地应该是 viewModel 的 coroutine 或是 CoroutineScope 又或者是 lifeCycle 的，根据不同环境的上下文来传了

```kotlin
class mie (
    private val IODispatcher: CoroutineDispatcher = Dispatchers.IO
)
```

### 保存页面的生命周期

众所周知，旋转屏幕之类的会导致 Activity 及其的 Fragment、View 重建，重走一遍 onCreate。此时如果是在 Fragment 中，会导致找不到 replace 进来的 Fragment 实例而报错 `Unable to instantiate fragment com.xxx.XXXFragment: could not find Fragment constructor`

这时候就需要使用独立于 Activity 生命周期的 ViewModel 来存页面中的数据状态，在重建前一刻（onPause）保存数据到 ViewModel，恢复的时候能及时恢复数据

#### ViewModelProvider

[ViewModelProvider][ViewModelProvider] 是一个用于创建和管理 ViewModel 实例的类，属于 lifecycle 的一部分

使用 ViewModelProvider 可以创建新的 ViewModel 实例，或者获取现有的 ViewModel 实例。ViewModelProvider 有两种不同的构造函数，可以根据需要选择使用哪种。一种构造函数需要 Activity 或 Fragment 作为参数，另一种构造函数需要 ViewModelStore 作为参数。ViewModelStore 是一个存储 ViewModel 实例的容器，它可以在 Activity 或 Fragment 之间共享

**创建实例（in Activity）：**

```kotlin
private lateinit var viewModel: NoteViewModel

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    noteViewModel = ViewModelProvider(
        this, NoteViewModelFactory(
            (application as MainApplication).noteRepository,
        )
    )[NoteViewModel::class.java]
}
```

其中的 **NoteViewModelFactory** 是一个用于创建 ViewModel 实例的接口。它是 ViewModelProvider 的工厂接口，用于创建 ViewModel 实例。`ViewModelProvider.Factory` 允许我们自定义 ViewModel 的创建过程，以便更好地控制 ViewModel 的创建和初始化

`ViewModelProvider.Factory` 接口只有一个方法：`create(`)。这个方法接收一个 Class 类型的参数，用于指定要创建的 ViewModel 类，并方法返回一个 ViewModel 实例

例如：

```kotlin
class NoteViewModelFactory(
    private val repository: NoteRepository,
) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(NoteViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return NoteViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
```

**获取 ViewModel 实例：**

```kotlin
private lateinit var noteViewModel: NoteViewModel

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    noteViewModel = ViewModelProvider(requireActivity())[NoteViewModel::class.java]
}
```

[ViewModelProvider]:[https://developer.android.com/reference/androidx/lifecycle/ViewModelProvider]
