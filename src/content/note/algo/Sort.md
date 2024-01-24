---
title: 排序算法 (C++ 描述)
date: 2022-04-14
tags: [Algorithm, Sort]
---

## 分类

十种常见排序算法可以分为两大类：

- 比较类排序：通过比较来决定元素间的相对次序，时间复杂度为 $O(n\log_2n) \to O(n²)$
- 非比较类排序：不通过比较来决定元素间的相对次序，其时间复杂度可以突破 $O(n\log_2n)$，以线性时间运行

### 复杂度

<div class="tableBox">

<span></span>
排序算法 | 平均时间复杂度 | 最好情况 | 最坏情况 | 空间复杂度 | 稳定性 | 排序方式
| :-: | :-: | :-: | :-: | :-: | :-: | :-: |
冒泡排序 | $O(n^2)$ | $O(n)$ | $O(n^2)$ | $O(1)$ | 稳定 | In-place
选择排序 | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | 不稳定 | In-place
插入排序 | $O(n^2)$ | $O(n)$ | $O(n^2)$ | $O(1)$ | 稳定 | In-place
希尔排序 | $O(n\log_2n)$ | $O(n^{1.3})$ | $O(n^2)$ | $O(1)$ | 不稳定 | In-place
归并排序 | $O(n\log_2n)$ | $O(n\log_2n)$ | $O(n\log_2n)$ | $O(n)$ | 稳定 | In-place
快速排序 | $O(n\log_2n)$ | $O(n\log_2n)$ | $O(n^2)$ | $O(\log_2n)$ | 不稳定 | In-place
堆排序 | $O(n\log_2n)$ | $O(n\log_2n)$ | $O(n\log_2n)$ | $O(1)$ | 不稳定 | In-place
桶排序 | $O(n+k)$ | $O(n+k)$ | $O(n^2)$ | $O(n+k)$ | 稳定 | Out-place
计数排序 | $O(n+k)$ | $O(n+k)$ | $O(n+k)$ | $O(k)$ | 稳定 | Out-place
基数排序 | $O(n×m)$ | $O(n×m)$ | $O(n×m)$ | $O(n+m)$ | 稳定 | Out-place

</div>

#### 其中

- **时间/空间复杂度：** 描述一个算法执行时间/占用空间与数据规模的增长关系
- **n：** 待排序列的个数
- **k：** “桶”的个数（上面的三种非比较类排序都是基于“桶”的思想实现的）
- **m：** 最大值的位数
- **In-place：** 原地算法，指的是占用常用内存，不占用额外内存。空间复杂度为 $O(1)$ 的都可以认为是原地算法
- **Out-place：** 非原地算法，占用额外内存
- **稳定性：** 假设待排序列中两元素相等，排序前后这两个相等元素的相对位置不变，则认为是稳定的

> 以下的 `vi` 均指 `std::vector<int>`

## 比较类排序

### 冒泡排序

#### 描述

- 从头到 `len-1`，依此地把较大值往后堆
- 循环次数大约：$\frac{n^2}{2}$

#### 动图

![冒泡排序](/blog/algo/sort_bubble.gif)

#### 码

```cpp
void Bubble(vi &arr) {
  int len = arr.size() - 1;
  for (int i = 0; i < len; ++i)
    for (int j = 0; j < len - i; ++j) {
      if (arr[j] > arr[j + 1])
        swap(arr[j], arr[j + 1]);
    }
}
```

### 快速排序

#### 描述

- 快速排序之所以比较快，是因为与冒泡排序相比，每次的交换时跳跃式的。每次排序的时候设置一个**基准点**，将小于等于基准点的数全部放到基准点的左边，将大于等于基准点的数全部放到基准点的右边
- 这样在每次交换的时候就不会像冒泡排序一样每次只能在相邻的数之间进行交换，交换的距离就大的多了。因此总的比较和交换次数就少了，速度自然就提高了
- 当然在最坏的情况下，仍可能是相邻的两个数进行了交换。因此快速排序的最差时间复杂度和冒泡排序是一样的都是 $O(n^2)$ ，它的平均时间复杂度为 $O(n\log_2n)$

#### 动图

![快排](/blog/algo/sort_quick.gif)

![快排分解](/blog/algo/sort_quick.jpg)

#### 码

```cpp
void quick(vi& arr, int begin, int end) {
  // 递归，直到 start = end 为止
  if (begin > end) return;
  int base = arr[begin], i = begin, j = end;
  while (i != j) {
    // 从右向左找比基准数小的数 （要先从右边开始找）
    while (arr[j] >= base && i < j) j--;
    // 从左向右找比基准数大的数
    while (arr[i] <= base && i < j) i++;
    // 主要是找到目标数的下标，然后再交换位置
    if (i < j) swap(arr[i], arr[j]);
  }
  // 最终将基准数归位
  arr[begin] = arr[i];
  arr[i] = base;
  // 第一趟把基准数放到中间后，分左右两边依此快排
  quick(arr, begin, i - 1); // 继续处理左边的
  quick(arr, i + 1, end); // 继续处理右边的
}
```

### 插入排序

#### 描述

- 将 i 前面(不包含 i)当做有序序列，后面为原始未序
- 从 `i-1` 开始，用 `arr[i]`往前比较，将 `arr[i]` 插入到合适的位置
- 如果相同，则插入到相同数的后一位保证稳定性
- 循环次数大约： $\frac{n^2}{5}$

#### 动图

![](/blog/algo/sort_insert.gif)

#### 码

```cpp
void insert(vi& arr) {
  for (int i = 0; i < arr.size(); ++i) {
    int temp = arr[i], j = i;
    while (j > 0 and arr[j - 1] > temp)
      arr[j] = arr[j - 1], --j; //往后挪
    arr[j] = temp; // 插入
  }
}
```

### 希尔排序

#### 描述

- 将数组分成间隔为 $2$ 个一组，组内进行插入排序，把组中小的数移到左半边
- 再分为 $4$ 个、$8$ 个、$2^{n}$ 个一组地组内插入排序

#### 图

![](/blog/algo/sort_shell.png)

#### 码

```cpp
void Shell(vi &arr) {
  int len = arr.size();
  for (int gap = len >> 1; gap > 0; gap >>= 1) {
    for (int i = gap; i < len; ++i) {
      int temp = arr[i], j = i;
      while (j - gap >= 0 and arr[j - gap] > temp)
        arr[j] = arr[j - gap], j -= gap;
      arr[j] = temp;
    }
  }
}
```

### 选择排序

#### 描述

- 从 i 开始遍历寻找最小数的**下标**，然后与 i 交换

#### 动图

![](/blog/algo/sort_select.gif)

#### 码

```cpp
void Select(vi &arr) {
  int len = arr.size();
  for (int i = 0; i < len - 1; ++i) {
    int minn = i;
    for (int j = i + 1; j < len; ++j)
      if (arr[minn] > arr[j])
        minn = j;
    if (i != minn)
      swap(arr[i], arr[minn]);
  }
}
```

与冒泡相比，都是 $O(n^2)$

- 冒泡排序是左右两个数相比较，而选择排序是用后面的数和每一轮的第一个数相比较
- 冒泡排序每轮交换的次数比较多，而选择排序**每轮只交换一次**
  &emsp;&emsp;

### 堆排序

#### 描述

通过建立最大堆或最小堆来进行排序，建完堆的时候就排好序了

#### 图

![](/blog/algo/sort_heap.gif)

#### 码

```cpp
void adjust_heap(vi &arr, size_t len, size_t pos) {
  size_t l = pos * 2 + 1, r = pos * 2 + 2;
  size_t maxPos = pos;

  if (l < len && arr[l] > arr[maxPos])
    maxPos = l;
  if (r < len && arr[r] > arr[maxPos])
    maxPos = r;

  if (maxPos != pos) {
    swap(arr[pos], arr[maxPos]);
    adjust_heap(arr, len, maxPos);
  }
}

void heap_sort(vi &arr) {
  int len = arr.size();
  for (int i = len / 2 - 1; i >= 0; --i) {
    adjust_heap(arr, len, i);
  }

  for (int i = len - 1; i >= 0; --i) {
    swap(arr[i], arr[0]);
    adjust_heap(arr, i, 0);
  }
}
```

### 归并排序

#### 描述

稳定在 $O(n\log_2n)$ 的稳定排序......见注释吧

#### 动图

![](/blog/algo/sort_merge.gif)

![](/blog/algo/sort_merge_1.png)

#### 码

```cpp
void Merge(vi& arr, int l, int m, int r) {
  // 若要合并的是 [4, 8, 5, 7]，则分一半
  // p指向临时数组，i指向左半部分[4, 5]
  int p = 0, i = l, j = m + 1;
  // 临时数组的大小只有 [4, 8, 5, 7].len
  vi t(r - l + 1, 0);

  // 分别遍历左右部分，按顺序把子表元素移到 t[]
  // 直到某半部分遍历完
  while (i <= m && j <= r)
    if (arr[i] > arr[j])
      t[p++] = arr[j++];
    else
      t[p++] = arr[i++];

  // 此时 t[] -> [4, 5, 7]
  // 再将合并中剩下的移到 t[]
  while (i <= m) t[p++] = arr[i++];
  while (j <= r) t[p++] = arr[j++];

  // 此时 t[] => [4, 5, 7, 8]
  // 将 t[] 表覆盖到 arr[] 表
  for (i = 0; i < p; ++i)
    arr[l + i] = t[i];

  /* debug */
  printf("l:%d, m:%d, r:%d\n", l, m, r);
  cout << "t[]:\t";
  for (int k = 0; k < p; ++k)
    cout << t[k] << " ";

  cout << "\narr[]:\t";
  print(arr);
  cout << "\n";
}

void MergeSort(vi& arr, int l, int r) {
  if (l < r) {
    int m = (l + r) / 2;
    MergeSort(arr, l, m); //先是左半部分
    MergeSort(arr, m + 1, r); //再是右半部分
    Merge(arr, l, m, r); // 合并每半部分的每半部分...
  }
}
```

#### 精简

```cpp
bool cmp(const int a, const int b){
  return a < b; // 或其他
}
void Merge(vi& arr, int l, int m, int r) {
  int p = 0, i = l, j = m + 1;
  vi t(r - l + 1, 0);
  while (i <= m && j <= r)
    t[p++] = cmp(arr[i], arr[j]) ? arr[j++] : arr[i++];
  while (i <= m) t[p++] = arr[i++];
  while (j <= r) t[p++] = arr[j++];
  for (i = 0; i < p; ++i) arr[l + i] = t[i];
}
void MergeSort(vi& arr, int l, int r) {
  if (l == r) return;
  int m = (l + r) / 2;
  MergeSort(arr, l, m), MergeSort(arr, m + 1, r);
  Merge(arr, l, m, r);
}
```

## 非比较排序

### 计数排序

**描述：** 时间复杂度为 $O(n + max(arr))$

#### 码

```cpp
void Count(vi &arr) {
  const int Max = *max_element(all(arr));
  vi box(Max + 5, 0);
  for (auto ele : arr) box[ele]++;

  for (int i = 0, j = 0; i < Max; ++i)
    while (box[i]--)
      arr[j++] = i;
}
```

### 桶排序

#### 描述

- 先扫描得到待排序数组中的最大值 `max` 与最小值 `min`，假设桶的个数为 $k$ ，则代表则将 `[min, max]` 均分为 $k$ 个范围
- 每个范围中的元素各自放入对应的桶中。如此桶之间必然是有序的，桶内使用排序算法进行排序，最后按序收集所有桶的元素，即完成桶排序
- 总的时间复杂度为 $O(n \log_2(\frac{n}{k}))$ ，当 $k$ 接近于 $n$ 时，桶排序的时间复杂度就可以金斯认为是 $O(n)$ 的
- 即桶越多，时间效率就越高，而桶越多，空间就越大

#### 动图

![<figcaption></figcaption>](/blog/algo/sort_bucket.webp)

#### 码

```cpp
void bucket(vi& arr, int cnt = 3) {
  if (!arr.size() || cnt < 2) return;

  const int maxx = *max_element(all(arr)),
    minn = *min_element(all(arr)),
    len = arr.size(),
    range = (maxx - minn + cnt) / cnt;
  vector<vi> buckets(range);

  // 分配
  for (int i = 0; i < len; ++i) {
    int index = (arr[i] - minn) / range;
    buckets[index].push_back(arr[i]);
  }

  for (int i = 0, index = 0; i < len; ++i)
    if (buckets[i].size()) {
      sort(all(buckets[i])); // 桶内排序
      for (auto ele : buckets[i]) arr[index++] = ele; // 拼接
    }
}
```

### 基数排序

#### 描述

- 从最低位开始，按照该位的大小进行一次稳定排序，再对下一位进行稳定排序，直至最高位结束
- 一般会开辟一个大小为 10 的桶，将元素按照 个位 -> 十位 -> … 放入对应位置，进行稳定排序

#### 图

![](/blog/algo/sort_radix.gif)

#### 码

```cpp
void Radix(vi& arr) {
  const int len = arr.size(),
    k = int(log(*max_element(all(arr)))) + 1; // 最大位数
  // 从最低位开始
  for (int i = 0; i < k; ++i) {
    vector<vi>radix(10); // 十进制
    //分配
    for (int j = 0; j < len; ++j) {
      int index = int(arr[j] / pow(10, i)) % 10;
      radix[index].push_back(arr[j]);
    }
    //收集
    for (int j = 0, index = 0; j < radix.size(); ++j)
      for (auto ele : radix[j]) arr[index++] = ele;
  }
}
```

## 参考

- [图解排序](https://www.cnblogs.com/onepixel/p/7674659.html)
