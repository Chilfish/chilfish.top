---
title: 数据层
date: 2023-05-06
tags: [Android]
---

## 介绍

### 为什么要使用不同的层

将代码拆分为不同的层可让应用具备更高的可伸缩性、更加稳定可靠、更易于测试。为不同的层定义清晰的边界还有助于多个开发者更轻松地开发同一应用，而不会对彼此产生负面影响

[Android 的推荐应用架构][architecture] 指出，应用应至少具有一个界面层和一个数据层

软件架构中的数据层是指负责处理应用程序数据的组件或模块。数据层通常包括以下几个方面：

- 数据库管理系统（DBMS）：数据层通常需要使用数据库来存储和管理应用程序的数据。数据库管理系统是一种软件，它允许应用程序通过 SQL 或其他查询语言来访问和操作数据。常见的数据库管理系统包括 MySQL、PostgreSQL、Oracle 等

- 数据访问层（Data Access Layer）：数据访问层是应用程序和数据库之间的接口，它负责将应用程序的数据请求转换为数据库操作，并将数据库操作结果返回给应用程序。数据访问层通常包括数据访问对象（DAO）、数据适配器（Data Adapter）等组件

- 数据模型（Data Model）：数据模型是数据层中的一个重要概念，它描述了应用程序中使用的数据结构和关系。数据模型通常使用实体-关系模型（Entity-Relationship Model）或面向对象模型（Object-Oriented Model）来表示

- 数据库连接池（Database Connection Pool）：数据库连接池是一种管理数据库连接的技术，它可以在应用程序启动时创建一定数量的数据库连接，并在需要时将这些连接分配给应用程序。这样可以避免频繁地创建和关闭数据库连接，提高应用程序的性能

在 Jetpack Compose 中，数据层通常使用 ViewModel 来实现。ViewModel 是一种架构组件，它负责管理应用程序的 UI 状态和数据。ViewModel 通常包含一个或多个 Repository，Repository 负责从数据源（如数据库、网络等）获取数据，并将数据转换为应用程序需要的格式。ViewModel 将从 Repository 获取的数据暴露给 UI 层，供 UI 层使用

### 什么是数据层

数据层负责应用的业务逻辑以及为应用寻源和保存数据。数据层使用单向数据流模式向界面层公开数据。数据可能来自多个来源，例如网络请求、本地数据库或设备上的文件

一个应用甚至可能有多个数据源。当应用打开时，它会从设备上的本地数据库（第一个来源）检索数据。当应用运行时，它会向第二个来源发出网络请求以检索较新的数据

通过将数据与界面代码放在不同的层中，您可以在代码的某一部分进行更改，而不会影响其他部分。这种方法属于关注点分离的设计原则。一段代码侧重于自身的关注点，并封装其内部运行，与其他代码相隔离。封装用于向代码的其他部分隐藏其内部运行。当一段代码需要与另一段代码进行交互时，就需要通过接口来实现

界面层的关注点是显示所提供的数据。界面不再检索数据，因为这是数据层的关注点。也就是像是操作数据库、请求 api 等都放在数据层处理，并用仓库来提供接口，而 Activity、Fragment、ViewModel 等是不用关注这些的

数据层由一个或多个**仓库**组成。仓库本身包含零个或多个数据源

最佳实践要求应用为其所使用的每种数据源类型提供一个仓库

### 什么是仓库？

可以将 Repository 理解为数据层与 UI 层之间的桥梁，它主要负责处理数据的获取和处理逻辑。在 Repository 中，可以包含多种数据源，例如本地数据库、网络请求等，以便获取数据。然后，Repository 可以将获取到的数据进行处理，以便将其提供给 UI 层使用

通常，仓库类的作用包括：

- 向应用的其余部分公开数据
- 集中管理数据更改
- 解决多个数据源之间的冲突
- 对应用其余部分的数据源进行抽象化处理
- 包含业务逻辑

## 应用

通常来说，数据层面大多也就涉及到数据库和网络请求。数据库上又通常使用 [Jetpack Room][Room Doc] 来代替纯 SQLite

### Room 数据库

Room 主要由三个部分组成

- Entity：实体类，对应的是数据库的一张表结构，使用注解 @Entity 标记
- Dao：包含访问一系列访问数据库的方法，使用注解 @Dao 标记
- DataBase：数据库持有者，作为与应用持久化相关数据的底层连接的主要接入点。使用注解 @Database 标记，另外需要满足以下条件：定义的类必须继承于 RoomDatabase 的抽象类，在注解中需要定义与数据库相关联的实体类列表。包含一个没有参数的抽象方法并且返回一个 Dao 对象

#### @Entity

**注解：**

- `@Entity` 注解接受一个 tableName 参数，这个参数表示这个对象将会存储在哪张表中
- `@PrimaryKey` Room 规定每个被 @Entity 修饰的类都必须有一个主键，其中 autoGenerate 参数表示主键是否可以通过数据库自行维护，一般是自增
- `@ColumnInfo` 注解是注解在成员变量上，表示这个成员变量会被存入哪一列，name 参数表示列名，defaultValue 表示默认值
- `@Ignore` 表示这个变量在存储数据库的时候会被忽略
- `@Embedded` 让当前字段也映射进表中，要求当前对象也需要用 @Entity 注解标记需要在注解上标记下面的注解，否则编译会有报错
- `@SuppressWarnings(RoomWarnings.PRIMARY_KEY_FROM_EMBEDDED_IS_DROPPED)`表示该成员变量中的主键将会被忽略

一般类名后缀为 Entity 的数据类

```kotlin
@Entity(tableName = "user")
data class UserEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    @ColumnInfo(name = "name", typeAffinity = ColumnInfo.TEXT)
    val name: String = "",
    @ColumnInfo(name = "age", typeAffinity = ColumnInfo.INTEGER)
    val age: Int = 0,
)
```

#### @DAO

@DAO 注解需要标记在接口上，内部是实现数据库增删改查的功能。也就是下面函数上的注解其实就是 Dao 封装的 SQLite 操作，总的来说少写了一堆重复代码。同时，它必须是异步挂起的函数来查询，以免阻塞

```kotlin
@Dao
interface UserDao {
    @Insert
    suspend fun insertUser(user: UserEntity): Long

    @Delete
    suspend fun deleteUser(user: UserEntity): Int

    @Update
    suspend fun updateUser(user: UserEntity): Int

    @Query("SELECT * FROM user ORDER BY name")
    fun queryAllUser(): Flow<List<UserEntity>>

    @Query("SELECT * FROM user WHERE id = :id")
    suspend fun queryUserById(id: Int): UserEntity

    @Query("SELECT * FROM user WHERE name like :name")
    suspend fun queryUserByName(name: String): UserEntity
}
```

其中，update 是指传入更改后的对象，它就能根据 id 去更新

#### @Database

创建数据库或更新它，以及一些预操作

```kotlin
@Database(entities = [UserEntity::class], version = 1)
abstract class UserDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao

    companion object {
        private const val DATABASE_NAME = "user.db"

        @Volatile
        private var INSTANCE: UserDatabase? = null

        fun getDatabase(
            context: Context,
        ): UserDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context,
                    UserDatabase::class.java,
                    DATABASE_NAME
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
```

#### 初始化

然后就可以在程序入口的 Activity 或 Application 的 onCreate 中实例化数据库

```kotlin
val database by lazy {
    UserDatabase.getDatabase(this)
}
val repository by lazy {
    RoomRepository(database.userDao())
}
```

### Room 的主线程安全

默认情况下，Room 的所有数据库操作都是在主线程中执行的，这可能会导致应用程序出现 ANR（Application Not Responding）错误，因为主线程被阻塞了。为了避免这种情况，我们需要在 Room 中使用异步操作

在 Room 中，我们可以使用 `suspend` 关键字来定义异步操作，这样我们就可以在协程中执行数据库操作，而不会阻塞主线程。例如，我们可以使用以下代码来查询数据库中的所有用户：

```kotlin
@Dao
interface UserDao {
    @Query("SELECT * FROM users")
    suspend fun getAllUsers(): List<User>
}
```

在这个示例中，我们使用 `suspend` 关键字来定义一个异步操作 `getAllUsers()`，它将返回一个 `List<User>` 类型的数据。我们可以在协程中调用这个方法，以确保它在异步线程中执行

除了使用 `suspend` 关键字来定义异步操作之外，我们还可以使用 `LiveData` 或 `Flow` 来处理 Room 中的数据流。这些类都可以确保数据的异步处理，并且可以在主线程中观察数据的变化

例如，我们可以使用以下代码来查询数据库中的所有用户，并将结果作为 `LiveData` 返回：

```kotlin
@Dao
interface UserDao {
    @Query("SELECT * FROM users")
    fun getAllUsers(): LiveData<List<User>>
}
```

在这个示例中，我们使用 `LiveData` 来返回一个 `List<User>` 类型的数据。我们可以在主线程中观察这个 `LiveData`，以便在数据发生变化时更新 UI

[architecture]: https://developer.android.com/topic/architecture?hl=zh-cn#recommended-app-arch
[Room Doc]: https://developer.android.com/training/data-storage/room
