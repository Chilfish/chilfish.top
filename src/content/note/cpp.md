---
title: C / C++
date: 2022-04-14
tags: [note, C++]
---

## 一些小语法

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
