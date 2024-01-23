---
title: STL 标准库容器
date: 2022-04-14
tags: [Algorithm, DS, STL]
---

## std::string 字符串

#### 互转

- **数字转 string：** `string s = to_string(整数 | 小数)`;
- **string 转数字：** `int a = stoi(s); double b = stod(s);`

#### 大小写转换

```cpp
transform(all(str), str.begin(), ::tolower);
```

不用带转译的**纯文本格式**，保持缩进：

```cpp
string str = R"(233
    asd\n
    asd
233)";
// cout:
233
    asd\n
    asd
  233
```

#### STL 函数

- **替换：** `c.replace(a, b, "xxx")`，a：替换的初始位置，b：替换的长度
- **查找：**
  - `b.find(c, a)` ：从位置 a 开始，在 b 中找 c
  - `str.find_first_of(str1)` ：找第一次出现的位置，找不到就返回 -1
  - `find` 需要子串和父串全部匹配，`find_first_of` 只需匹配一个字符就可以
- **删除：** `c.erase(a, b)` a：删除的初始位置，b：删除的个数。仅有 a 的话，则删除位置 a 后面的字符
- **截取：** `string s = c.substr(a, b);`，a：截取的初始位置，b：截取的长度

## 序列式容器（可序）

### Vector

#### 构造函数

- `vector()`：创建一个空 `vector`
- `vector(int len)`：创建一个 `vector`，元素个数为 `len`，值默认为 0
- `vector(int len, const T& t)`：创建一个 `vector`，元素个数为 `len`，且值均为 `t`
- `vector(const vector&)`：复制构造函数
- `vector(begin, end)`：复制 `[begin, end)` 区间内另一个数组的元素到数组中

#### 属性

- `a.at(pos)`：返回编号位置的数据
- `a.begin()`：返回数组 _第一个元素_ 的迭代器
- `a.end()`：返回数组的 _最后一个元素+1_ 的迭代器
- `a.rbegin()`：将数组反转后的开始迭代器返回
- `a.rend()`：将数组反转构的结束迭代器返回
- `a.front()`：返回数组的第一个元素
- `a.back()`：返回数组的最后一个元素
- `a.max_size()`：返回数组最大可以是多大
- `a.capacity()`：返回当前数组分配的大小
- `a.size()`：返回数组的长度
- `a.empty()`：判断` vector` 是否为空

#### 方法

- `a.insert(a.begin() + n, x)`：在 下标 $n - 1$ 之前插入 $x$
- `a.push_back(x)`：在数组的最后添加一个数据
- `a.pop_back()`：去掉数组的最后一个数据
- `a.resize(newSize, value = 0)`：改变数组的长度，如果大于当前长度，则填充默认值 0 或 `value`；否则将数组缩减至新长度
- `a.reserve(newCapacity)`：改变当前数组所分配容量的大小，如果小于等于当前容量，则将当前容量改为当前长度
- `a.erase(begin [, end])`：删除迭代器范围的元素
- `a.clear()`：清空当前的数组
- `a.swap(b)`：与另一个数组交换数据
- `a.assign(n, value)`：将 n 个 value 赋值给 a。若原先容量大于 n，则不变；否则变为 n
- `a.assign({list})`：将 [初始化列表](../lang/Cpp.md#initializer-list-列表初始化) 赋值给 a
- `a.assign(arr.from, arr.to)`：将 arr 迭代器范围内的赋值给 a

#### 二维数组

```cpp
vector<vi> aa(5, vi(2, 5)); // 5行2列的5
vector<vi> arr{
  {1, 2, 3, 5}, {5, 3, 1, 5}, {4, 5, 6, 7}
};
for (auto row : arr) {
  cout << toString(row) << endl;
  // for (auto col : row) cout << col << " ";
  // cout << endl;
}
```

### deque

#### 属性方法

- `deq[pos]`：用来访问双向队列中单个的元素
- `deq.front()`：返回第一个元素的引用
- `deq.back()`：返回最后一个元素的引用
- `deq.push_front(x)`：把元素 x 插入到双向队列的头部
- `deq.pop_front()`：弹出双向队列的第一个元素
- `deq.push_back(x)`：把元素 x 插入到双向队列的尾部
- `deq.pop_back()`：弹出双向队列的最后一个元素

#### 双向队列的一些特点

- 支持随机访问，即支持 `[ ]` 以及 `at()`，但是性能没有`vector`好
- 与数组`比较，deque` 的优势是：头部插入和删除时，不需要搬移元素，效率特别高，而且在扩容时，也不需要搬移大量的元素，因此其效率是必数组高的
- 与 `list` 比较，其底层是连续空间，空间利用率比较高，不需要存储额外字段
- `deque`的元素存取和迭代器操作会稍微慢一些，因为`deque`的内部结构会多一个间接过程
- `deque`迭代器是特殊的智能指针，而不是一般指针，它需要在不同的区块之间跳转
- `deque`可以包含更多的元素，其`max_size`可能更大，因为不止使用一块内存
- `deque`的内存区块不再被使用时，会被释放，`deque`的内存大小是可缩减的。不过，是不是这么做以及怎么做由实际操作版本定义

#### 但是

- `deque` 有一个致命缺陷：不适合遍历。因为在遍历时，`deque` 的迭代器要频繁的去检测其是否移动到某段小空间的边界，导致效率低下
- 而序列式场景中，可能需要经常遍历，因此在实际中，需要线性结构时，大多数情况下优先考虑数组和 `list`
- `deque` 的应用并不多，而目前能看到的一个应用就是，`STL` 用其作为 `stack` 和 `queue` 的底层数据结构

### List

`List` 是 STL 实现的双向链表，与`vectors`相比，它允许快速的插入和删除，但是随机访问却比较慢

可以直接` s.sort();` 或 `s.sort(greater<name>());`

## 关联式容器 （已序）

### Map multimap

对 `map` 的定义：

```cpp
map<class Key, class Value, class Compare = less<Key>> name
```

所以定义`map`的时候，默认是按`key`的值小到大排序的。要按大到小时， 就`map<key, value, greater<key>>name`

#### 属性方法

- 插入：`s.insert(make_pair(key, value));`
- 指定位置插入：`s.insert(s.begin() + n, pair);`

当要按自定义 `key` 来排序时，要另外写 cmp 的**仿函数**：

```cpp
void Map() {
  struct CmpByKeyLen {
    bool operator()(const string& k1, const string& k2) {
      return k1 + k2 < k2 + k1;
    } // 按 key 的字典序升序
  };

  vector<PSI> a{
    {"fish", 233}, {"mie", 123}, {"haha", 100}, {"ohh", 233}
  };
  map<string, int, CmpByKeyLen> m;
  for (auto ele : a) m.insert(ele);

  for (auto ele : m) {
    cout << "name: " << ele.first
      << "\tscore: " << ele.second << endl;
  }
}
```

按 **`Value`** 排序：

```cpp
void Map_Value() {
  vector<PSI> a{
    {"fish", 233}, {"mie", 123}, {"haha", 100}, {"ohh", 233}
  };
  map<string, int> m;
  for (auto ele : a) m.insert(ele); // 构造数据

  vector<PSI> ans(all(m)); // 需要移植到vector才能排序
  auto byValue = [](const PSI& lhs, const PSI& rhs) {
    return lhs.second < rhs.second;
  };
  sort(all(ans), byValue);

  for (auto ele : ans) {
    cout << "name: " << ele.first
      << "\tscore: " << ele.second << endl;
  }
}
```

#### 与 `unordered_map` 区别

- **运行效率方面：** `unordered_map` 最高，而 `map` 效率较低但提供了稳定效率和有序的序列
- **占用内存方面：** `map` 内存占用略低，`unordered_map` 内存占用略高，而且是线性成比例的

#### 内部实现机理

- **`map`：** `map` 内部实现了一个**红黑树**，该结构具有自动排序的功能，因此 `map` 内部的所有元素都是有序的。红黑树的每一个节点都代表着 `map` 的一个元素，因此对于 `map` 进行的查找、删除、添加等一系列的操作都相当于是对红黑树进行这样的操作，故红黑树的效率决定了 `map` 的效率
- **`unordered_map`：** `unordered_map` 内部实现了一个**哈希表**，因此其元素的排列顺序是杂乱的，无序的

#### 优点、缺点、使用场景

- **`map`：**
  - **优点：** 有序性，这是 `map` 结构最大的优点，其元素的有序性在很多应用中都会简化很多的操作。内部实现一个红黑树使得 `map` 的很多操作在 $\log_2{n}$ 的时间复杂度下就可以实现，因此效率非常的高
  - **缺点：** 空间占用率高，因为 `map` 内部实现了红黑树，虽然提高了运行效率，但是因为每一个节点都需要额外保存父节点，孩子节点以及红/黑性质，使得每一个节点都占用大量的空间
  - **适用处：** 对于那些有顺序要求的问题，用 `map` 会更高效一些
- **`unordered_map`：**
  - **优点：** 内部实现了哈希表，因此其查找速度是常量级别的 $O(1)$
  - **缺点：** 哈希表的建立比较耗费时间
  - **适用处：** 对于查找问题，`unordered_map` 会更加高效一些，因此遇到查找问题，常会考虑一下用 `unordered_map`

### Set multiset

`set` 是关联容器，含有 `Key` 类型对象的已排序集。用比较函数 `compare` 进行排序。搜索、移除和插入拥有对数复杂度。`set` 和 `multiset` 的底层实现是红黑树

与 `map` 不同，`set` 中的元素即是键值又是实值，`set` 不允许两个元素有相同的键值。不能通过 `set` 的迭代器去修改 `set` 元素，原因是修改元素会破坏 `set` 组织。当对容器中的元素进行插入或者删除时，操作之前的所有迭代器在操作之后依然有效

由于 `set` 元素是排好序的，且默认为升序，因此当 `set` 集合中的元素为结构体或自定义类时，该结构体或自定义类必须实现运算符 `<` 的重载

`multiset` 特性及用法和 `set` 完全相同，唯一的差别在于它允许键值重复

- `set` 的定义
  ```cpp
  set<class key, class compare = less<key_name>> name;
  ```
- 一些函数：
  ```cpp
  a.insert(key)  //插入key
  a.erase(key)  //删除key
  a.erase(*a.begin() + n)  //删除下标n
  ```
- 其实道理和 `map` 差不多 hh

## 容器适配器

本质上就是使用 STL 容器来封装成另外的 API，来满足对某种数据结构的需求

虽然 stack 和 queue 中也可以存放元素，但在 STL 中并没有将其划分在容器的行列，而是将其称为容器适配器。这是因为 stack 和 queue 只是对 deque 的接口进行了包装

### Stack

#### 属性方法

- `stack<int> s`：定义栈
- `s.empty()：bool`：判断栈是否为空
- `s.size()：int`：返回栈中的元素个数
- `s.pop()：void`：删除栈中的顶部元素
- `s.top()：type`：返回栈中的顶部元素
- `s.push(item)：void`：往栈顶压入元素

### 队列

#### `queue` 队列

- **属性方法：**
  - `queue<int> q`：定义队列
  - `q.empty()：bool`：判断队列是否为空
  - `q.size()：int`：返回队列中的元素个数
  - `q.pop()：void`：删除队列中的顶部元素
  - `q.push(item)：void`：往队列尾部压入元素
  - `q.front()：type`：返回队首元素的值
  - `q.back()：type`：返回队尾元素的值

#### `priority_queue` 优先队列

- 和 `queue` 不同的就在于，可以自定义其中数据的优先级，让优先级高的排在队列前面，优先出队。 优先队列具有队列的所有特性，包括基本操作，只是在这基础上添加了内部的一个排序，它本质是一个 **堆** 实现的

- **定义：**`priority_queue<元素类型，基础序列的类型，比较的类型> name;`。基础序列必须是由数组实现的容器，默认为 `vector`；比较类型默认为 `less<value_type>`

  ```cpp
  priority_queue <PII, vector<PII>, cmp> q;
  priority_queue <int, vector<int>, greater<int> > q;
  ```

- **栗子：** 当然，也可以用 `struct` 代替 `pair`

  ```cpp
  void Priority_Struct() {
    struct Student {
      string name;
      int score;
    };
    struct cmp {
      bool operator()(const Student& a, const Student& b) const {
        return a.score < b.score || (
          a.score == b.score &&
          a.name + b.name > b.name + a.name);
      } // 先按 score 降序，再按 name 字典序升序
    };

    vector<Student> a{ {"fish", 233}, {"mie", 123}, {"haha", 100}, {"ohh", 233}};

    priority_queue <Student, vector<Student>, cmp> pq;
    for (auto ele ： a) pq.push(ele);

    while (!pq.empty()) {
      auto ele = pq.top();
      cout << "name： " << ele.name
        << "\tscore： " << ele.score << endl;
      pq.pop();
    }
  }
  ```

## 迭代器

在想要遍历或访问数据结构中的数据时，一方面希望只使用共有的方法就能遍历，另一方面又希望能够统一各个数据结构的遍历方式，于是就有了 **迭代器**

就如，`std::vector` 是用数组实现的，`std::list`使用链表实现的，`std::map`则是红黑树实现，每个 **容器** 的遍历方式都不一样，遍历的边界也都不一样，这时候就需要迭代器去统一

而对表的一些操作，尤其是在表的中间进行插入和删除的操作，需要位置的概念。在 STL 中位置由内嵌的 `iterator` 表示。它定义了一对方法：

- `iterator begin()`：表示容器|表的第一项
- `Iterator end()`：表示容器|表最后一项之后的位置

使用迭代器对表的遍历，即为从表头一直到表尾。如：

```cpp
for (vector<int>::iterator it = arr.begin(); it != arr.end(); ++it) {
  std::cout << *it << " ";
}
```

#### 一些对迭代器的操作

- `++it` 和 `++it`：将迭代器推到下一个位置
- `--it` 和 `it--`：将迭代器推到上一个位置
- `it1 == it2` 和 `it1 != it2`：比较是否指向同一个位置
- `*it`，返回迭代器指向数据的引用
- `It + n` 和 `it - n`：将迭代器向前或向后推 n 个位置

其中，对于数据的访问有两种情况：只读或读写：`const_iterator` 表示只读迭代器，不允许改写指向元素的值， `iterator` 则是可读写迭代器

#### 而在 STL 中

- 随机访问： `vector`、`deque`
- 不支持：`stack`、`queue`、`priority_queue`
- 双向：`list`、`set`、`multiset`、`map`、`multimap`

范围总是 $[begin, end)$

## STL 函数

### 查找算法

判断容器中是否包含某个值

- **基于已序序列的二分搜索法：**
  - **`binary_search(begin, end, value)： bool`：** 查找 `value`，找到返回 `true`。重载的版本实用指定的比较函数对象或函数指针来判断相等
  - **`lower_bound(begin, end, value)： iterator`：** 返回 **小于等于** `value` 的迭代器，可自定义比较函数，或重载 `<`
  - **`upper_bound(begin, end, value)： iterator`：** 返回 **大于** `value` 的迭代器
  - **`equal_range(begin, end, value)： pair<iterator>`：** 返回一对迭代器，第一个表示 `lower_bound`，第二个表示 `upper_bound`
- **数数：**
  - **`count(begin, end, value)： int`：** 返回相等元素个数
  - **`count_if(begin, end, fun)： int`：** 返回满足 `fun 函数` 条件的个数
- **找数：**
  - **`find(begin, end, value)： iterator`：** 返回找到的迭代器，找不到则返回 `arr.end()`
  - **`find_if(begin, end, fun)： iterator`：** 使用输入的函数代替等于操作符执行 `find`
  - **`find_first_of(begin, end, b_begin, b_end)： iterator`：** 两次循环地遍历 `b` 与 `arr`，返回 `b` 中元素第一次在 `arr` 中出现的迭代器，找到即终止，找不到则返回`arr.end()`
- **找子序列：**
  - **`find_end(begin, end, b_begin, b_end)： iterator`：** 返回 最后一次出现 **连续子序列 b** 的迭代器，找不到返回 `arr.end()`
  - **`search(begin, end, b_begin, b_end)： iterator`：** 返回 第一次出现 **连续子序列 b** 的迭代器，找不到返回 `arr.end()`
  - **`search_n(begin, end, cnt, value)： iterator`：** 返回连续出现 `cnt` 次的 `value` 的迭代器
    &emsp;&emsp;

### 修改序列的操作

- **`inplace_merge`：** 合并两个**有序序列**
- **`merge(all(a), all(b), back_inserter(ans))： void`：** 合并两个有序序列，存放到另一个序列。重载版本使用自定义的比较
- **`partition`：** 对指定范围内元素重新排序，使用输入的函数，把结果为 `true` 的元素放在结果为 `false` 的元素之前
- **`random_shuffle`：** 对指定范围内的元素随机调整次序。重载版本输入一个随机数产生操作
- **`reverse`：** 将指定范围内元素重新反序排序
- **`reverse_copy`：** 与 `reverse` 类似，不过将结果写入另一个容器
- **`rotate`：** 将指定范围内元素移到容器末尾，由 `middle` 指向的元素成为容器第一个元素
- **`rotate_copy`：** 与 `rotate` 类似，不过将结果写入另一个容器
- **排序：**
  - **`is_sort(all(arr))： bool`：** 判断是否升序
  - **`sort(all(arr))： void`：** 以升序重新排列指定范围内的元素
  - **`stable_sort(all(arr))： void`：** 与 `sort` 类似，不过保留相等元素之间的顺序关系
  - **`partial_sort`：** 对序列做部分排序，被排序元素个数正好可以被放到范围内。重载版本使用自定义的比较操作
  - **`stable_partition`：** 与 `partition` 类似，不过不保证保留容器中的相对顺序
  - **`partial_sort_copy`：** 与 `partial_sort` 类似，不过将经过排序的序列复制到另一个容器
  - **`nth_element`：** 将范围内的序列重新排序，使所有小于第 `n` 个元素的元素都出现在它前面，而大于它的都出现在后面。重 载版本使用自定义的比较操作

### 删除和替换算法

- **`copy`：** 复制序列
- **`copy_backward`：** 与 `copy` 相同，不过元素是以相反顺序被拷贝
- **`iter_swap`：** 交换两个 `ForwardIterator` 的值
- **`remove`：** 删除指定范围内所有等于指定元素的元素。注意，该函数不是真正删除函数。内置函数不适合使用 `remove` 和 `remove_if` 函数
- **`remove_copy`：** 将所有不匹配元素复制到一个制定容器，返回 `OutputIterator` 指向被拷贝的末元素的下一个位置
- **`remove_if`：** 删除指定范围内输入操作结果为 `true` 的所有元素
- **`remove_copy_if`：** 将所有不匹配元素拷贝到一个指定容器
- **`replace`：** 将指定范围内所有等于 `old` 的元素都用 `new` 代替
- **`replace_copy`：** 与 `replace` 类似，不过将结果写入另一个容器
- **`replace_if`：** 将指定范围内所有操作结果为 `true` 的元素用新值代替
- **`replace_copy_if`：** 与 `replace_if`，不过将结果写入另一个容器
- **`swap`：** 交换存储在两个对象中的值
- **`swap_range`：** 将指定范围内的元素与另一个序列元素值进行交换
- **`unique`：** 清除序列中重复元素，和 `remove` 类似，它也不能真正删除元素。重载版本使用自定义比较操作
- **`unique_copy`：** 与 `unique` 类似，不过把结果输出到另一个容器

### 排列组合算法

提供计算给定集合按一定顺序的所有可能排列组合

- **`next_permutation`：** 取出当前范围内的排列，并重新排序为下一个排列。重载版本使用自定义的比较操作
- **`prev_permutation`：** 取出指定范围内的序列并将它重新排序为上一个序列。如果不存在上一个序列则返回 `false`。重载版本使用 自定义的比较操作

### 算术算法

- **`accumulate`：** `iterator` 对标识的序列段元素之和，加到一个由 `val` 指定的初始值上。重载版本不再做加法，而是传进来的 二元操作符被应用到元素上
- **`partial_sum`：** 创建一个新序列，其中每个元素值代表指定范围内该位置前所有元素之和。重载版本使用自定义操作代 替加法
- **`inner_product`：** 对两个序列做内积(对应元素相乘，再求和)并将内积加到一个输入的初始值上。重载版本使用用户定义 的操作
- **`adjacent_difference`：** 创建一个新序列，新序列中每个新值代表当前元素与上一个元素的差。重载版本用指定二元操作计算相 邻元素的差

### 生成和异变算法

- **`fill`：** 将输入值赋给标志范围内的所有元素
- **`fill_n`：** 将输入值赋给 `first` 到 `first + n` 范围内的所有元素
- **`for_each`：** 用指定函数依次对指定范围内所有元素进行迭代访问，返回所指定的函数类型。该函数不得修改序列中的元素
- **`generate`：** 连续调用输入的函数来填充指定的范围
- **`generate_n`：** 与 `generate` 函数类似，填充从指定 `iterator` 开始的 `n` 个元素
- **`transform`：** 将输入的操作作用与指定范围内的每个元素，并产生一个新的序列。重载版本将操作作用在一对元素上，另外一 个元素来自输入的另外一个序列。结果输出到指定容器

### 关系算法

- **`equal`：** 如果两个序列在标志范围内元素都相等，返回 `true`。重载版本使用输入的操作符代替默认的等于操 作符
- **`includes`：** 判断第一个指定范围内的所有元素是否都被第二个范围包含，使用底层元素的<操作符，成功返回 `true`。重载版本使用用户输入的函数
- **`lexicographical_compare`：** 比较两个序列。重载版本使用用户自定义比较操作
- **`max`：** 返回两个元素中较大一个。重载版本使用自定义比较操作
- **`max_element`：** 返回一个 `ForwardIterator`，指出序列中最大的元素。重载版本使用自定义比较操作
- **`min`：** 返回两个元素中较小一个。重载版本使用自定义比较操作
- **`min_element`：** 返回一个 `ForwardIterator`，指出序列中最小的元素。重载版本使用自定义比较操作
- **`mismatch`：** 并行比较两个序列，指出第一个不匹配的位置，返回一对 `iterator`，标志第一个不匹配元素位置。 如果都匹配，返回每个容器的 `last`。重载版本使用自定义的比较操作

### 集合算法

- **`set_union`：** 构造一个有序序列，包含两个序列中所有的不重复元素。重载版本使用自定义的比较操作
- **`set_intersection`：** 构造一个有序序列，其中元素在两个序列中都存在。重载版本使用自定义的比较操作
- **`set_difference`：** 构造一个有序序列，该序列仅保留第一个序列中存在的而第二个中不存在的元素。重载版本使用 自定义的比较操作
- **`set_symmetric_difference`：** 构造一个有序序列，该序列取两个序列的对称差集(并集-交集)

### 堆算法

- **`make_heap`：** 把指定范围内的元素生成一个堆。重载版本使用自定义比较操作
- **`pop_heap`：** 并不真正把最大元素从堆中弹出，而是重新排序堆。它把 `first` 和 `last`-1 交换，然后重新生成一个堆。可使用容器的 `back` 来访问被"弹出"的元素或者使用 `pop_back` 进行真正的删除。重载版本使用自定义的比较操作
- **`push_heap`：** 假设 `first` 到 `last`-1 是一个有效堆，要被加入到堆的元素存放在位置 `last`-1，重新生成堆。在指向该函数前，必须先把 元素插入容器后。重载版本使用指定的比较操作
- **`sort_heap`：** 对指定范围内的序列重新排序，它假设该序列是个有序堆。重载版本使用自定义比较操作

## 参考

- [STL 详解](https://blog.csdn.net/u010183728/article/details/81913729)
- [string 容器详解](https://blog.csdn.net/wzh1378008099/article/details/105687998)
