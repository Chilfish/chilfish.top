---
title: 搜索算法
date: 2022-02-13
tags: [Algorithm, Search]
---

## 二分搜索

#### 特征

#### 思路过程

- 找到 `(l, r)` 的区间范围
- 要求最值其实就是 `upper OR lower bound` 的情况了
- $\uparrow$ 就是要先存着答案，`break` 出才 return
- 以及是 mid 要和谁去比较
- 要去考虑什么时候往大了搜或小的方向

#### 码

传统的二分搜索，要求数组已序， $O(\log n)$

```cpp
bool big(int a, int b) {
  return a > b; // 或是别的情况
}
int binary_search(vector<int> arr, int x) {
  int l = 0, r = arr.size(), mid;
  while (l <= r) {
    mid = l + (r - l) / 2;
    if (big(x, arr[mid]))
      l = mid + 1;
    else if (big(arr[mid], x))
      r = mid - 1;
    else return mid;
}
  return -1;
}
```

`upper_bound` 和 `lower_bound` 只要在相等时再找找下标有没有 _更大 or 更小_ 的

```cpp
int binary_bound(vector<int> arr, int x) {
  int l = 0, r = arr.size(), ans = -1;
  while (l <= r) {
    int m = l + (r - l) / 2;
    if (arr[m] > x)
      r = m - 1;
    else if (arr[m] < x)
      l = m + 1;
    else
      ans = m, l = m + 1; // lower 则是向右找： r = m - 1;
  }
  return ans;
}
```

> 求出现的次数只要 $upper\_bound - lower\_bound$ 即可

## 深搜

数字全排列

```cpp
int a[10];
bool used[10];
int n; //要全局

void dfs(int x) {
  if (x == n) { // 到了边界
    for (int i = 1; i <= n; i++)
      cout << a[i] << " ";
    cout << endl;
    return; //回溯，到used[i] = false;
  }
  for (int i = 1; i <= n; i++)
    if (used[i] == false) {
      a[x + 1] = i;       //放进去
      used[i] = true; //标记已经放的位置
      dfs(x + 1);
      used[i] = false; //回退，撤销标记
    }
}

int main() {
  cin >> n;
  dfs(0);
  return 0;
}
```

选数，求质数和

```cpp
//k：边界，m：判断是否到了边界，sum：一个值，startx：用于排列组合地选的 地址
void dfs(int m, int sum, int startx) {
  if (m == k) {
    if (isprime(sum)) ans++;
    return;
  }
  //因为到边界了，所以要退出
  for (int i = startx; i < n; i++)
    dfs(m + 1, sum + a[i], i + 1);
  return;
}
```

## 广搜

一般是用队列来配合实现 BFS

### 方向数组

用数组来控制方向 —>注意，用 `fang(i，j)`时，下标要从 1 开始

```cpp
//8个方向  九宫格中心的四周
void fang8(int x, int y) {
  int spy[] = {0, 1, 0, -1, 1, 1, -1, -1};
  int spx[] = {1, 0, -1, 0, -1, 1, 1, -1};
  for (int i = 0; i < 8; ++i) {
    int nx = x + spx[i], ny = y + spy[i];
    if (......)
      ......;
  }
}
```

```cpp
//4个方向 上下左右
void fang4(int x, int y) {
  int dxy[4][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}}; // 也能是二维数组
  for (int i = 0; i < 4; i++) {
    int nx = x + dxy[i][0], ny = y + dxy[i][1];
    if (......)
      ......;
  }
}
```

### 例题

马的遍历 [洛谷 P1443 马的遍历](https://www.luogu.com.cn/problem/P1443)

```cpp
int dx[8] = {1, 2, 1, 2, -1, -2, -1, -2};
int dy[8] = {2, 1, -2, -1, 2, 1, -2, -1};
int mpa[500][500];
bool vis[500][500] = {false};

struct node {
  int x, y;
  node(int a, int b) :x{a}, y{b} {};
};
queue<node> q;

void solve() {
  int n, m, x, y;
  cin >> n >> m >> x >> y;
  memset(mpa, -1, sizeof(mpa));

  mpa[x][y] = 0, vis[x][y] = true,
    q.push(node(x, y));

  while (!q.empty()) {
    int xx = q.front().x, yy = q.front().y;
    q.pop();

    for (int i = 0; i < 8; ++i) {
      int xi = dx[i] + xx, yj = dy[i] + yy;
      if ((xi < 1 or xi > n) ||
        (yj < 1 or yj > m) || vis[xi][yj])
        continue;

      vis[xi][yj] = true, mpa[xi][yj] = mpa[xx][yy] + 1;
      q.push(node(xi, yj));
    }
  }

  for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= m; j++)
      printf("%-5d", mpa[i][j]);
    puts("");
  }
}
```
