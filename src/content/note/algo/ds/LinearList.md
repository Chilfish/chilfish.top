---
title: 动态数组、栈、队列
date: 2022-07-30
tags: [Algorithm, DS]
---

## 动态数组（Array）

### 定义

**复杂度：** 支持随机访问，为 $O(1)$。但在插入和删除时，要整体移动部分数组，最坏的情况为 $O(n)$

**优点：** 无须为表中元素之间的逻辑关系而增加额外的存储空间；可以快速的存取表中任一位置的元素

**缺点：** 插入和删除操作需要移动大量元素；当线性表长度较大时，难以确定存储空间的容量；造成存储空间的“碎片”

#### 构造函数

- `Vector()`：创建一个空 `Vector`
- `Vector(int len)`：创建一个 `Vector`，元素个数为 `len`，值默认为 0
- `Vector(int len, const T& data)`：创建一个 `Vector`，元素个数为 `len`，且值均为 `data`
- `Vector(const Vector& a)`：左值引用的拷贝构造函数
- `Vector(Vector&& a)`：右值引用的移动构造函数

#### 属性

- `a.at(pos)`：返回下标位置的元素，并检查下标的合法性
- `a.begin()`：返回数组 _第一个元素_ 的迭代器
- `a.end()`：返回数组的 _最后一个元素 + 1_ 的迭代器
- `a.front()`：返回数组的第一个元素
- `a.back()`：返回数组的最后一个元素
- `a.capacity()`：返回当前数组分配的大小
- `a.size()`：返回数组的长度
- `a.empty()`：判断数组是否为空

#### 方法

- `a.insert(index, x)`：在 下标 `index` 之前插入 $x$
- `a.push_back(x)`：在数组的最后添加一个数据
- `a.pop_back()`：去掉数组的最后一个数据
- `a.resize(newSize, value = 0)`：改变数组的长度，如果大于当前长度，则填充默认值 0 或 `value`；否则将数组缩减至新长度
- `a.reserve(newCapacity)`：改变当前数组所分配容量的大小，如果小于等于当前容量，则将当前容量改为当前长度
- `a.remove(index)`：删除下标的元素
- `a.erase(begin [, end])`：删除下标范围的元素
- `a.clear()`：清空当前的数组，但仅是将长度置零
- `a.assign(n, value)`：将 n 个 value 赋值给 a。若原先容量大于 n，则不变；否则变为 n
- `a.assign({list})`：将 [初始化列表](../../lang/Cpp.md#initializer-list-列表初始化) 赋值给 a

### 主要实现

详见：[Vecotr.hpp](https://github.com/Organic-Fish/FishCode/blob/master/CPP/DataStruct/Vector/Vector.hpp)

主要是借助 `new T[]` 的动态数组，及 $2^n$ 大小的容量来存取数据。如果不使用容量的话，每次增删数据都要进行重新**分配内存**(容量)这样耗时的操作。因此：

- 当目前数组的长度未达到数组容量时，增加数据只要 `arr[len++] = value`、当目前的数组长度达到数组容量时，将重新分配容量，再增加数据
- 重新分配容量要创建临时数组来存放当前的数据，再转移过去：

  ```cpp
  void reserve(int newCapacity) {
    if (newCapacity < curLength) {
      curCapacity = curLength;
      return;
    }

    T* temp = new T[newCapacity];
    for (int i = 0; i < curLength; ++i) {
      temp[i] = arr[i];
    }

    curCapacity = newCapacity;
    swap(arr, temp);
    delete[] temp;
  }
  ```

## 栈（Stack）

### 定义

#### 概念

栈是一种运算受限的线性表。限定仅在表尾进行插入和删除操作的线性表。这一端被称为栈顶，相对地，把另一端称为栈底

向一个栈插入新元素又称作进栈、入栈或压栈，它是把新元素放到栈顶元素的上面，使之成为新的栈顶元素；从一个栈删除元素又称作出栈或退栈，它是把栈顶元素删除掉，使其相邻的元素成为新的栈顶元素

#### 属性方法

- `s.top()`：返回栈顶元素
- `s.pop()`：删除栈顶元素
- `s.push(data)`：往栈顶压入元素
- `s.size()`：返回栈中的元素个数
- `s.empty()`：判断栈是否为空

### 主要实现

借助 Vector 或 Deque 什么的就好，就连标准库的 `std::stack` 主要实现才不到两百行…… 详见： [Stack.hpp](https://github.com/Organic-Fish/FishCode/blob/master/CPP/DataStruct/Stack/Stack.hpp)

```cpp
template<class T> class Stack {
private:
  Vector<T> s;
public:
  explicit Stack() {};
  explicit Stack(const Vector<T>& a): s{a} {}
  T top() const { return s.back(); }
  void pop() { s.pop_back(); }
  void push(const T& data) { s.push_back(data); }
  int size() const { return s.size(); }
  bool empty() const { return s.empty(); }
};
```

> 当然也能重写，也还有用单链表实现的

### 应用

## 队列（Queue）

### 定义

#### 概念

- 队列是一种只允许在一段进行删除操作，在另一端进行插入操作的线性表
- 队列的数据元素又叫做队列元素，在队列中插入一个队列元素称为 **入队**，从队列中删除一个队列元素称为 **出队** ，也正是因为队列只允许在一段插入，另一端删除，也就是： **先进先出** (`FIFO - first in first out`) 的概念
- 队列可以用动态数组或者单链表来实现，其实限制下单链表的操作就是个队列了，比较好写）

#### 属性方法

- `q.empty()`：判断队列是否为空
- `q.size()`：返回队列中的元素个数
- `q.pop()`：删除队列中的顶部元素
- `q.push(data)`：往队列尾部压入元素
- `q.front()`：返回队首元素的值
- `q.back()`：返回队尾元素的值

### 主要实现（数组）

详见： [Queue.hpp](https://github.com/Organic-Fish/FishCode/blob/master/CPP/DataStruct/Queue/Queue.hpp)

用数组时，要用到表示队首队尾的位置指针，以及像动态数组的到点扩容。于是乎，为了减少扩容的次数、高效地利用已有的空间，其内部是一个循环数组。其中：

- `Front` 队首指针表示的是 队首元素*下标的前一位*，于是初始化为 $-1$
- `Back`：队尾指针表示的是 队尾元素的下标，初始化也为 $-1$

于是由以上的特点可以得出以下的性质：

- 队列的大小为 $(Back - Front + Capacity) \% Capacity$
- 队列为空时 $Back == Front$
- 入队的位置为 $(Back + 1) \% Capacity$
- 出队的位置为 $(Front + 1) \% Capacity$
- 为了两指针不冲突，当队列大小达到容量 -1 的时候就要扩容，即队满的情况为 $size() == Capacity -1$
- 而扩容就和动态数组差不多了，定义一个长度为两倍容量的临时数组，再把队列原先的数据搬过去）如下：

```cpp
template<class T> class Queue : private QueueBase<T> {
private:
  T* arr;
  int Front; // 记录队首的下标
  int Back; // 记录队尾的下标
  int Capacity; // 队列的当前容量

  // 初始的默认容量
  static const int INIT_CAPACITY = 10;

  // 扩容
  void reserve() {
    T* temp = new T[Capacity << 1];
    for (int i = 0; i < size(); ++i) {
      temp[i] = arr[i + (Front + 1) % Capacity];
    }
    swap(temp, arr);
    delete[] temp;

    Back = size() - 1, Front = -1;
    Capacity <<= 1;
  }
}
```

#### 入队

```cpp
void push(const T& value) {
  if (full()) reserve();

  Back = (Back + 1) % Capacity;
  arr[Back] = value;
}
```

#### 出队

```cpp
void pop() {
  assert(empty() == false);
  Front = (Front + 1) % Capacity;
}
```

#### 队首元素

```cpp
T front() const {
  return arr[(Front + 1) % Capacity];
}
```
