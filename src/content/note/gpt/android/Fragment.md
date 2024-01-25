---
title: Fragment
date: 2023-03-27
tags: [GPT, android]
---

## 参数

### Fragment 的启动参数

> 这一段是必须的吗？什么时候会用到它

```java
  public static ItemFragment newInstance(int columnCount) {
    ItemFragment fragment = new ItemFragment();
    Bundle args = new Bundle();
    args.putInt(ARG_COLUMN_COUNT, columnCount);
    fragment.setArguments(args);
    return fragment;
  }
```

这段代码是一个静态方法，用于创建一个新的 ItemFragment 实例。它会将传入的参数 columnCount 存储在 Bundle 对象中，并将其作为参数设置给新的 ItemFragment 实例。这段代码通常用于在 Activity 中创建 Fragment 实例时，传递参数给 Fragment 使用。如果不需要在 Fragment 中使用参数，可以省略这段代码

### 通常会有哪些参数会需要传递？

通常需要传递的参数包括但不限于以下几种：

1. 数据源：例如需要在 Fragment 中展示一些数据，这些数据需要通过参数的形式传递给 Fragment

2. 样式参数：例如展示界面需要的列数、行数、颜色等等，这些样式参数也可以通过参数的形式传递给 Fragment

3. 状态参数：例如用户登录状态、Fragment 当前所处的状态等等，这些状态参数可以通过参数的形式传递给 Fragment，以便 Fragment 在不同的状态下进行不同的操作

4. 其他参数：根据具体业务需求，可能还需要传递其他的参数，例如需要在 Fragment 中调用某个方法等等，这些参数也可以通过参数的形式传递给 Fragment

### 参数的示例案例

> 那么什么时候会用到这些？请举个实际的例子

举个实际例子，假设我们正在开发一个新闻阅读应用，需要在一个 Fragment 中展示新闻列表。这时候就需要将新闻数据源传递给该 Fragment。同时，我们还需要在 Fragment 中设置一些样式参数，例如展示界面的列数、行数、颜色等等，以及一些状态参数，例如当前用户是否已经登录等等

具体实现时，可以通过以下方式传递参数：

1. 数据源参数：可以将新闻数据源存储在 Bundle 对象中，然后通过 setArguments()方法传递给 Fragment。在 Fragment 中，可以通过 getArguments()方法获取到这些参数，然后进行数据展示

2. 样式参数：可以将列数、行数、颜色等样式参数存储在 Bundle 对象中，然后通过 setArguments()方法传递给 Fragment。在 Fragment 中，可以通过 getArguments()方法获取到这些参数，然后设置展示界面的样式

3. 状态参数：可以将当前用户是否已经登录等状态参数存储在 Bundle 对象中，然后通过 setArguments()方法传递给 Fragment。在 Fragment 中，可以通过 getArguments()方法获取到这些参数，然后根据用户登录状态进行不同的操作

总的来说，通过传递参数的方式，我们可以方便地将数据源、样式参数、状态参数等传递给 Fragment，从而实现不同的业务需求

### 这种方式很像 React 的什么？

这种方式类似于 React 中的 props（属性）和 state（状态）的概念。在 React 中，组件通过 props 来接收父组件传递过来的参数，通过 state 来管理组件自身的状态。同样地，在 Android 中，Fragment 通过 getArguments()方法获取到父组件传递过来的参数，通过 setArguments()方法设置自身的参数。这种方式都是为了实现组件之间的数据传递和状态管理，从而实现不同的业务需求

### notifyDataSetChanged

notifyDataSetChanged 是用于通知数据集发生了变化，需要更新视图的方法。在 RecyclerView 中，它同样也是用于刷新列表的数据和视图

当 RecyclerView 的数据集发生变化时，可以通过调用 Adapter 的 notifyDataSetChanged 方法来通知 RecyclerView 更新视图。这个方法会重新调用 Adapter 的 getItemCount、onCreateViewHolder 和 onBindViewHolder 方法，重新绑定数据和视图

例如，当我们向 RecyclerView 中添加或删除一条数据时，可以在数据源中进行添加或删除操作后，再调用 Adapter 的 notifyDataSetChanged 方法，这样 RecyclerView 就会重新刷新数据和视图

具体使用方法如下：

1. 在 Adapter 中添加数据源和数据操作方法

2. 在 RecyclerView 的 Activity 或 Fragment 中，创建 Adapter 实例，并将其设置给 RecyclerView

3. 在需要更新数据时，修改数据源中的数据

4. 调用 Adapter 的 notifyDataSetChanged 方法，通知 RecyclerView 更新视图

注意事项：

1. 在调用 notifyDataSetChanged 方法前，必须确保数据源已经发生了变化

2. 如果只是修改了某一项数据，可以使用 Adapter 的 notifyItemChanged 方法来通知 RecyclerView 仅更新该项数据对应的视图

3. 如果只是添加了一条新数据，可以使用 Adapter 的 notifyItemInserted 方法来通知 RecyclerView 添加新的一项

4. 如果只是删除了一条数据，可以使用 Adapter 的 notifyItemRemoved 方法来通知 RecyclerView 删除该项数据

5. 在使用 RecyclerView 时，建议使用 ViewHolder 来优化列表性能，避免重复创建和销毁视图

## viewType

### 举例

> 请举例说明 onCreateViewHolder(ViewGroup parent, int viewType) 中用到 viewType 的情况，并包括直到 setAdapter 的时候

在 RecyclerView 中，我们可以通过 `getItemViewType(int position)` 方法来获取某个位置的 item 的类型，这个类型就是在 `onCreateViewHolder(ViewGroup parent, int viewType)` 方法中传入的 viewType。通常情况下，我们在 onCreateViewHolder 方法中根据 viewType 来创建不同类型的 ViewHolder

举个例子，假设我们有一个 RecyclerView，其中有两种类型的 item：一种是普通的文本 item，另一种是图片 item。我们可以在 getItemViewType 方法中根据数据源中的数据类型来判断当前 item 的类型，返回不同的值表示不同的类型。例如，我们可以在 getItemViewType 方法中做如下判断：

```java
@Override
public int getItemViewType(int position) {
    if (mDataList.get(position) instanceof String) {
        // 如果当前位置的数据是字符串类型，返回 0，表示是普通的文本 item
        return 0;
    } else if (mDataList.get(position) instanceof Bitmap) {
        // 如果当前位置的数据是 Bitmap 类型，返回 1，表示是图片 item
        return 1;
    }
    return super.getItemViewType(position);
}
```

然后在 onCreateViewHolder 方法中根据 viewType 来创建不同的 ViewHolder：

```java
@Override
public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
    if (viewType == 0) {
        // 如果 viewType 是 0，表示是普通的文本 item，创建文本 item 的 ViewHolder
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_text, parent, false);
        return new TextViewHolder(view);
    } else if (viewType == 1) {
        // 如果 viewType 是 1，表示是图片 item，创建图片 item 的 ViewHolder
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_image, parent, false);
        return new ImageViewHolder(view);
    }
    return null;
}
```

最后在 setAdapter 方法中设置 RecyclerView.Adapter 的实例：

```java
mRecyclerView.setAdapter(new MyAdapter(mDataList));
```

在这个例子中，我们通过 getItemViewType 方法和 onCreateViewHolder 方法来实现了多种类型的 item，而且这些 item 可以混合在同一个 RecyclerView 中显示

### 数据实体类设计

> 那么这样的话，data 的 entity 类会怎么设计的？

在实现多种类型的 item 时，通常需要为每一种类型的 item 创建一个对应的数据实体类。以前面举的例子为例，可能会有一个 TextItem 实体类和一个 ImageItem 实体类来分别表示文本 item 和图片 item 的数据

```java
public class TextItem {
    private String text;

    public TextItem(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }
}

public class ImageItem {
    private Bitmap bitmap;

    public ImageItem(Bitmap bitmap) {
        this.bitmap = bitmap;
    }

    public Bitmap getBitmap() {
        return bitmap;
    }
}
```

在 RecyclerView.Adapter 的子类中，可以使用泛型来指定数据源的类型，例如：

```java
public class MyAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {
    private List<Object> mDataList;

    public MyAdapter(List<Object> dataList) {
        mDataList = dataList;
    }

    @Override
    public int getItemCount() {
        return mDataList.size();
    }

    @Override
    public int getItemViewType(int position) {
        Object item = mDataList.get(position);
        if (item instanceof TextItem) {
            return 0;
        } else if (item instanceof ImageItem) {
            return 1;
        }
        return super.getItemViewType(position);
    }

    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        if (viewType == 0) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_text, parent, false);
            return new TextViewHolder(view);
        } else if (viewType == 1) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_image, parent, false);
            return new ImageViewHolder(view);
        }
        return null;
    }

    @Override
    public void onBindViewHolder(RecyclerView.ViewHolder holder, int position) {
        Object item = mDataList.get(position);
        if (item instanceof TextItem) {
            TextItem textItem = (TextItem) item;
            TextViewHolder textViewHolder = (TextViewHolder) holder;
            // 绑定文本 item 的数据和视图
            textViewHolder.textView.setText(textItem.getText());
        } else if (item instanceof ImageItem) {
            ImageItem imageItem = (ImageItem) item;
            ImageViewHolder imageViewHolder = (ImageViewHolder) holder;
            // 绑定图片 item 的数据和视图
            imageViewHolder.imageView.setImageBitmap(imageItem.getBitmap());
        }
    }

    private static class TextViewHolder extends RecyclerView.ViewHolder {
        TextView textView;

        TextViewHolder(View itemView) {
            super(itemView);
            textView = itemView.findViewById(R.id.text);
        }
    }

    private static class ImageViewHolder extends RecyclerView.ViewHolder {
        ImageView imageView;

        ImageViewHolder(View itemView) {
            super(itemView);
            imageView = itemView.findViewById(R.id.image);
        }
    }
}
```

在这个例子中，我们使用了一个 `List<Object>` 类型的数据源，然后在 getItemViewType 方法中根据每个 item 的类型返回不同的 viewType。在 onCreateViewHolder 方法中根据 viewType 来创建不同类型的 ViewHolder，然后在 onBindViewHolder 方法中根据 item 的类型来绑定数据和视图

注意，这种实现方式需要在创建数据源时就将不同类型的数据实体类添加到同一个 List 中，这样可能会增加代码复杂度和维护难度。如果数据源比较简单，可以考虑使用多个 List 或者使用继承关系来实现不同类型的 item
