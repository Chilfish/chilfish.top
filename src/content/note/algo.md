---
title: 算 法
date: 2022-07-31
tags: [note, Algorithm, c++]
---

## 小算法

### ACM

#### 快读快写

```cpp
// 读整数
ll read() {
  ll x = 0; char c; bool f = 0;
  while (c = getchar(), !isdigit(c))
    if (c == '-') f = 1;
  while (isdigit(c))
    x = x * 10 + c - '0', c = getchar();
  return f ? ~x + 1 : x;
}
void write(ll n) {
  if (n < 0) putchar('-'), n = -n;
  if (n > 9) write(n / 10);
  putchar(n % 10 + '0');
}
```

#### 头模板

```cpp
#include <bits/stdc++.h>
#define QAQ std
#define endl "\n"
#define ll long long
#define vi vector<int>
#define all(s) s.begin(), s.end()
using namespace QAQ;
#pragma GCC optimize(3)

const int MAX = 1e6;
ll a[MAX + 5]{};

void solve() {

}

int main() {
  ios::sync_with_stdio(0), cin.tie(0), cout.tie(0);
  ll T = 1;
  cin >> T; //
  while (T--) solve();
  return 0;
}
```

### 复杂度

### 前缀和与差分

**题目要求：** 对长为 n 的数组进行 m 次查询：求 $[l, r]$ 之间的和

- 如果是暴力遍历，则最坏可达到 $O(n * m)$
- 前缀和主要应用在对给定数组进行离线求和，与求区间和。离线在于预先遍历求一次和后，之后就可以直接读取了， 复杂度为 $O(n)$

此时，前 n 项和为：`sum[n]`，$[l ,r]$ 之间的和为 `sum[r] - sum[l - 1]`

```cpp
int sum(int l, int r) {
  return sum[r] - sum[l - 1];
}

for (int i = 1; i <= n; i++) {
  cin >> a[i];
  sum[i] = sum[i - 1] + a[i];
}
```

#### 差分

如给数组 `[l, r]` 之间加上 c

```cpp
const int len = 5;
int b[len + 1]{}, // 差分数组
  sum[len + 1]{}; // 差分的前缀和

// 区间加
void add(int l, int r, int k) {
  b[l] += k, b[r + 1] -= k;
}

// 还原操作后的数组，及其前缀和
void re() {
  memset(arr, 0, len); memset(sum, 0, len);
  for (int i = 1; i <= len; ++i) {
    arr[i] = arr[i - 1] + b[i];
    sum[i] = sum[i - 1] + arr[i];
  }
}

int main() {
  for (int i = 1; i <= n; ++i){
    cin >> arr[i];
    b[i] = arr[i] - arr[i - 1];
  }
}
```

### 树状数组

前缀和对于一次求和(n)多次查询很快，就 $O(n)$；但对于修改值后再查询却可能高达 $O(n^2)$，因为每次修改后还要再求前缀和

而树状数组对于修改和查询都是 $O(\log_2{n})$，因此整体就 $O(m\log_2{n})$

树状数组要做的就是，对数组进行单点或区间修改，并进行单点或区间查询和

树状数组的结构就是将完全二叉树用数组来表示

以数组 $Arr = \{8,6,1,4,5,5,1,1,3,2,1,4,9,0,7,4\}$ 为例

![树的每个节点都是区间和](https://p.chilfish.top/blog/algo/TreeArr0.webp)

![树状数组与原数组的对应关系](https://p.chilfish.top/blog/algo/TreeArr1.webp)

#### 树状数组的几种变式

#### 单点更新，区间查询

**[题目要求](https://www.luogu.com.cn/problem/P3374)：** 对数组进行 T 次操作，输入 3 个数字，分别表示：

- `1 x k` 含义：将第 $x$ 个数加上 $k$
- `2 x y` 含义：输出区间 $[x,y]$ 内每个数的和

```cpp
const int Max = 5e5 + 5;
ll a[Max]{}, sum[Max]{};
int n, T;

void add(int p, int x) {
  while (p <= n) sum[p] += x, p += p & -p;
}

int ask(int p) {
  int res = 0;
  while (p) res += sum[p], p -= p & -p;
  return res;
}
int ask(int l, int r) {
  return ask(r) - ask(l - 1);
}

int main() {
  cin >> n >> T;
  for (int i = 1; i <= n; ++i) {
    cin >> a[i]; add(i, a[i]);
  }
  while (T--) {
    int t, l, r, x;
    cin >> t >> l;
    if (t == 1) {
      cin >> x; add(l, x);
    } else {
      cin >> r;
      cout << ask(l, r) << endl;
    }
  }
}
```

#### 区间更新，区间查询

**题目要求** 变成了是在 $[l, r]$ 内增加 k，并求区间内的和

很难不想到利用 **差分** 来进行区间更新，那么：

```cpp
const int Max = 5e5 + 5;
ll a[Max]{}, sum1[Max]{}, sum2[Max]{};
int n, T;

void add(int p, int k) {
  for (int x = p; p <= n; p += p & -p) {
    sum1[p] += k;
    sum2[p] += k * (x - 1);
  }
}
void add(int l, int r, int x) {
  add(l, x), add(r + 1, -x);
}
int ask(int p) {
  int ans = 0;
  for (int x = p; p > 0; p -= p & -p) {
    ans += x * sum1[p] - sum2[p];
  }
  return ans;
}
int ask(int l, int r) {
  return ask(r) - ask(l - 1);
}

int main() {
  cin >> n >> T;
  for (int i = 1; i <= n; ++i) {
    cin >> a[i];
    add(i, a[i] - a[i - 1]); // 差分
  }
  while (T--) {
    int t, l, r, k;
    cin >> t >> l >> r;
    if (t == 1) {
      cin >> k;
      add(l, r, k);
    } else {
      cout << ask(l, r) << endl;
    }
  }
  return 0;
}
```

### 线段树

## 参考

- [线段树详解](https://www.cnblogs.com/AC-King/p/7789013.html)
- [动画讲解树状数组](https://bilibili.com/video/BV1ce411u7qP/)
- [高级数据结构——树状数组](https://www.cnblogs.com/RabbitHu/p/BIT.html)
