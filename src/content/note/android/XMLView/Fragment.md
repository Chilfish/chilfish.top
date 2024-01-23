---
title: Fragment in XML
date: 2023-03-26
tags: [Android]
---

其实就是将某些 Layout 以某种排列方式呈现出来。命名规范一般如下

<div class="tableBox">

<span></span>
Layout | ui | placeholder
| :-: | :-: | :-:
`res/fragment_xx` | `ui.fragments.xxx`| `ui.fragments.placeholder.xx`

</div>

### 纯文本

先定义一个带 TextView 的 layout，然后是 Fragment 类：

```java
public class TextFragment extends Fragment {
  private String mText;

  public TextFragment(String text) { mText = text; }
  public TextFragment() { mText = "Hello";}

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
  }

  @Override
  public View onCreateView(LayoutInflater inflater, ViewGroup container,
                           Bundle savedInstanceState) {
    View view = inflater.inflate(R.layout.fragment_text, container, false);

    TextView textView = view.findViewById(R.id.frag_text);
    textView.setText(mText);
    return view;
  }
}
```

然后在 layout 中引用：

```xml
<androidx.fragment.app.FragmentContainerView
  android:name="com.chill.ui.fragments.TextFragment"
  android:id="@+id/frag_text"
  android:layout_width="match_parent"
  android:layout_height="wrap_content" />
```

其中， `android:name` 用来指定它的 Fragment 类，也可以这样在 Activity 中定义：

```java
getSupportFragmentManager()
    .beginTransaction()
    .replace(layout_id, new TextFragment("Test Text"))
    .commit();
```

这里的 Transaction 是指 [事务](../../design/index.md#transaction-事务)，就很像是 MySQL 中的事务一样

### 使用导航栏 navBar 来切换页面

这里就直接用 MD3 的 navigation 了

```xml
<!-- res/menu/bottom_navigation_menu.xml -->
<menu xmlns:android="http://schemas.android.com/apk/res/android">
    <item
        android:id="@+id/nav_home"
        android:enabled="true"
        android:icon="@drawable/baseline_home_24"
        android:title="@string/home" />

    <item
        android:id="@+id/nav_chat"
        android:enabled="true"
        android:icon="@drawable/baseline_chat_24"
        android:title="@string/chat" />

    <item
        android:id="@+id/nav_settings"
        android:enabled="true"
        android:icon="@drawable/baseline_settings_24"
        android:title="@string/settings" />
</menu>
```

然后在 Layout 中引入

```xml
<androidx.fragment.app.FragmentContainerView
    android:id="@+id/frag_nav"
    android:layout_width="match_parent"
    android:layout_height="wrap_content" />

<com.google.android.material.bottomnavigation.BottomNavigationView
    android:id="@+id/nav_btn"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    app:menu="@menu/bottom_navigation_menu" />
```

这样就能在 Activity 中使用：

```java
void navChange() {
  BottomNavigationView BtnNav = findViewById(R.id.nav_btn);
  final int id = R.id.frag_nav;

  BtnNav.setOnItemSelectedListener(item -> {
    switch (item.getItemId()) {
      case R.id.nav_home:
        replaceFragment(new TextFragment("Home"), id);
        break;
      case R.id.nav_chat:
        replaceFragment(new TextFragment("Chat"), id);
        break;
      case R.id.nav_settings:
        replaceFragment(new TextFragment("Settings"), id);
        break;
    }
    return true;
  });
  replaceFragment(new TextFragment("Home"), id);
}

private void replaceFragment(Fragment fragment, int id) {
  getSupportFragmentManager()
      .beginTransaction()
      .replace(id, fragment)
      .commit();
}
```

### 一个 list

其余步骤都差不多，就只是把 TextView 换成了 RecycleView，然后设置各自的 layout 和 Adapter

```java
public class ChatFragment extends Fragment {
  private List<ChatItem> mChats;

  public ChatFragment(List<ChatItem> data) {
    mChats = data;
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
  }

  @Override
  public View onCreateView(LayoutInflater inflater, ViewGroup container,
                           Bundle savedInstanceState) {
    View view = inflater.inflate(R.layout.fragment_chat_lists, container, false);

    Context context = view.getContext();
    RecyclerView recyclerView = (RecyclerView) view;
    recyclerView.setLayoutManager(new LinearLayoutManager(context));
    recyclerView.setAdapter(new ChatListAdapter(mChats));

    return view;
  }
}
```

在 `fragment_chat_list.xml` 中，引入 RecycleView 组件

```xml
<androidx.recyclerview.widget.RecyclerView xmlns:android="http://schemas.android.com/apk/res/android"
  xmlns:app="http://schemas.android.com/apk/res-auto"
  xmlns:tools="http://schemas.android.com/tools"
  android:name="com.chill.learn.ui.fragments.ChatFragment"
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  android:layout_marginLeft="16dp"
  android:layout_marginRight="16dp"
  app:layoutManager="LinearLayoutManager"
  tools:context=".ui.fragments.ChatFragment"
  tools:listitem="@layout/item_chat_list" />
```

引用 Fragment 就都一样了）最后还能顺便加到上一个的导航栏中，这样终于是像个样子了

### BaseFragment

可以设计一个虚基类来更省代码）后来换成了 Kotlin 之后又省了一堆。其中的 binding 可见 [DataBinding](DataBinding.md)

```kotlin
abstract class BaseFragment<Binding : ViewDataBinding> : Fragment() {
    @JvmField
    protected var binding: Binding? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = DataBindingUtil.inflate(inflater, layoutId, container, false)
        return binding!!.root
    }

    protected abstract val layoutId: Int
    override fun onDestroyView() {
        super.onDestroyView()
        binding = null
    }
}
```
