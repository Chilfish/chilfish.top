---
title: Python 数据类型
date: 2023-04-07
tags: [Python]
---

列表（list）、元组（tuple）、字符串（string）、字典（dict）、集合（set）

其中，列表、元组和字符串都属于**序列类型**，它们可以进行某些通用的操作，比如索引、分片等；字典属于映射类型，每个元素由键（key）和值（value）构成；集合是一种特殊的类型，它所包含的元素是不重复的

### 序列 sequence

序列可以理解为是允许有多种不同类型放一起的数组

- `len(seq)`：返回序列的长度
- `seq[index]`：返回序列中指定索引位置的元素，索引从 0 开始，非法则抛出 IndexError 异常
- `seq[begin:end]`：返回序列中指定范围的子序列，**左闭右开区间**
- `seq.count(item)`：返回序列中指定元素出现的次数
- `seq.index(item)`：返回序列中指定元素第一次出现的索引位置，若不存在则抛出 ValueError 异常
- `seq + other_seq`：返回两个序列的拼接结果
- `seq * n`：返回序列重复 n 次的结果

其中的 **分片**，参数为 `seq[begin:end:step]`，第三个表示步长，负数表示从右往左数，而且 begin 总是小于 end 的。同时参数都是可省略的，留空即可

所以浅拷贝序列可以为 `a = seq[:]`

为了检查一个值是否在序列中，可以使用 `in` 运算符，比如

```python
>>> 'he' in 'hello'
True
>>> 'hl' in 'hello'
False
>>> 10 in [6, 8, 10]
True
```

对于全是同样类型的序列，可以用 max(seq) 和 min 来取得最值

#### 列表

列表（list）是 Python 中最常用的数据类型之一，它可以存储多个元素，这些元素可以是数字、字符串、布尔值等各种类型。**也就是一个可变数组**

以下是列表的一些常用的方法

- `list[i:j:s] = l`：将可迭代的 l 赋值给区间内的 list，注意区间元素的个数要不小于 l 的个数
- `list.append(x)`：在列表末尾添加一个元素 x
- `list.count(x)`：返回元素 x 在列表中出现的次数
- `list.index(x)`：返回元素 x 在列表中第一次出现的索引位置
- `list.reverse()`：将列表中的元素反转

- `list.clear()`：清空列表中的所有元素
- `list.copy()`：浅拷贝列表
- `s.extend(t)` 或 `s += t`：用 t 的内容扩展 s (基本上等同于 `s[len(s):len(s)] = t`)
- `list.insert(i, x)`：在指定索引位置 i 插入元素 x
- `list.pop([i])`：删除并返回指定索引位置 i 处的元素；i 如果未指定，默认为-1，即删除并返回列表的最后一个元素
- `list.remove(x)`：删除列表中第一个出现的元素 x，没有则抛出异常
- `list.sort()`：对列表进行排序

#### range

range 类型表示不可变的数字序列，通常用于在 for 循环中循环指定的次数

初始化：`range(begin, end, step)`。range 对象也都能用序列的方法

#### 元组

元组（tuple）是 Python 中的一种不可变序列类型，类似于列表（list），但是元组一旦被创建就不能被修改。否则抛出错误：`TypeError: 'tuple' object does not support item assignment`

元组用括号来创建，括号也能省略。`a = 1, 2, 'ad, [3, 1]`，单元素则是要：`a = 23,`

#### 字符串

字符串是不可变只读的

**一些定义的前缀**

- `b"xx"` 表示字节字符串，即字符串的每个字符都是一个字节，常用于处理二进制数据。比如 `b"hello"` 表示字节串，它的长度为 5，每个字符都是一个字节，分别是 `b'h', b'e', b'l', b'l', b'o'`

- `f"xxx"` 表示格式化字符串，其中 `{}` 中的表达式会被计算并替换成相应的值。比如 `name = 'Alice'; age = 25; f"My name is {name}, and I am {age} years old."` 会被格式化成字符串 `"My name is Alice, and I am 25 years old."`

- `r"xx"` 表示原始字符串，其中的转义字符会被原样输出，不会被解释为特殊字符。比如 `r"\n"` 表示字符串 `\n`，而不是换行符

- `u"xx"` 表示 Unicode 字符串，即字符串的每个字符都是一个 Unicode 码点。在 Python 3 中，所有字符串都是 Unicode 字符串，因此在 Python 3 中已经不需要使用 `u"xx"` 了

- `x"xx"` 表示十六进制字符串，即字符串的每个字符都是一个十六进制数。比如 `x"48656c6c6f"` 表示字符串 `Hello`

- `b""`, `f""`, `r""`, `u""`, `x""` 等字符串前缀可以组合使用，比如 `rb"hello"` 表示字节串，其中的转义字符会被原样输出，比如 `rb"\n"` 表示字节串 `b'\n'`

**一些方法**

- `find(sub[, begin[, end]])`：查找字符串中指定子字符串的位置，如果未找到则返回-1
- `join(iterable)`：将一个可迭代对象中的元素连接成一个字符串

```python
>>> '/'.join(['', 'user', 'bin', 'ssh'])
'/user/bin/ssh'

>>> '+'.join(['1', '2', '3', '4', '5'])
'1+2+3+4+5'

>>> ' '.join(['that', 'is', 'a', 'question'])
'that is a question'

>>> ''.join(['h', 'e', 'll', 'o'])
'hello'

>>> '+'.join([1, 2, 3, 4, 5])          # 不能是数字
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: sequence item 0: expected string, int found
```

- `split(str)`：以 str 作为分隔符，分割为 list，默认为单个空格
- `count(sub[, begin[, end]])`：返回字符串中指定子字符串出现的次数
- `strip(str)`：移除左右两侧包含 str 的字符，默认为空格

```python
# 移除左右两侧空格
>>> '  hello world!   '.strip()
'hello world!'
# 移除左右两侧的 '%' 或 '#'
>>> '%%%   hello world!!!  ####'.strip('%#')
'   hello world!!!  '
# 移除左右两侧的 '%' 或 '#' 或空格
>>> '%%%   hello world!!!  ####'.strip('%# ')
'hello world!!!'
```

- `str.replace(old, new[, count])`： 替换字符串

  - 其中，str 是要进行替换操作的字符串，old 是要被替换的子串，new 是要替换成的字符串。可选参数 count 表示替换的次数，如果指定了 count，则只替换前 count 个匹配项
  - replace 方法会返回一个新的字符串，原字符串不会被修改。如果要修改原字符串，可以将返回值赋值给原字符串变量

- `lower()`、`upper()`：将字符串中所有字母转换为小|大写

- `capitalize()`：将字符串的第一个字符转换为大写字母

- `encode([encoding[, errors]])`：将字符串编码为指定的编码格式

- `endswith(suffix[, begin[, end]])`：判断字符串是否以指定的后缀结尾

- `expandtabs([tabsize=8])`：将字符串中的制表符（\t）转换为空格，并按照指定的宽度进行对齐

<div class="h5">插值字符串及格式化</div>

```python
a = 4.14151919
f'hello {a:.4f}' # hello 4.1415

# 补前导零
'-3.14'.zfill(5) # '-003.14'

# 输出变量名
bugs = 'roaches'
count = 13
area = 'living room'

print(f'Debugging {bugs=} {count=} {area=}')
# Debugging bugs='roaches' count=13 area='living room'
```

### 字典

字典也就是 map，json 对象。其中键必须是不可变类型 -> 数字、字符串、元组

**创建**

```python
# 空字典
>>> d0 = {}
>>> d0
{}

>>> d1 = {'name': 'ethan', 'age': 20}
>>> d1
{'age': 20, 'name': 'ethan'}

# 更新字典
>>> d1['age'] = 21
>>> d1
{'age': 21, 'name': 'ethan'}

# 使用 dict 函数
>>> d2 = dict(name='ethan', age=20)
>>> d2
{'age': 20, 'name': 'ethan'}

>>> item = [('name', 'ethan'), ('age', 20)]
>>> d3 = dict(item)
>>> d3
{'age': 20, 'name': 'ethan'}
```

**遍历**

```python
>>> d = {'name': 'ethan', 'age': 20}
>>> for key in d:
      print('%s: %s' % (key, d[key]))

age: 20
name: ethan

# 要删除的话，得这样
>>> for key in list(d.keys()):
      if key == 'name':
        del d[key]

>>> d
{'age': 20}

# 同时获取键值
>>> for k, v in d.items():
      print '%s: %s' % (k, v)
```

in 用来判断键是否在里面

**一些方法**

- `items()`：返回一个包含字典所有键值对的元组列表
- `keys()`：返回一个包含字典所有键的列表
- `values()`：返回一个包含字典所有值的列表
- `clear()`：清空字典中的所有元素
- `copy()`：返回一个字典的浅拷贝

- `get(key[, default])`：返回字典中键 key 对应的值，如果 key 不存在，则返回 None
- `pop(key[, default])`：删除并返回字典中键 key 对应的值，如果 key 不存在，则返回 None

- `popitem()`：随机删除并返回字典中的一对键值对
- `fromkeys(seq[, value])`：创建一个新字典，以序列 seq 中的元素作为字典的键，value 为字典所有键对应的默认值
- `setdefault(key[, default])`：返回字典中键 key 对应的值，如果 key 不存在，则将 key 和 default 插入到字典中并返回 default
- `update([other])`：将其他字典或键值对序列的键值对更新到字典中，键相同则覆盖

### 集合

集合就是只存不重复的 key，也是 for in 遍历

**一些方法**

- `add(elem)`：向集合中添加元素 elem
- `pop()`：随机移除并返回集合中的一个元素
- `discard(elem)`：移除集合中的元素 elem，如果 elem 不在集合中，则不执行任何操作
- `clear()`：清空集合中的所有元素
- `remove(elem)`：移除集合中的元素 elem，如果 elem 不在集合中，则引发 KeyError 异常
- `copy()`
- `update(*others)`：将其他集合或元素添加到集合中：返回一个集合的浅拷贝

- `union(*others)`：返回一个包含集合和其他集合**并集**的新集合，或者用 `a | b`
- `intersection(*others)`：返回一个包含集合和其他集合**交集**的新集合，或则用 `a & b`
- `difference(*others)`：返回一个包含集合和其他集合**差集**的新集合，或则用 `a - b`
- `symmetric_difference(other)`：返回一个包含集合和 other **对称差集**的新集合，或者是 `a ^ b`
- `symmetric_difference_update(other)`：将集合中只包含在其他集合或自身中的元素

- `difference_update(*others)`：从集合中移除包含在其他集合中的元素
- `intersection_update(*others)`：将集合中只包含在其他集合中的元素

- `isdisjoint(other)`：如果集合和 other 没有共同元素，则返回 True，否则返回 False
- `issubset(other)`：如果集合是 other 的子集，则返回 True，否则返回 False
- `issuperset(other)`：如果集合是 other 的超集，则返回 True，否则返回 False

### 排序

标准库的排序是优化后的归并与插入的混合，对于能迭代的数据都能排序

列表都能排序，而且必须得都是同一类型的元素。默认的 `list.sort()` 是将原序列排序而没有返回值，`sorted(list)` 才会返回已排序的，而且不影响原序列

参数：`list.sort(key, reverse)`，key 将接受一个函数作为对排序规则的规定，reverse 为 True 则反向排序

- 对字符串列表按长度排序

```python
lst = ['apple', 'banana', 'cherry', 'date', 'elderberry']

sorted(lst, key=len)
# Output: ['date', 'apple', 'banana', 'cherry', 'elderberry']
```

- 对元组列表按元素中的第二个值排序

```python
lst = [(1, 'apple'), (3, 'banana'), (2, 'cherry'), (4, 'date')]

sorted(lst, key=lambda x: x[1])
# Output: [(1, 'apple'), (3, 'banana'), (2, 'cherry'), (4, 'date')]
```

- 对字典列表按字典中的值排序

```python
lst = [{'name': 'Alice', 'age': 25}, {'name': 'Bob', 'age': 22}, {'name': 'Charlie', 'age': 28}]

sorted(lst, key=lambda x: x['age'])
# Output: [{'name': 'Bob', 'age': 22}, {'name': 'Alice', 'age': 25}, {'name': 'Charlie', 'age': 28}]
```

- 对自定义类对象列表按类属性排序

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __repr__(self):
        return f"Person(name='{self.name}', age={self.age})"

lst = [Person('Alice', 25), Person('Bob', 22), Person('Charlie', 28)]

sorted(lst, key=lambda x: x.age)
# Output: [Person(name='Bob', age=22), Person(name='Alice', age=25), Person(name='Charlie', age=28)]
```
