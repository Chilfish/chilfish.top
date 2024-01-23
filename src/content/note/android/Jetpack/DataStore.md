---
title: DataStore
date: 2023-05-06
tags: [Android]
---

### 介绍

Preferences DataStore 是一个轻量级的数据存储解决方案，用于存储和读取应用程序的偏好设置数据

与 SharedPreferences 不同，Preferences DataStore 是基于协程和流的 API，可以在异步上下文中使用，而不会阻塞主线程。SPref 存的是 xml，而 DataStore 存的是二进制文件，所以会快很多

而且 SPrf 可能阻塞 UI 线程，导致 ANR 异常（需要等等 sp 文件加载完成，而且存储数据越多，文件越大，加载越慢，所有之前使用时都会分类存储在不同的 sp 文件中，如用户信息，业务信息，统计信息等）且不能用于跨进程通信

以下是 Preferences DataStore 的一些特点：

- 旨在替代原有的 SharedPreferences，支持 SharedPreferences 数据的迁移
- 基于 Kotlin 协程和 Flow 开发,保证了在主线程的安全性
- 提供两种不同的实现:
  - Preferences DataStore：使用键存储和访问数据
  - Proto DataStore： 将数据作为自定义数据类型的实例进行存储
- 以事务方式处理更新数据，事务有四大特性（原子性、一致性、 隔离性、持久性）
  如果需要支持大型或复杂数据集、部分更新或参照完整性，请考虑使用 Room，而不是 DataStore

文档：[Docs][Docs]

### 用法

下面是 Preferences DataStore 的一些用法示例：

1. 创建 Preferences DataStore

```kotlin
val dataStore = context.createDataStore(name = "settings")
```

2. 写入数据

```kotlin
dataStore.edit { settings ->
    settings[KEY_NAME] = "John"
    settings[KEY_AGE] = 30
}
```

3. 读取数据

```kotlin
val nameFlow: Flow<String> = dataStore.data.map { settings ->
    settings[KEY_NAME] ?: ""
}

val ageFlow: Flow<Int> = dataStore.data.map { settings ->
    settings[KEY_AGE] ?: 0
}
```

4. 删除数据

```kotlin
dataStore.edit { settings ->
    settings.remove(KEY_NAME)
}
```

在存储自定义对象时，需要确保对象是可序列化的。如果对象不可序列化，则需要将其转换为可序列化的类型，例如 JSON 字符串或字节数组。在读取数据时，也需要将存储的数据转换为相应的类型

### 完整示例

通常我们会把 Pref 写成单例对象，并且所有的操作都必须是异步协程的

```kotlin
private const val ACCOUNT_SP = "Account"
private val KEY_IS_LOGIN = booleanPreferencesKey("isLogin")
private val KEY_UID = stringPreferencesKey("uid")

var curUid: String = ""
var isLoggedIn = MutableStateFlow(false)

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = ACCOUNT_SP)

object AccountProvider {
    private lateinit var dataStore: DataStore<Preferences>

    fun init(context: Context) {
        dataStore = context.dataStore

        CoroutineScope(Dispatchers.IO).launch {
            val pref = dataStore.data.first()

            isLoggedIn.value = pref[KEY_IS_LOGIN] ?: false
            curUid = pref[KEY_UID] ?: ""
        }
    }

    suspend fun setLogin(uid: String) {
        curUid = uid
        isLoggedIn.value = true
        dataStore.edit {
            it[KEY_IS_LOGIN] = true
            it[KEY_UID] = uid
        }
    }

    suspend fun setLogout() {
        curUid = ""
        isLoggedIn.value = false
        dataStore.edit {
            it[KEY_IS_LOGIN] = false
            it[KEY_UID] = ""
        }
    }
}
```

然后在入口处的 Application 初始化即可

[Docs]: https://developer.android.com/topic/libraries/architecture/datastore
