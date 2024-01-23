---
title: Adapter 的使用
date: 2023-03-23
tags: [Android]
---

## Adapter

### 概述

Android 的 Adapter 是一个关键组件，它使开发人员能够将视图与数据填充。Adapter 作为数据源和视图之间的桥梁，允许以适合用户的格式显示数据。Android 中 Adapter 的目的是提供一种灵活高效地在各种格式（包括列表、网格和微调控件）中显示数据的方式

Adapter 通过为数据源中每个项目创建一个视图并将数据绑定到该视图来工作。这个过程对于数据源中每个项目都会重复进行，直到所有项目都被显示出来。此外，Adapter 还提供了视图回收功能，这意味着不再需要使用的视图可以用于新项，从而减少内存使用量并提高性能

对于开发人员来说，Adapter 带来了很多好处。它们提供了一种一致且模块化地显示数据的方式，使得代码更易于维护和更新。它们还提供了一种自定义外观样式以及处理用户与数据交互（例如选择项或滚动列表）等方面方法，并允许开发人员创建独特而引人入胜的用户界面

Android 有几种类型可用于特定情况下使用不同类型 Adapter, 最常见类型包括 `ArrayAdapter`、`CursorAdapter` 和 `RecyclerView.Adapter` 。 `ArrayAdapter` 用于在简单的 ListView 或 Spinner 中显示数据。`CursorAdapter` 用于从 SQLite 数据库查询中显示数据。`RecyclerView.Adapter` 用于在更复杂的 `RecyclerView` 中显示数据，支持滚动和动画

Adapter 在许多需要将数据显示在用户界面中的情况下是必需的。例如，音乐播放器应用程序可以使用 `ArrayAdapter` 显示歌曲列表，而消息应用程序可以使用 `RecyclerView.Adapter` 显示会话列表。通过遵循最佳实践（如使用 `ViewHolder` 模式来提高性能并分离数据和视图逻辑以提高可维护性），可以有效地实现 Adapter

> 与 xml 的结合，可以使用 [DataBinding](DataBinding.md) 来省去很多的 findViewById

### 区别

`RecyclerView.Adapter` 和`ArrayAdapter` 是 Android 开发中用于将数据绑定到视图的两种不同类型的适配器。虽然它们有一些相似之处，但在其目的、优点和缺点方面也存在明显差异

`RecyclerView.Adapter` 是一种更灵活的适配器，用于在可滚动列表或网格中显示大量数据。它高度可定制，并允许开发人员创建具有不同视图类型的复杂布局。与`ArrayAdapter` 相比，它提供更好的性能，因为它只创建当前屏幕上可见的必要视图。`RecyclerView.Adapter` 还支持动画和项目装饰，使其非常适合创建外观精美的列表

另一方面，`ArrayAdapter` 是一个简单的适配器，在 ListView 中显示静态数据列表时使用。它易于使用，并且需要最少量代码来实现。当数据集很小且不需要任何复杂布局时，`ArrayAdapter` 非常有用。当预计数据集不会经常更改时也是一个很好选择。然而，它不支持多个视图类型，并且不适合显示大量数据

## Lists

这里有两种方式去呈现列表，原生的 ListView 和 MD 的 RecyclerView，默认情况下他们都显示文本列表，如果要用卡片列表，也就是列表的元素是像 LinearLayout 这样的，就需要设置 Adapter 来管理了

本文用的例子是常见的商品列表的呈现，在 `entity/Product.java` 中定义了商品卡片的属性，包含商品名称、价格、图片 id。xml 文件的 id 什么的语义化地看着吧

### ListView

Android 的 ListView 是一种常用的 UI 组件，用于在屏幕上显示大量数据，如联系人列表、音乐播放列表等。它可以自动管理滚动、回收视图等，使得应用程序能够高效地处理大量数据

使用 ListView 的基本步骤如下：

- 创建一个 ListView 对象，并将其添加到布局中
- 创建一个 Adapter 对象，用于将数据绑定到 ListView 上
- 将 Adapter 对象设置为 ListView 的 Adapter
- 在 Adapter 对象中实现 `getView()` 方法，用于创建和更新每个列表项的视图

**呈现纯字符的 ListView：**

```java
ListView listView = findViewById(R.id.string_list);
ArrayAdapter<String> arrayAdapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, strings);
listView.setAdapter(arrayAdapter);
```

**带有 Adapter：**

```java
public class ListViewAdapter extends ArrayAdapter<Product> {
  private Context context;
  private List<Product> products;

  public ListViewAdapter(Context context, List<Product> products) {
    super(context, R.layout.item_product, products);
    this.context = context;
    this.products = products;
  }

  @NonNull
  @Override
  public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
    LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    @SuppressLint("ViewHolder") View rowView = inflater.inflate(R.layout.item_product, parent, false);

    ImageView productImage = rowView.findViewById(R.id.product_image);
    TextView productName = rowView.findViewById(R.id.product_name);
    TextView productPrice = rowView.findViewById(R.id.product_price);

    Product product = products.get(position);
    productImage.setImageResource(product.getImage());
    productName.setText(product.getName());

    // Format price to $xx.xx
    @SuppressLint("DefaultLocale") String price = String.format("$%.2f", product.getPrice());
    productPrice.setText(price);
    return rowView;
  }
}
```

其中 #L14~15：

- 这段代码的目的是在一个产品列表中显示每个产品的相关信息。每当一个产品需要被显示时，就会创建一个包含该产品信息的 View 对象，并将其添加到产品列表中，从而实现动态的产品列表展示

- 在 `ArrayAdapter` 的 `getView` 方法中，需要使用 `LayoutInflater` 将一个布局文件解析成一个 View 对象，然后填充数据并返回该 View 对象，以供 ListView 或 GridView 等容器显示。因此，这段代码的目的是为了创建每个列表项的 View 对象，以便在列表中显示数据

- 具体来说，该方法会在每个列表项需要显示时被调用，通过调用 `LayoutInflater` 的 `inflate` 方法，将布局文件解析成一个 View 对象，并填充该 View 对象的数据，最后返回该 View 对象。这样，ListView 或 GridView 容器就可以将每个 View 对象添加到列表中，并显示相应的数据

### RecyclerView

在 Material Design 中，ListView 对应的组件是 RecyclerView。与 ListView 相比，RecyclerView 提供了更高的灵活性和性能，可以自定义布局、动画和滚动行为等。使用 RecyclerView 的步骤与 ListView 类似，只是需要创建一个 RecyclerView 对象，并使用 `LayoutManager` 来管理布局

其中，RecycleLayout 中使用 LayoutManager 来管理布局的原因如下：

- 支持多种布局方式：LayoutManager 提供了多种布局方式，例如线性布局、网格布局、瀑布流布局等，可以根据不同的需求选择合适的布局方式

- 提高性能：RecycleLayout 是用于显示大量数据的控件，使用 LayoutManager 可以提高性能，因为它可以对屏幕上的视图进行复用，避免重复创建视图，从而减少内存占用和提高滑动的流畅性

- 灵活性：LayoutManager 可以自定义布局方式，可以根据需求实现不同的布局效果，比如实现类似于 ViewPager 的效果等

- 支持动画：LayoutManager 还支持动画效果，可以在添加、删除、移动等操作时，为视图添加动画效果，增强用户体验

**具体实现：**

```java
// RecyclerAdapter.java
public class RecyclerAdapter extends RecyclerView.Adapter<RecyclerAdapter.ViewHolder> {
  private List<Product> productList;

  public RecyclerAdapter(List<Product> productList) {
    this.productList = productList;
  }

  @NonNull
  @Override
  public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
    View view = LayoutInflater.from(parent.getContext())
        .inflate(R.layout.item_product, parent, false);
    return new ViewHolder(view);
  }

  // Bind data to ViewHolder
  @Override
  public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
    Product product = productList.get(position);
    holder.productImage.setImageResource(product.getImage());
    holder.productName.setText(product.getName());

    // Format price to $xx.xx
    @SuppressLint("DefaultLocale") String price = String.format("$%.2f", product.getPrice());
    holder.productPrice.setText(price);
  }

  @Override
  public int getItemCount() {
    return productList.size();
  }

  public static class ViewHolder extends RecyclerView.ViewHolder {
    ImageView productImage;
    TextView productName;
    TextView productPrice;

    public ViewHolder(@NonNull View itemView) {
      super(itemView);
      productImage = itemView.findViewById(R.id.product_image);
      productName = itemView.findViewById(R.id.product_name);
      productPrice = itemView.findViewById(R.id.product_price);
    }
  }
}
```

其中，`onCreateViewHolder`、`onBindViewHolder` 是必须重写的方法，用于创建视图和绑定数据到视图上

在 RecycleLayout 中，每个视图都是一个 `ViewHolder` 对象，ViewHolder 中包含了要显示的视图。当 RecycleLayout 需要创建新的视图时，就会调用 `onCreateViewHolder` 函数，该函数需要返回一个 ViewHolder 对象。在创建 ViewHolder 对象时，需要将要显示的视图添加到一个 ViewGroup 中

因此，`onCreateViewHolder` 函数的参数 V`iewGroup parent` 表示要将创建的视图添加到哪个 `ViewGroup` 中。一般情况下，该参数是 RecycleLayout 的父容器，也就是 RecyclerView。在创建视图时，需要使用 `LayoutInflater` 来将布局文件转换为一个 View 对象，并将该 View 添加到 parent 中。这样就可以将创建的视图添加到 RecycleLayout 中，并进行显示

而 **ViewHolder** 是一种设计模式，用于在列表或网格视图中提高性能。ViewHolder 主要有以下作用和好处：

- 减少 findViewById 的调用次数：ViewHolder 通过缓存 item view 中的子视图，可以避免在每次 getView()方法中都调用 findViewById()方法，从而提高性能

- 提高滑动的流畅性：ViewHolder 可以减少因为频繁调用 findViewById()而导致的 UI 卡顿现象，从而提高滑动的流畅性

- 简化代码：ViewHolder 可以使代码更加简洁，因为它可以将所有与 item view 相关的代码都集中在一起，方便维护和管理

ViewHolder 的设计思想是将 item view 的子视图缓存起来，以便在下次使用时可以直接获取，从而提高性能。此外，ViewHolder 还可以将 item view 中的子视图与数据模型进行绑定，使得数据的显示和更新更加方便和高效

并且通常来说，会设计一个 `bindData()` 函数来将数据设置到 View 上：

```java
// in holder class
public void bindData(Product product) {
  productImage.setImageResource(product.getImage());
  productName.setText(product.getName());

  // Format price to $xx.xx
  @SuppressLint("DefaultLocale") String price = String.format("$%.2f", product.getPrice());
  productPrice.setText(price);
}

// to use:
Product product = productList.get(position);
holder.bindData(product);
```

> 而且对于控制 item 中 View 属性（像是位置、大小等），也会在 bindData 中设置

使用 Adapter：

```java
public class ProductListActivity extends AppCompatActivity {
  private RecyclerView recyclerView;
  private ListView listView;
  private RecyclerAdapter recyclerAdapter;
  private ArrayList<Product> products;

  final String[] imgs = {"iphone", "fans", "orange", "paper", "bluemoon"};
  final String[] names = {"Iphone 11", "Fan", "Orange", "Tissue", "Blue Moon Laundry Detergent"};
  final double[] prices = {1067.5, 3.99, 1.99, 0.99, 4, 98};

  void init() {
    products = new ArrayList<>();
    for (int i = 0; i < imgs.length; ++i) {
      @SuppressLint("DiscouragedApi") int imgId = getResources().getIdentifier(imgs[i], "drawable", getPackageName());
      products.add(new Product(imgId, names[i], prices[i]));
    }
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.product_view);
    init();

    recyclerView = findViewById(R.id.product_recycler);
    recyclerView.setLayoutManager(new LinearLayoutManager(this));
    recyclerAdapter = new RecyclerAdapter(products);
    recyclerView.setAdapter(recyclerAdapter);
  }
}
```

其中，RecycleLayout 中要使用 LayoutManager 来管理布局。因为：

- 支持多种布局方式：LayoutManager 提供了多种布局方式，例如线性布局、网格布局、瀑布流布局等，可以根据不同的需求选择合适的布局方式

- 提高性能：RecycleLayout 是用于显示大量数据的控件，使用 LayoutManager 可以提高性能，因为它可以对屏幕上的视图进行复用，避免重复创建视图，从而减少内存占用和提高滑动的流畅性

- 灵活性：LayoutManager 可以自定义布局方式，可以根据需求实现不同的布局效果，比如实现类似于 ViewPager 的效果等

- 支持动画：LayoutManager 还支持动画效果，可以在添加、删除、移动等操作时，为视图添加动画效果，增强用户体验

#### 绑定监听事件

例如想要为每个 item 绑定一个点击事件，可以如下设置

```java
// in RecyclerAdapter.java's class
private OnCardClickListener cardClickListener;

public void setOnCardClickListener(OnCardClickListener onCardClickListener) {
  this.cardClickListener = onCardClickListener;
}

public interface OnCardClickListener {
  void onCardClick(Product card);
}

  @Override
public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
  // ++
  holder.itemView.setOnClickListener(v -> {
    if (cardClickListener != null) {
      cardClickListener.onCardClick(product);
    }
  });
}
```

这样，在使用的时候：

```java
// ++
var recyclerAdapter = new RecyclerAdapter(products);

recyclerAdapter.setOnCardClickListener(product -> {
  Toast.makeText(this, product.getName(), Toast.LENGTH_SHORT).show();
});
```

## BaseAdapter 虚基类

对于这种频繁使用的类来说，当然得把它抽象出来）且继承自更常用的 RecycleView

> 当然有了 [DataBinding](DataBinding.md#baseadapter) 之后就可以少写一堆了

```java
public abstract class BaseAdapter<T> extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

  private List<T> mDataList;

  public BaseAdapter(List<T> dataList) {
    mDataList = dataList;
  }

  @SuppressLint("NotifyDataSetChanged")
  public void setDataList(List<T> dataList) {
    mDataList = dataList;
    notifyDataSetChanged();
  }

  public List<T> getDataList() {
    return mDataList;
  }

  public T getItem(int position) {
    if (mDataList == null || position < 0 || position >= mDataList.size()) {
      return null;
    }
    return mDataList.get(position);
  }

  @Override
  public int getItemCount() {
    return mDataList == null ? 0 : mDataList.size();
  }

  @Override
  public int getItemViewType(int position) {
    return super.getItemViewType(position);
  }

  protected abstract int getLayoutId();

  // View holder
  @NonNull
  public abstract RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType);

  public abstract void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position);
}
```

这里包含了

- `setDataList(List<T> dataList)`：设置 mDataList 的值为传入的参数 dataList，并调用 `notifyDataSetChanged()` 方法通知 RecyclerView 数据已经改变

- `getLayoutId()` 抽象方法：子类需要实现该方法以提供布局文件 ID

- `onCreateViewHolder` 抽象方法：子类需要实现该方法以创建 ViewHolder 对象并返回。parent 参数是父容器视图组件；viewType 是视图类型，在多种不同类型的 item 中使用时会用到（例如聊天记录中文字、图片等）

- `onBindViewHolder` 抽象方法：子类需要实现该方法以绑定 ViewHolder 和数据源中指定位置上的数据项。holder 参数是要绑定数据项所在行对应的 ViewHolder 对象；position 是要绑定哪个位置上面的 item

### 使用

```java
public class ActivitiesAdapter extends BaseAdapter<ActivityCard> {
  private List<ActivityCard> mCard;

  public ActivitiesAdapter(List<ActivityCard> data) {
    super(data);
    this.mCard = data;
  }

  @Override
  protected int getLayoutId() {
    return R.layout.item_card;
  }

  @NonNull
  @Override
  public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
    View view = LayoutInflater.from(parent.getContext()).inflate(getLayoutId(), parent, false);
    return new CardViewHolder(view);
  }

  @Override
  public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
    ActivityCard card = this.mCard.get(position);
    ((CardViewHolder) holder).bindData(card);
  }

  public static class CardViewHolder extends RecyclerView.ViewHolder {
    private TextView mTitle;

    public CardViewHolder(View itemView) {
      super(itemView);
      mTitle = itemView.findViewById(R.id.title);
    }

    public void bindData(ActivityCard data) {
      mTitle.setText(data.getTitle());
    }
  }
}
```

同样地需要定义 ViewHolder
