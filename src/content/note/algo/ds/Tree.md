---
title: 各种树
date: 2022-11-08
tags: [note, Algorithm, c++]
---

## 概述

线性表，栈，队列，串，等等，都是一对一的**线性结构**，而 “树” 则是一种典型的非线性结构。非线性结构的特点就是，任意一个结点的直接前驱，如果存在，则一定是唯一的；直接后继如果存在，则可以有多个，也可以理解为一对多的关系

树这种数据结构有很多的应用：如操作系统的文件管理的结构就是一个树状的，从根目录(磁盘)开始一直套娃下去打开文件夹直至没有文件夹或找到目标文件(夹)、又如 `Json`、`yaml`这类的数据存储类型都可以看做是树

![Unix 的文件层次树](/blog/algo/tree_unix.png)

正如 **打开文件夹找文件** 的过程而言，对树的遍历就是一个 **递归** 的过程（指只是点开下一个文件夹或返回键的情况下，毕竟在 GUI 下还可以直接点面包屑的节点跳转到先前节点），而内部对数据的存储的结构也是 **不连续的连式存储**

在之前的线性结构的表中，要么插入时要 $O(n)$，要么访问时也要 $O(n)$，而 **二叉查找树** 的大部分操作只要 $O(\log{n})$。C++ STL 中的 `std::map` 和 `std::set` 正是用 **红黑树** 来构造的

### 概念及术语

<div class="h5" id="tree1">先在这里种一棵二叉树：</div>

![一颗普通的二叉树](/blog/algo/tree.png)

在这棵树中：

- **结点：** 包含数据项以及指向其他结点的分支，例如上图中圆 A 中，既包含数据项 A 又指向 B 和 C 两个分支
  - 特别的，因为 A 没有前驱，且有且只有一个，所以称其为**根结点(root)**
- **子树：** 由根结点以及根结点的所有后代导出的子图称为树的子树
- **结点的度：** 结点拥有子树的数目，简单的就是直接看有多少个分支，例如上图 A 的度为 2，B 的度为 1
- **叶结点：** 也叫作终端结点，即没有后继的结点，例如 E F G H I
- **分支结点：** 也叫作非终端结点，除叶结点之外的都可以这么叫
- **孩子结点：** 也叫作儿子结点，即一个结点的直接后继结点，例如 B 和 C 都是 A 的孩子结点
- **双亲结点：** 也叫作父结点，一个结点的直接前驱，例如 A 是 B 和 C 的双亲结点
- **兄弟结点：** 同一双亲的孩子结点互称为兄弟结点 例如 B 和 C 互为兄弟
- **堂兄弟：** 双亲互为兄弟结点的结点，例如 D 和 E 互为堂兄弟
- **祖先结点：** 从根结点到达一个结点的路径上的所有结点，A B D 结点均为 H 结点的祖先结点
- **子孙结点：** 以某个结点为根的子树中的任意一个结点都称为该结点的子孙结点，例如 C 的子孙结点有 E F I
- **结点的层次：** 设根结点层次为 1，其余结点为其双亲结点层次加 1，例如，A 层次为 1，B C 层次为 2
- **树的高度：** 也叫作树的**深度(deep)**，即树中结点的最大层次。这棵树就为 4
- **有序/无序树：** 树中结点子树是否从左到右为有

## 二叉树

### 性质

二叉树（**Binary tree**）是每个结点**最多只有两个分支**（即不存在分支度大于 2 的结点）的树结构。通常分支被称作“左子树”或“右子树”。二叉树的分支具有左右次序，不能随意颠倒

二叉树有以下几个性质：

- 性质 1：二叉树第 $i$ 层上的结点数目最多为 $2^{i-1} (i\geq1)$
- 性质 2：深度为 $k$ 的二叉树至多有 $2k - 1 $个结点 $(k\geq1)$
- 性质 3：包含 $n$ 个结点的二叉树的高度至少为 $\log_{2}(n+1)$
- 性质 4：在任意一棵二叉树中，若叶子结点的个数为 $n_0$，度为 2 的结点数为 $n_2$，则 $n_0 = n_2+1$

#### 分类

完全二叉树就是满二叉树的改版：不再要求一定有两个节点，但节点出现的顺序必须是按照满二叉树的情况来的

查找二叉树就是规定了在构造二叉树的时候左子节点必须大于父节点，右子节点必须小于其父节点

![完全二叉树与满二叉树](/blog/algo/tree_full_binary.png)

### 遍历方式

与之前的线性表不同，树状结构的遍历是完全不一样的，但也很好理解。比如说，想在文件管理器中找某个文件（如 `D:\Gits\FishCode\CPP\DataStruct\Tree`），通常步骤都是从根目录(磁盘名)开始，按路径一路点进去(深入)，直到找到或没有文件夹为止

那么树状结构都可以用类似这样的方式去遍历，对于二叉树来讲，主要有四种遍历方式：

- **先序遍历（根->左->右）：** 从根节点开始，一直向左节点深入直到空，并访问(或输出)，到空时访问兄弟的右节点。如果右节点为空则向上回溯直到非空右节点，然后再继续向左访问
- **中序遍历（左->根->右）：** 从根节点开始，一直向左节点深入直到空，但并不访问(输出)，到空时才访问该左节点，然后是根节点，如果右节点还有孩子则再继续重复
- **后序遍历（左->右->根）：** 也是先一直向左节点深入直到空，也是到空时才访问左节点，然后如果右节点有孩子则再继续了
- **层序遍历：** 从上到下，从左到右地对每一层的节点进行访问

> 所以这样的过程很容易用 递归 和 分治 的方法去实现

以 [开头种的树](#tree1) 举例：四种遍历的结果分别是

- `A B D G H C E F I`
- `G D H B A E C F I`
- `G H D B E I F C A`
- `A B C D E F G H I`

那实现起来就是（节点的定义见[下](#节点定义)）：

```cpp
// 前序遍历
void preOrder(Node *tree) {
  if (tree == nullptr) return;
  cout << tree->data << " ";
  preOrder(tree->left);
  preOrder(tree->right);
}
// 中序遍历
void inOrder(Node *tree) {
  if (tree == nullptr) return;
  preOrder(tree->left);
  cout << tree->data << " ";
  preOrder(tree->right);
}
// 后序遍历
void PostOrder(Node *tree) {
  if (tree == nullptr) return;
  preOrder(tree->left);
  preOrder(tree->right);
  cout << tree->data << " ";
}
// 层序遍历
void levelOrder(Node *tree) {
  if (tree == nullptr) return;
  queue<Node *> q;
  Node *p = tree;
  q.push(p);

  while (!q.empty()) {
    cout << p->data << " ";
    if (p->left != nullptr)
      q.push(p->left);
    if (p->right != nullptr)
      q.push(p->right);
    q.pop(); p = q.front();
  }
}
```

递归实现起来特别直观，因为每一个节点都可以看做是该节点子树的根节点，那么只要把根节点输出就好了

而由于递归本质上就是栈的调用，那也是能用栈去实现的：

```cpp
// 前序遍历
void preStack(Node *tree) {
  stack<Node *> s;
  Node *p = tree;
  // 直到遍历完树且栈中无节点为止
  while (!(p == nullptr && s.empty())) {
    // 向左边深入，直到左叶子
    // 入栈是为了记录深入过程中的 根节点
    while (p != nullptr) {
      // 输出根节点
      cout << p->data << " ";
      s.push(p);
      p = p->left;
    }
    // 出栈是回退到上一个节点，然后向右边深入
    if (!s.empty()) {
      p = s.top();
      s.pop();
      p = p->right;
    }
  }
}
// 中序遍历
void inStack(Node *tree) {
  stack<Node *> s;
  Node *p = tree;
  while (!(p == nullptr && s.empty())) {
    // 先深入到左叶子，与前序遍历不同的是，深入到空再输出
    // 而不是边深入边输出根节点
    while (p != nullptr) {
      s.push(p);
      p = p->left;
    }
    if (!s.empty()) {
      // 弹出左节点或是说该叶子节点，然后向右深入
      p = s.top();
      cout << p->data << " ";
      s.pop();
      p = p->right;
    }
  }
}

void postStack(Node *tree) {
  if (tree == nullptr) return;
  stack<Node *> s;
  Node *cur, *pre = nullptr;
  s.push(tree);

  while (!s.empty()) {
    cur = s.top();
    // 深入到叶子节点时就可以输出了
    if ((cur->left == nullptr && cur->right == nullptr)
      // 或者非叶子节点，但已访问过左节点，轮到右节点了
      // 就要记录下上一个访问的节点
      || (pre != nullptr && // 排除掉第一次
        (pre == cur->left || pre == cur->right))) {
      cout << cur->data << " ";
      s.pop(); pre = cur;
    } else {
      // 基于栈，所以先入右边才能让左节点先被访问
      if (cur->right != nullptr)
        s.push(cur->right);
      if (cur->left != nullptr)
        s.push(cur->left);
    }
  }
}
```

## 普通二叉树

### 节点定义

```cpp
template<class T> struct BNode {
  T data;
  BNode *left;
  BNode *right;

  BNode(const T &x = T{}, BNode *l = nullptr, BNode *r = nullptr) :
    data{x}, left{l}, right{r} {}
};
```

### 类定义

<details>
<summary>展开</summary>

```cpp
template<class T> class Tree {
protected:
  typedef BNode<T> Node;

  Node *root;
  T nullNode;
  int len;

  void buildPreInput(Node *&tree) {}
  void buildPreIn(T pre[], T in[], int l, int r, int &t, Node *&tree) {}
  void preOrder(Node *tree) {}
  void preStack(Node *tree) {}
  void inOrder(Node *tree) {}
  void inStack(Node *tree) {}
  void postOrder(Node *tree) {}
  void postStack(Node *tree) {}
  void levelOrder(Node *tree) {}

  void destroy(Node *&tree) {}
  Node *copy(Node *tree) {}
  bool equal(Node *a, Node *b) {}
  void reverse(Node *tree) {}

  Node *find(Node *tree, const T &x) {}
  Node *findPar(Node *tree, const T &x) {}
  bool modify(Node *tree, const T &node, const T &x) {}
  bool exist(Node *p, bool l) {}
  bool insert(Node *tree, const T &node, const T &x, bool l) {}
  bool insert(Node *tree, const T &node, Node *x, bool l) {}
  bool remove(Node *&tree, const T &node) {}

  int height(Node *tree) {}
public:
  explicit Tree() :nullNode{T()}, len{0} {}
  explicit Tree(const T &e) :nullNode{e}, len{0} {}
  //树节点的个数
  int size() const {}
  // 树的高度
  int height() {}
  // 销毁整棵树
  void destroy() {}
  // 深拷贝一棵树
  void copy(const Tree &t) {}
  // 反转一棵树
  void reverse() {}
  // 判断两棵树是否相等
  bool equal(const Tree &t) {}
  // 查找树中的节点是否存在
  T find(const T &x) {}
  // 查找该节点的父节点，存在则返回父节点的值，否则返回-1
  T findPar(const T &x) {}
  // 将 x 修改为 value
  void modify(const T &x, const T &value) {}
  // 在指定节点和方向插入值
  void insert(const T &node, const T &x, bool l = true) {}
  // 在指定节点和方向插入子树
  void insert(const T &node, const Tree &x, bool l = true) {}
  // 删除节点
  void remove(const T &node) {}
  // 带空节点标记的先序遍历创建二叉树（输入流）
  void buildPreInput() {}
  // 先序遍历和中序遍历构造二叉树
  void buildPreIn(T pre[], T in[], int len) {}
  // 后序遍历和中序遍历构造二叉树
  void buildPostIn(T post[], T in[], int len) {}
  // 先序遍历输出
  void preOrder() {}
  // 非递归先序遍历输出
  void preStack() {}
  // 中序遍历输出
  void inOrder() {}
  // 非递归中序遍历输出
  void inStack() {}
  // 后序遍历输出
  void postOrder() {}
  // 非递归后序遍历输出
  void postStack() {}
  // 层次遍历输出
  void levelOrder() {}
};
```

</details>

### 构建

从头开始构建一颗二叉树，可以使用先序遍历地方式，并指定空节点的形式(如 `#`)。以 [开头种的树](#tree1) 来讲就是 `A B D G # # H # # # C E # # F # I # #`

```cpp
void buildPreInput(Node *&tree) {
  T x;
  cin >> x;
  if (x == nullNode) {
    tree = nullptr;
    return;
  }
  ++len;
  tree = new Node(x);
  buildPreInput(tree->left);
  buildPreInput(tree->right);
}
```

由于中序遍历规定了左右节点相对于根节点的位置，先序和后序确定了根节点相对于左右节点的位置，因而用中序遍历与 先序遍历和后序遍历中的一个 结合，就能确定一颗二叉树

还是拿 以 [开头种的树](#tree1) 来说

#### 先序遍历和中序遍历创建二叉树

结合中序遍历与先序遍历

<div class="tableBox">

<span></span>
先序遍历 | A | B | D | G | H | C | E | F | I
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
中序遍历 | G | D | H | B | A | E | C | F | I

</div>

在中序遍历中，根节点 A 的左边都是左子树，右边都是右子树，其他的也是这样。而每个子树的左右字节点在中序遍历中的左右两边，这样很难不想到使用 **分治算法** 来构建。而之所以先从左子树开始，是因为先序遍历的顺序就是 根左右

而每次分治的边界都应该是属于子树的范围，如：

- 一开始的范围是 $[G, I]$
- 下一步到左节点，范围被分分割成了 $[G, B]$，也就是在这个范围内都是根节点 A 的左子树
- 再下一步是 $pre[1] \to B$，范围为 $[G, H]$
- 当轮到 $pre[5] \to C$ 时，始终在上一个范围 $[H, H]$ 中找不到 C，说明在根节点的左子树已经遍历完了，就只能一层层地向上回溯，一直到根节点的范围 $[G, I]$，然后再继续

```cpp
void buildPreIn(T pre[], T in[], int l, int r, int &t, Node *&tree) {
  // 先找到先序在中序中的位置
  int flag = -1;
  for (int i = l; i <= r; ++i)
    if (in[i] == pre[t]) {
      flag = i; break;
    }
  // 如果在这个范围内找不到，说明就要向上回溯去扩大范围了
  if (flag == -1) return;

  tree = new Node(in[flag]);
  ++t;

  // 分治
  if (l < r) {
    buildPreIn(pre, in, l, flag - 1, t, tree->left);
    buildPreIn(pre, in, flag + 1, r, t, tree->right);
  }
}
// in public:
void buildPreIn(T pre[], T in[], int len) {
  int t = 0;
  // 默认下标从 0 开始
  buildPreIn(pre, in, 0, len - 1, t, root);
}
```

#### 后序遍历与中序遍历创建二叉树

其实能发现，后序遍历反过来时是 _根右左_，对于先序遍历来说就是交换了左右子树（翻转），那么只要在先序遍历的基础上，先右后左地分治就好了

```cpp
void buildPostIn(T post[], T in[], int l, int r, int &t, Node *&tree) {
  int flag = -1;
  for (int i = l; i <= r; ++i)
    if (in[i] == post[t]) {
      flag = i; break;
    }
  if (flag == -1) return;
  tree = new Node(in[flag]);
  --t;

  // 反过来了，根右左
  if (l < r) {
    buildPostIn(post, in, flag + 1, r, t, tree->right);
    buildPostIn(post, in, l, flag - 1, t, tree->left);
  }
}
// in public:
void buildPostIn(T post[], T in[], int len) {
  int n = len; // 从后往前遍历后序遍历
  buildPostIn(post, in, 0, len - 1, n, root);
}
```

### 销毁

也就是释放节点内存，其实只要按照 左右根 也就是后续遍历的样子来就行了

```cpp
void destroy(Node *&tree) {
  if (tree == nullptr) return;
  destroy(tree->left);
  destroy(tree->right);
  --len;
  delete tree; tree = nullptr;
}
```

### 深拷贝

类似先序遍历那样吧

```cpp
Node *copy(Node *tree) {
  if (tree == nullptr) return nullptr;

  Node *newNode = new Node(tree->data);
  newNode->left = copy(tree->left);
  newNode->right = copy(tree->right);
  return newNode;
}
```

### 查找

其实还是先序遍历的思路，一直深入到空，值相等才返回

```cpp
Node *find(Node *tree, const T &x) {
  if (tree == nullptr || tree->data == x) {
    return tree;
  }
  // for C++ 17
  if (Node *p = find(tree->left, x); p != nullptr) {
    return p;
  } else {
    // 左节点没子树后就向右查找
    return find(tree->right, x);
  }
}
// 查找父节点
Node *findPar(Node *tree, const T &x) {
  if (tree == nullptr ||
    (tree->left != nullptr && tree->left->data == x) ||
    (tree->right != nullptr && tree->right->data == x)) {
    return tree;
  }

  if (Node *p = findPar(tree->left, x); p != nullptr) {
    return p;
  } else {
    return findPar(tree->right, x);
  }
}
```

### 插入新节点

由于本身没太多限制，所以插入时还需要指定被插入的节点和插入的方向，于是就得先找到节点，然后还得判断插入方向是否已经存在节点了

```cpp
bool exist(Node *p, bool l) {
  if (p == nullptr ||
    (p->left != nullptr && l) ||
    (p->right != nullptr && !l)) {
    cout << "\n----没有这个节点，或已有左右子树----\n";
    return true;
  }
  return false;
}

bool insert(Node *tree, const T &node, const T &x, bool l) {
  Node *p = find(tree, node);
  if (exist(p, l)) {
    return false;
  }

  Node *newNode = new Node(x);
  if (l) p->left = newNode;
  else p->right = newNode;
  return true;
}
// 插入一颗子树
bool insert(Node *tree, const T &node, Node *x, bool l) {
  Node *p = find(tree, node);
  if (exist(p, l)) {
    return false;
  }
  // 而插入子树时必须得深拷贝出来
  Node *newNode = copy(x);

  if (l) p->left = newNode;
  else p->right = newNode;
  return true;
}
```

### 删除节点

不同的是，这里需要找到节点的父节点

```cpp
bool remove(Node *&tree, const T &node) {
  Node *p = findPar(tree, node);
  if (p->left == nullptr && p->right == nullptr) {
    return false;
  }
  if (node == p->left->data) {
    destroy(p->left);
  } else {
    destroy(p->right);
  }
  return true;
}
```

### 高度

```cpp
int height(Node *tree) {
  if (tree == nullptr) {
    return 0;
  }
  int l = height(tree->left);
  int r = height(tree->right);
  return (l > r ? l : r) + 1;
}
```

## 完全二叉树

## 查找二叉树
