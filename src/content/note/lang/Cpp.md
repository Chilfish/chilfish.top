---
title: C / C++
date: 2022-04-14
tags: [C++]
---

> 默认 C++标准：C++20，编译环境： `gcc version 12.2.0 (x86_64-posix-seh-rev1, Built by MinGW-W64 project)`，操作系统： `Win10 19045.2486`，若无说明，默认都带了万能头与 std 的命名空间（见：[ACM 的头模板](../algo/index.md#acm)）
>
> 有换到 WSL2 Ubuntu 的想法）

## 一些小语法

### 指针与内存分配

```cpp
struct node {
  node *next;
  node(node *p = nullptr) :
    next{p} {}
};

int main() {
  node *a,
    *n = new node,
    *m = n,
    *p = new node(n);

  cout << n << " " << n << endl
    << a << " " << p << endl;
  return 0;
}
```

输出：

```text
0xe913d0 0xe913d0
0 0xe913f0
```

### 命名规范

**[编程语言中常用的变量命名缩写](https://blog.csdn.net/qq_37851620/article/details/94731227)**

### 缓冲区

**[C++ cin 详解及清空输入缓冲区](https://blog.csdn.net/selina8921/article/details/79067941)**

### stringstream

**[C++ stringstream 介绍](https://www.cnblogs.com/wuchanming/p/3906176.html)**

用 `getline` 与 `ss` 可以先读取一整行的数据，再用流传出去

```cpp
string s; int m; map<string, int> guo;
getline(cin, s);
stringstream ss;
ss << s;
while (ss >> s >> m)  guo[s] += m;
```

在 `C++11` 前，没有 `to_string` 的时候：

```cpp
string Itos(int x)  //int Stoi(string x)
{
  string t; stringstream ss;  // stringstream ss; int t;
  ss << x, ss >> t, ss.clear();   //ss << x, ss >> t, ss.clear();
  return t;
}
```

### 模板 template

- [C++模板 template 用法总结](https://blog.csdn.net/qq_35637562/article/details/55194097)
- [CppTemplateTutorial](https://github.com/wuye9036/CppTemplateTutorial)
<!-- - 或 [存档](wuye9036_CppTemplateTutorial.md) -->

```cpp
template <class T>  //单个类型
T big(T x, T y){
  return x > y ? x : y;
}
template <class T1, class T2>  //不同类型
inline const T2 Max(const T1 a, const T2 b){
  return a > b ? a : b;
}
```

```cpp
template <class out_type, class in_value>
out_type transf(const in_value &t){
  stringstream stream; out_type result;
  stream << t, stream >> result, stream.sync();
  return result;
}
int main(){
  string s = "532";
  double t = transf<double>(s); // <>里的是要转换的类型名，()里的是被转换的变量名
}
```

### Class 类

#### 定义类

#### 访问权限

- `public`：**任何地方** 都能访问
- `private`：只能被 **类内访问**，被继承的子孙类都没法访问
- `protected`：只能被 类内或被继承的子孙类 访问，构造的类不能访问
  > 其实就是 不想放到 public 里但又想让子孙类访问，于是就有了 protected
- `const` 限定：const 定义的类只能访问 类内的变量 _或_ 父类的非 private 的变量 _和_ 被 const 修饰的函数
- `static` 静态：只能在静态的函数、变量、类之间访问，非静态定义的不能访问。使用不了 `this` 指针
  - 且在非对象中调用对象内成员的 `::` 修饰符只能访问 静态成员
  - 而且使用前必须先初始化

与结构体类似，但是默认是以 `Private` 构造的。偏向 **数据结构** 的是结构体，偏向 **对象** 的是类

#### 构造类

**构造函数：** 是指在定义类的时候就运行了。带参数时即给变量赋值。用法：

```cpp
class mie {
private:
    int aha;
public:
    mie(int x) { aha = x; } //或
    mie(int x) : aha(x) {}
    void print() { cout << this->aha << endl; }
};
// 用法：
mie m(12); m.print(); // 12
```

**析构函数：** 是在删除对象时(或运行结束)时运行，有助于在跳出程序（比如关闭文件、释放内存等）前释放资源

**拷贝构造函数：** 即为在初定义时赋值。与定义后再赋值不同，那时需要 **重载** 等于号才能赋值

```cpp
class mie {
public:
    int num;
    mie(int x) : num(x){};
    mie(const mie &m) { this->num = m.num; }
};
// 用：
mie m(123);  mie mm = m;
```

**友元：** 需要事先在类内定义，然后 加上 `friend` 就可以有权访问 **任何** 成员。且能防止什么都放到 `public` 里，还能节省开支。**但是：**

1. 友元关系 **不能被继承**
2. 友元关系是 **单向的**，不具有交换性。即类 B 是类 A 的友元，则类 A 不一定是类 B 的友元，需要看类中是否有相应的声明
3. 友元关系 **不具有传递性**。即类 B 是类 A 的友元，类 C 是类 B 的友元，但类 C 不一定是类 A 的友元，需要看类中是否有相应的声明
4. 另外，使用一般不建议把整个类声明为友元类，而只将某些成员函数声明为友元函数，这样更安全些

#### explicit 构造函数

用于避免**不合预期**的构造方法。如：

```cpp
class String {
private:
  int len;
  char* str;
public:
  String(int a): len{a} {};
  String(char* a)
    : len{strlen(a)}, str{a} {};
};
int main() {
  String a1(23); // 初始化长度
  String a2 = 23; // ？？
  String a3 = "233s"; // 初始化
}
```

原本只想让等号用于 _构造字符串_，但在这却可以直接 _初始化长度_，而且编译通过。所以在这种情况下就应该：

```cpp
explicit String(int a): len{a} {};
```

这样，当用等号赋值数字时编译便会报错

> **注：** `explicit` 关键字只需用于类内的**单参数构造函数**前面。由于无参数的构造函数和多参数的构造函数总是显示调用，这种情况在构造函数前加 `explicit` 无意义

#### 继承

**概念：** 在定义一个新的类 B 时，如果该类与某个已有的类 A 相似（指的是 B 拥有 A 的全部特点），那么就可以把 A 作为一个基类，而把 B 作为基类的一个派生类（也称子类）

#### 格式

```cpp
class son : public | private | protected father {};
```

**权限：** 继承方式 是用来指明父类成员在子类中的 **最高访问权限** 的

一个派生类继承了所有的基类方法，但下列情况除外：

- 基类的构造函数、析构函数和拷贝构造函数
- 基类的重载运算符
- 基类的友元函数

#### 重载

#### 重载运算符

![](/blog/lang/cpp_overload.png)

**一元运算符：** 如负号、自增自减

```cpp
Stu operator++() { // 前缀自增：++mie;
    score++;
    return *this;
}
Stu operator++(int) { // 后缀自增：mie++: 带参数且与被加数类型相等
    ++*this;
    return *this;
}
```

**二元运算符：** 加减乘除膜

- 对象之间相加：
  ```cpp
  Stu operator+(Stu &a) // c = b+a; --> c = this+a
  {
      a.score += this->score;
      return a;
  }
  ```
- 对象与变量相加
  - 对象加变量
    ```cpp
    Stu operator+(int x)
    {
        Stu a;
        a.score = this->score + x;
        return a;
    }
    ```
  - 变量加对象，且要用 `friend`
    ```cpp
    friend Stu operator+(const int x, Stu &a)
    {
        a.score += x;
        return a;
    }
    ```
- **关系运算符重载：** 诸如大于号等比较符。用 bool 定义：
  ```cpp
  bool operator<(Stu &a)
  {
      return this->score < a.score;
  }
  ```
- **输入输出流重载：** 当然也适用于文件流
  ```cpp
  friend ostream &operator<<(ostream &out, const Stu &a)
  {
      out << "score: " << a.score << endl;
      return out;
  }
  friend istream &operator>>(istream &in, Stu &a)
  {
      in >> a.score;
      return in;
  }
  // to use:
  Stu mie;
  cin >> mie; cout << mie;
  ```

#### 类的五大函数

在 C++ 11 中，类是和 5 个特殊的函数紧密相关的：**析构函数**、**拷贝构造函数**、**移动构造函数**、**拷贝赋值(operator=)**、**移动赋值**

**两个构造函数：** 有两个特殊的构造函数来创建一个新的对象，它被初始化为与另一个同样类型对象相同的状态。如果这个已经存在（被声明）的对象是一个左值，就使用 **拷贝构造函数**；如果是一个右值（临时量），则使用 **移动构造函数**

**两个赋值函数：** 当 = 号用于两个都被构造过的对象的时候，就调用赋值函数。也用左右值来分拷贝赋值和移动赋值

通常情况下，他们的默认行为都没什么问题，但当对象中的数据类型包含 **指针** 的时候，就不够用了。因为拷贝构造与拷贝赋值都是 **复制了指针的值，而不是指针所指向的对象**，也就是 **浅拷贝**

例如，有这样的类：

```cpp
class node {
private:
  int* data;
public:
  explicit node(int a = 0) {
    data = new int{a};
  }
  void set(int x) {
    *data = x;
  }
  int get() const {
    return *data;
  }
};

int main() {
  node b{233}, d,
    c = b; // 拷贝构造
  d = b;   // 拷贝赋值
  c.set(123);
  cout << b.get() << " " << d.get(); // 都是 123
}
```

**浅拷贝** 的后果就是，修改了 c 的值，但又同时把 b 的值改了。原本想要的结果是 c 仅是 b 的复制品，即为 **深拷贝**：

```cpp
// 拷贝构造和拷贝赋值用的是左值引用
node(const node& a){
  data = new int{*a.data};
}

node& operator=(const node& a) {
  if (this != &a) {
    *data = *a.data;
  }
  return *this;
}
```

而对于右值引用的 移动构造和移动赋值：

```cpp
node(node&& a) : data{a.data} {
  a.data = nullptr;
}
node& operator=(node&& a) {
  swap(data, a.data);
  return *this;
}
```

> **Ref:** [简书\_继承方式](https://www.jianshu.com/p/1b661fbc8fb4) 、 [拷贝构造函数\_知乎](https://zhuanlan.zhihu.com/p/157833251)

### initializer_list 列表初始化

列表初始化常见于，使用 `{}` 序列来初始化：

```cpp
vector<int> arr1{1, 2, 3, 4},
            arr2 = {3, 4, 5, 6};
```

#### 使用

```cpp
template<class T>
void print(initializer_list<T> l){
  const int len = l.size(); // 列表的长度
  // 头尾迭代器
  for (auto it = l.begin(); it != l.end(); ++it){
    cout << *it << " ";
  }
}
// to use:
print({2, 3, 4});
```

### Lambda 匿名函数

#### 定义

![](/blog/lang/cpp_lambda.png)

- **捕获列表**
  - 当为默认的 `[]` 时，lambda 内是不能访问当前作用域中的变量的（除了全局）
  - 而 `[&]` 表示按引用访问，`[=]` 表示按值访问，多变量见用逗号分隔
- **参数列表：** 可省略，带则和普通函数差不多
- **可变的 `mutable`：** 默认下 lambda 是 const 的，加了这个就可以改变捕获到的值

#### 原理

```cpp
string s = "abandon";
char c = 'a';
cout << count_if(all(s), [c](char &a)
              { return a == c; });
```

↑ 就相当于定义了这么一个：

```cpp
class Lambda
{
private:
    char c;
public:
    Lambda(char cc) : c(cc) {}
    bool operator()(const char &a) const { return a == c; }
};
//
count_if(all(s), Lambda(c));
```

> REF: [C ++ Lambda 表达式详解](https://blog.csdn.net/A1138474382/article/details/111149792)

### 函数传参类型

在 C++11 中，函数的传参类型有 _传值调用_、_传常量引用调用_、_传引用调用_ 和 _右值引用调用_。其实就是一下的种类：

```cpp
int f(int a) {} // 仅传值
int f(const int& a) {} // 常量引用
int f(int& a) {} // 引用传值
int f(int&& a){} // 右值引用
```

而使用的区别就在于：

- 对于不被改变的 _基本数据类型_ （如 `int add(int a, int b)`），就普通地传形参就行
- 对于不被改变的 _非基本数据类型_ （如 `vector` 或 `string`），就传常量引用
- 对于会被改变的数据 （如 `void swap(int& a, int& b)`），就引用传值

**其中**，第二条的原因在于，如果仅是传形参，实际上调用的是参数的 **拷贝构造函数**，相较于传地址过去会带来极大的消耗

#### 左值引用与右值引用

在 C++ 11 中，引入了左值与右值。简单地来讲，赋值等号左边的是左值，指可取地址的具体变量；等号右边的是右值，通常为没有明确地址的临时值

引用的本质就是通过指针操作的别名，可以通过引用来修改该地址变量的值。函数传参时传引用可以避免耗时的拷贝

```cpp
int a = 233;
int& la = a;    // 正确的，左值引用指向了左值
int& La = 233;  // 错误的，左值引用不能对右值取地址

int&& ra = 233; // 正确的，右值引用就是指向右值的
int&& Ra = a;   // 错误的，右值引用不能指向左值
```

非要给右值引用传左值的话，就得用到 `std::move()` 了，它唯一的作用只是 **把左值强制转化为右值**

一些使用例：

- 触发情况

  ```cpp
  struct node {
    string data;
    node(const string& s) : data{s} {
      cout << "left!\n";
    }
    node(string&& s) : data{s} {
      cout << "right!\n";
    }
  };

  int main() {
    vector<node> arr;
    string s = "asd";
    arr.push_back(s); // 左值引用
    arr.push_back({"213"}); // 右值引用
    // 输出： "left! \n right!"
  }
  ```

- 非基本数据类型的 `swap()`，是通过 `move()` 来交换而不是复制（当然，在 _标准库_ `std::swap()` 中，对右值引用的交换也是通过 `move`来实现的）
  ```cpp
  void Swap(string& a, string& b) {
    string t = move(a);
    a = move(b), b = move(t);
  }
  ```

在标准库中，对于非基本数据类型都传了引用值，而且都分了左右引用的两个版本）对吧……

## C 語言中に

#### 数组长度

```cpp
int len = sizeof(b)/sizeof(int);
```

**`memset`** 批量赋值只能是 `char` 用，`int` 只能给 -1 或 0， 而：

```cpp
memset(a, 127, sizeof(a))   //赋值无穷大
memset(a, 128, sizeof(a))   //赋值无穷小
```

#### `ctime`

- 时间戳获取与转换
  ```cpp
  time_t t = time(0);
  // cin >> t; //当然，也能输入时间戳（秒）
  char tmp[32] = {}, form[] = "%Y-%m-%d %H:%M:%S";
  strftime(tmp, sizeof(tmp), form, localtime(&t));
  cout << tmp << endl;
  ```
- 当前时间
  `cpp time_t t = time(&t); string s = ctime(&t); cout << s << endl; `
  **`cctype`：**

**`#include<cctype>`**：

```cpp
//只能用在单个字符
isalnum(c) //-->是否为字母或者数字
isalpha(c) //-->是否为字母
isblank(c) //-->是否为空格或者 tab
isdigit(c) //-->是否为数字
ispunct(c) //-->是否为符号
isupper(c) //-->是否为大写字母
isspace(c) //-->是否为空格
```

#### `sprintf`

```cpp
sprintf(ans, "%d+%d=%d", x, y, x + y);
// →同时还把 + = 也存进去了
```

#### 符号优先级

![符号优先级](/blog/lang/cpp_priority.png)
