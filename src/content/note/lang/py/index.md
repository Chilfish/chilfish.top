---
title: Python Basic
date: 2023-04-07
tags: [note, py]
---

对......两年了才开始学 Py，真的人身苦短啊......有些地方相较于 js 省事了太多，简单活也比 C++ 舒服太多了

[数据类型](DataType.md)、[函数定义](Function.md)

### 一些基本语句

```python
#if 语句
if condition:
    statement(s)
elif condition:
    statement(s)
elif not condition:
    statement(s)
else:
    statement(s)

# for 循环
for variable in sequence:
    statement(s)
for a in range(n):
    statement
    if a:
      continue

# while 循环
while condition:
    statement(s)

# 函数定义
def function_name(parameters):
    statement(s)
    return [expression]

# 类定义
class ClassName:
    statement(s)

# pass 语句表示不执行任何操作

# 异常处理
try:
    statement(s)
except ExceptionType:
    statement(s)
finally:
    statement(s)

# switch 语句 -> 在这里是 match
def http_error(status):
    match status:
        case 400:
            return "Bad request"
        case 404:
            return "Not found"
        case 418:
            return "I'm a teapot"
        case 200 | 201 | 210:
            return "OK"
        case _:
            return "Something's wrong with the internet"
```

而 null 在这里是 None，tf 则是 True、False

## 特色

### 输入输出

通过终端的 input，默认都是字符串类型的，需要套一层类型转换

print 则是

```python
print(*objects, sep=' ', end='\n', file=sys.stdout, flush=False)
```

- objects 是要输出的一个或多个对象。可以使用逗号将多个对象分隔开，print()函数会自动在每个对象之间添加空格
- sep 参数用于设置多个对象之间的分隔符，默认为一个空格
- end 参数用于设置输出结束时要添加的字符，默认为一个换行符
- file 参数用于指定输出到的文件对象，默认为 sys.stdout，即输出到控制台
- flush 参数用于控制输出缓冲区的行为，默认为 False，表示缓冲区会根据系统的设定进行刷新

### with 语句

`with` 是 Python 中一个非常有用的语句，它用于处理一些需要在代码块结束时清理资源的情况，比如文件、网络连接、数据库连接等

使用 `with` 语句可以保证代码块结束时，文件、网络连接、数据库连接等资源都能够被正确地关闭和清理，避免了因为程序异常退出等原因导致资源泄漏的问题

`with` 语句的语法如下

```python
with expression [as variable]:
    with-block
```

其中，`expression` 是一个上下文管理器对象，它必须定义一个 `__enter__()` 方法和一个 `__exit__()` 方法。`as variable` 是可选的，用于将上下文管理器对象的返回值赋值给变量

在 `with` 代码块中，可以使用上下文管理器对象返回的资源进行操作，执行完代码块后，`with` 语句会自动调用上下文管理器对象的 `__exit__()` 方法，进行资源清理

例如，下面的示例代码使用了 `with` 语句处理文件的读写操作

```python
with open('example.txt', 'r') as f:
    data = f.read()
    # do something with data
```

在这个示例中，`open()` 函数返回的文件对象是一个上下文管理器对象，它负责文件的打开和关闭操作。在 `with` 代码块中，我们可以使用 `f` 对象进行文件的读写操作，执行完代码块后，`f.close()` 方法会自动被调用，关闭文件

### 装包与解包

这不 ES6 的解构赋值嘛）

```python
>>> a = 1, 2, 3, 4
>>> b, c, d, e = a

>>> f = b, c, d, e # f = (1, 2, 3, 4)

>>> b, *c, d = a   # b = 1, c = (2, 3), d = 4
```

这里的 \* 就是指将除了 b、d 以外的值都打包给 c，函数的参数也能通过这样的方式来实现不定参数

所以交换变量就成了：`a, b = b, a`

### 推导式

推导式（Comprehension）是 Python 提供的一种简洁的语法，可以用来快速创建列表、字典、集合等容器类型。它的语法形式为

```python
[expression for item in iterable if condition]
```

推导式的参数包括

- `expression`：用来计算列表元素的表达式，可以是任意的 Python 表达式，通常返回一个值。**起到赋值给 item 的作用**
- `item`：可迭代对象中的元素
- `iterable`：一个可迭代对象，如列表、元组、集合等
- `if condition`：可选的条件表达式，用来**筛选**元素。条件表达式返回 True 或 False。如果没有条件表达式，那么所有的元素都会被包含在列表中

一些例子

```python
# 计算 1 到 10 的平方和
sum([x**2 for x in range(1, 11)])

# 将字符串列表中的所有字符串转为小写
strings = ['Hello', 'World', 'Python']
[s.lower() for s in strings]

# 从字典中获取所有值大于 5 的键
d = {'a': 3, 'b': 7, 'c': 2, 'd': 9}
[k for k, v in d.items() if v > 5]

# 将一个二维列表展平为一维列表
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
[x for row in matrix for x in row]

# 计算两个列表的笛卡尔积
list1 = ['a', 'b', 'c']
list2 = [1, 2, 3]
[(x, y) for x in list1 for y in list2]
# 两个参数的话, 需要括号

# 将一个列表中的元素转为字典的键
words = ['apple', 'banana', 'pear', 'orange']
{x: None for x in words}

# 带判断的表达式赋值
[x+10 if x%2 else x+20 for x in range(10)]
# [20, 11, 22, 13, 24, 15, 26, 17, 28, 19]

# 生成两小时内间隔20分钟的序列
['%.2d:%.2d'%(h,m) for h in range(2) for m in range(0, 60, 20)]
# ['00:00', '00:20', '00:40', '01:00', '01:20', '01:40']
```

而 **生成器** 则是只保存上一个状态的推导式，使用 `next(x)` 来生成下一项，只要改为括号就行了

```python
a = (i for i in range(100))

next(a) # 0
next(a) # 1
next(a) # 2
```
