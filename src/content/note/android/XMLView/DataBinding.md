---
title: DataBinding
date: 2023-05-03
tags: [Android]
---

[文档](https://developer.android.com/topic/libraries/data-binding)

主要为了解决繁琐的 findViewById 及其 null 的问题，更方便地将数据绑定到 xml View 上

更多还是看与 GPT 的 [Logs](../../../gpt/android/DataBinding.md) 吧）

#### BaseAdapter

```kotlin
abstract class BaseAdapter<T, VB : ViewDataBinding>:
    RecyclerView.Adapter<BaseAdapter.ViewHolder<VB>>() {

    private var onItemClickListener: ((T) -> Unit)? = null
    protected var items: List<T> = listOf()

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder<VB> {
        val inflater = LayoutInflater.from(parent.context)
        val binding = DataBindingUtil.inflate<VB>(inflater, getLayoutId(), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder<VB>, position: Int) {
        val item = items[position]
        holder.bind(item)
        holder.itemView.setOnClickListener {
            onItemClicked(item, holder.itemView)
        }
    }

    override fun getItemCount(): Int {
        return items.size
    }

    @SuppressLint("NotifyDataSetChanged")
    override fun updateItems(newItems: List<T>) {
        items = newItems
        notifyDataSetChanged()
    }

    protected abstract val getLayoutId: Int

    open fun onItemClicked(item: T, view: View) {
        onItemClickListener?.invoke(item)
    }

    class ViewHolder<VB : ViewDataBinding>(val binding: VB) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(item: Any?) {
            binding.executePendingBindings()
        }
    }
}
```

**使用：** 这下只需要指定 item 的 layout 和将数据绑在 View 上就好了

```kotlin
class ContactAdapter : BaseAdapter<Profile, ItemContactBinding>() {
    override val getLayoutId = R.layout.item_contact

    override fun onBindViewHolder(holder: ViewHolder<ItemContactBinding>, position: Int) {
        super.onBindViewHolder(holder, position)
        val data = items[position]
        val binding = holder.binding
        try {
            Glide.with(holder.itemView.context)
                .load(data.avatar)
                .into(binding.contactAvatar)

            binding.contactName.text = data.name
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun onItemClicked(item: Profile, view: View) {
        val bundle = Bundle()
        bundle.putSerializable("profile", item)
        val intent = Intent(view.context, ProfileActivity::class.java)
        intent.putExtras(bundle)
        startActivity(view.context, intent, null)
    }
}
```
