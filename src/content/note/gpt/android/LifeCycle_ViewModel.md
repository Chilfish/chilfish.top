---
title: 用 ViewModel 来管理生命周期
date: 2023-05-07
tags: [GPT]
---

> 我在 Activity 中启动了一个 Fragment，但旋转屏幕后报错 Unable to instantiate fragment xx.NewNoteFragment: could not find Fragment constructor
>
> 这要怎么用 ViewModel 管理它的生命周期？
>
> 我的 ViewModel 是在 Activity 中用 ViewModelProvider.Factory 实例化的，并在 Fragment 中使用它。这看起来没什么问题，但还是出现了上述的问题
>
> 同时，从 Activity 到 Fragment 我们应该只实例化 ViewModel 一次，以保留以前的数据

当旋转屏幕时，Activity 会被销毁并重新创建。这意味着 Activity 中的所有 Fragment 也会被销毁并重新创建。因此，您需要确保在 Fragment 重新创建时，它仍然可以访问到 Activity 中的 ViewModel 实例

为了解决这个问题，您可以使用 ViewModelProvider 的 get()方法来获取 Activity 中的 ViewModel 实例。这样，即使 Activity 被销毁并重新创建，Fragment 仍然可以访问到相同的 ViewModel 实例

以下是一个示例：

在 Activity 中：

```kotlin
class MainActivity : AppCompatActivity() {
    private lateinit var viewModel: MyViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        viewModel = ViewModelProvider(this, MyViewModelFactory(application))
            .get(MyViewModel::class.java)

        val fragment = MyFragment.newInstance(viewModel)
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .commit()
    }
}
```

在 Fragment 中：

```kotlin

class MyFragment : Fragment() {
    private lateinit var viewModel: MyViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        viewModel = ViewModelProvider(requireActivity())
            .get(MyViewModel::class.java)
    }
}
```

在这个示例中，我们在 Activity 中实例化了 ViewModel，并将其传递给 Fragment。在 Fragment 中，我们使用 ViewModelProvider 的 get()方法来获取 Activity 中的 ViewModel 实例。由于我们使用了 requireActivity()，即使 Activity 被销毁并重新创建，Fragment 仍然可以访问到相同的 ViewModel 实例
