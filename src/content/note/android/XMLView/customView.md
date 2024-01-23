---
title: 自定义组件
date: 2023-03-25
tags: [Android]
---

组件的好处当然就是可复用性了，整前端的肯定要封一堆组件）

### 步骤

在安卓中，自定义组件可以通过继承 View 或者 ViewGroup 来实现。以下是自定义组件的步骤：

1. 创建自定义组件类：自定义组件类需要继承 View 或者 ViewGroup，并实现构造函数和 onDraw 方法（如果是继承 View 的话）

2. 在 XML 布局文件中引用自定义组件：在 XML 布局文件中使用自定义组件需要使用完整的类名，例如 `com.example.MyView`

3. 在代码中使用自定义组件：在代码中使用自定义组件需要先实例化，然后添加到父容器中

4. 添加属性：可以通过在自定义组件类中添加属性，来让使用者可以在 XML 中设置组件的属性

5. 处理触摸事件：如果需要让自定义组件响应用户的触摸事件，需要重写 onTouchEvent 方法

6. 绘制自定义组件：如果需要自定义组件绘制一些特定的图形或者效果，需要在 onDraw 方法中实现

7. 测量和布局：如果自定义组件需要支持 wrap_content 或者自适应大小，需要实现 onMeasure 方法和 onLayout 方法

8. 优化性能：在自定义组件的实现过程中，需要注意性能问题，例如尽量避免在 onDraw 中创建对象等

### 例子

例如我想封装一个 LinearLayout，里面套了两个 TextView，一个 label 一个数据。在里面定义好样式之后，我们就想着怎么复用了

#### attrs

先在 `res/attrs.xml` 中定义要用到的属性

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <declare-styleable name="UserInfo">
        <attr name="hint" format="string" />
        <attr name="value" format="string" />
    </declare-styleable>
</resources>
```

它定义了应用程序中使用的自定义属性。这些自定义属性可以在布局文件中使用，以便在运行时设置视图的属性。在 attrs.xml 文件中，可以定义属性的名称、类型、默认值和描述等信息。此外，还可以在 attrs.xml 文件中定义主题属性，以便在应用程序中使用主题样式

就可以这么来使用它：

```xml
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/hello_world"
    app:hint="@string/hint" />
```

```java
TypedArray a = context.obtainStyledAttributes(attrs, R.styleable.UserInfo);
// 这里用下划线代表 /
String customText = a.getString(R.styleable.UserInfo_hint);
```

其中，`TypedArray` 是一个用于获取和存储属性值的数组，可以用于访问和操作 XML 中定义的属性。在 Android 中，可以使用 `obtainStyledAttributes` 方法获取一个 `TypedArray` 对象，并从中获取指定属性的值

`context.obtainStyledAttributes(attrs, R.styleable.UserInfo)` 这行代码中，context 是当前上下文对象，attrs 是一个 AttributeSet 对象，它包含了当前视图的所有属性，`R.styleable.UserInfo` 是自定义属性的样式集合，它包含了定义在 `attrs.xml` 文件中的所有自定义属性。这样，我们就可以通过 `TypedArray` 对象获取指定属性的值

#### 组件初始化

然后在 `/ui/view` 中定义一个类，用来给组件初始化

```java
package com.chill.ui.view;

public class UserInfo extends LinearLayout {
  public UserInfo(Context context, AttributeSet attrs) {
    super(context, attrs);
    LayoutInflater.from(context).inflate(R.layout.view_user, this, true);

    TypedArray ta = context.obtainStyledAttributes(attrs, R.styleable.UserInfo);
    String hint = ta.getString(R.styleable.UserInfo_hint);
    String value = ta.getString(R.styleable.UserInfo_value);
    ta.recycle();

    TextView hintView = findViewById(R.id.hint);

    hintView.setText(hint);
    setValue(value);
  }

  public void setValue(String value) {
    TextView valueView = findViewById(R.id.value);
    valueView.setText(value);
  }

  public String getValue() {
    TextView valueView = findViewById(R.id.value);
    return valueView.getText().toString();
  }
}
```

其中 #L6 的作用是将指定的布局文件 `R.layout.view_user` 填充到当前视图中

- 具体来说，`LayoutInflater.from(context)` 方法用于获取一个 `LayoutInflater` 对象，它可以将 XML 布局文件转换为对应的视图对象。然后，我们调用 inflate 方法将指定的布局文件填充到当前视图中。其中，`R.layout.view_user` 是要填充的布局文件的资源 ID，this 表示当前视图对象，true 表示将填充的布局文件添加到当前视图中

- 例如，如果我们在一个自定义视图的构造函数中使用该代码，那么它的作用是将 `R.layout.view_user` 布局文件中定义的视图添加到当前自定义视图中，从而实现了自定义视图的组合和复用

- 需要注意的是，inflate 方法的第三个参数表示是否将填充的布局文件添加到当前视图中。如果设置为 false，则不会将布局文件添加到当前视图中，需要手动添加；如果设置为 true，则会将布局文件自动添加到当前视图中

其中 #L11

- `ta.recycle()` 是将 TypedArray 对象回收的方法。在使用 `obtainStyledAttributes` 方法获取 TypedArray 对象后，我们需要在使用完毕后及时回收该对象，以便释放内存资源

- 需要注意的是，当我们使用 `obtainStyledAttributes` 方法获取 TypedArray 对象时，系统会在内部使用一个对象池来管理 TypedArray 对象，以便复用已经创建的对象，从而减少内存分配和回收的开销。因此，我们在使用 TypedArray 对象时，不需要手动创建和销毁对象，只需要在获取完自定义属性的值后调用 recycle 方法即可

#### 使用组件

最后就可以愉快地使用组件了

```xml
<com.chill.ui.views.UserInfo
    android:id="@+id/res_name"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginVertical="16dp"
    app:hint="@string/username"
    app:value="@string/default_string" />

<com.chill.ui.views.UserInfo
    android:id="@+id/res_password"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    app:hint="@string/password"
    app:value="@string/default_string" />
```

### View 之间的通信

在自定义组件之间通信的方式有很多种，以下是一些常见的例子：

1. 通过回调函数：一个自定义组件可以定义一个回调函数接口，并在需要通信的地方调用这个接口。另一个自定义组件可以实现这个接口，并在回调函数中处理数据

2. 通过广播：一个自定义组件可以发送广播，另一个自定义组件可以注册广播接收器来接收这个广播，并在接收器中处理数据

3. 通过事件总线：使用事件总线框架，例如 EventBus 或者 Otto，一个自定义组件可以发布事件，另一个自定义组件可以订阅这个事件并在回调函数中处理数据

4. 通过共享 ViewModel：使用 Android Architecture Components 中的 ViewModel，一个自定义组件可以与同一个 ViewModel 共享数据，并在其中修改和读取数据

举个常见的例子，比如一个自定义的计时器组件，需要在计时器结束时通知其他自定义组件。可以通过定义一个回调函数接口，在计时器结束时调用这个接口，其他自定义组件实现这个接口并在回调函数中处理数据。这样就可以实现自定义组件之间的通信

### View 的状态管理

安卓的自定义 View 也可以进行状态管理，一般通过以下两种方式来实现：

- 通过成员变量来保存状态：自定义 View 可以通过成员变量来保存状态，例如在自定义 View 中添加一个 int 类型的成员变量来保存状态，并在需要修改状态时修改这个成员变量。例如，一个自定义的进度条 View 可以通过一个 int 类型的成员变量来保存当前进度值

- 通过重写 `onSaveInstanceState` 和 `onRestoreInstanceState` 方法来保存和恢复状态：在自定义 View 的 onSaveInstanceState 方法中保存当前状态，然后在 onRestoreInstanceState 方法中恢复状态。这种方式可以保证自定义 View 在 Activity 被销毁并重新创建时能够正确地恢复状态

需要注意的是，自定义 View 的状态管理需要考虑到生命周期，例如在 `onSaveInstanceState` 方法中保存状态时，需要将状态保存到 Bundle 中，并在 `onRestoreInstanceState` 方法中从 Bundle 中恢复状态。同时，自定义 View 的状态管理也需要考虑到状态的可见性和可维护性，例如通过使用 private 修饰成员变量来保证状态的可见性，通过封装方法来保证状态的可维护性
