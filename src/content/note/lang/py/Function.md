---
title: 函数定义
date: 2023-04-09
tags: [Python]
---

### 定义

函数的参数

- **位置参数**：位置参数是指按照顺序传递给函数的参数，参数顺序必须与函数定义时的顺序一致。例如

```python
def add(x, y):
    return x + y

add(1, 2) # 3
```

- **关键字参数**：关键字参数是指通过参数名来指定传递的值，可以不按照函数定义时的顺序传递参数。例如

```python
add(y=2, x=1) # 3
```

- **默认参数**：默认参数是指在函数定义时给参数指定一个默认值，如果调用函数时没有传递该参数，则使用默认值。例如

```python
def add(x, y=2):
    return x + y

add(1) # 3
add(1, 3) # 4
```

- **可变参数**：可变参数是指在函数定义时不确定传递的参数个数，可以通过一个星号（\*）表示。在函数内部，可变参数会被转换成一个元组。例如

```python
def add(*args):
    result = 0
    for arg in args:
        result += arg
    return result

add(1, 2, 3) # 输出 6
add(1, 2, 3, 4, 5) # 输出 15
```

- **关键字可变参数**：关键字可变参数是指在函数定义时不确定传递的关键字参数个数，可以通过两个星号（\*\*）表示。在函数内部，关键字可变参数会被转换成一个字典。例如

```python
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(key + ': ' + value)

print_info(name='张三', age='20', gender='男')
```

- **参数解包**：指的是将一个可迭代对象中的元素解包成单独的参数传递给函数

```python
nums = [1, 2]
add(*nums) # 输出 3
```

**Lambda 表达式** 是一种匿名函数，它可以在不定义函数名称的情况下创建一个简单的函数。Lambda 表达式通常用于函数式编程中，可以作为参数传递给其他函数

```python
add = lambda x, y: x + y
add(1, 2) # 输出 3

# 闰年计算
run = lambda y: y%100 and y%4==0 or y%400==0
```

> 它也只能是单行函数

### map reduce filter

### 装饰器

装饰器就是为函数添加副作用，但又不直接在原本的函数中修改，也就是这个副作用可能就在某个作用域有效，在别的地方这个函数还是保持原有的功能

一些的应用场景

- 注入参数（提供默认参数，生成参数）
- 记录函数行为（日志、缓存、计时什么的）
- 预处理／后处理（配置上下文什么的）
- 修改调用时的上下文（线程异步或者并行，类方法）

如记录运行时间

```python
import time

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        time_ = start - time.time()
        print(f"Function {func.__name__} took {time_:.2f} seconds to execute")
        return result

    return wrapper

@timer
def slow_function():
    time.sleep(2)

slow_function()
```

这里的 @ 是一个语法糖，作用是标记出装饰器函数。当然也能在标记的时候传参，这时候装饰器就要再多套一层函数了

```python
from functools import wraps

def log(logFile='out.log'):
    def logging_decorator(func):
        @wraps(func)
        def wrapped_function(*args, **kwargs):
            log_string = func.__name__ + " was called"
            with open(logFile, 'a') as opened_file:
                opened_file.write(log_string + '\n')
            return func(*args, **kwargs)

        return wrapped_function

    return logging_decorator

@log(logFile='fun.log')
def fun():
    pass

@log
def fun1():
    pass

fun()
fun1()
```

其中 `@wraps(func)` 是一个装饰器，用于将被装饰的函数的元信息（如函数名、文档字符串、参数列表等）复制到装饰器函数中，这样可以让装饰器函数看起来更像被装饰的函数，同时也方便调试和文档生成。这是因为使用装饰器后，原本函数的元信息都被覆盖了，可以通过 `fun.__name__` 来查看

#### 使用 inspect 来获取原函数的元信息

有一点是，在下面中并不能通过 kwargs.get 来获关键字参数，因为在调用的时候只是用了位置参数，它只能被 \*args 捕获

> 只有显式地使用参数名调用 `fun(a=2, b=3, c=1)`，才会被捕获到 \*\*kwargs 里

```python {.line-numbers highlight=4}{4}
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print("Positional arguments:", args)
        print("Keyword arguments a:", kwargs.get('a'))
        return func(*args, **kwargs)

    return wrapper

@my_decorator
def my_function(a, b, c):
    pass

my_function(1, 2, 3)
```

为此，为了避免去考虑这些，就引入了 inspect

```python
def my_decorator(func):
    def wrapper(*args, **kwargs):
        arg = inspect.getcallargs(func, *args, **kwargs)
        print("Keyword arguments a:", arg.get('a'))
        return func(*args, **kwargs)

    return wrapper
```

`inspect.getcallargs` 将以字典的形式返回原参数列表

### 闭包

闭包是指一个函数内部定义的函数，并且该内部函数可以访问外部函数的局部变量。具体来说，当一个函数返回一个内部函数时，如果该内部函数引用了外部函数的变量，则这个内部函数和其外部函数的变量就构成了一个闭包

闭包的作用包括

- 保护变量：由于闭包可以访问外部函数的局部变量，因此可以通过闭包来保护变量，防止被外部函数或其他代码修改

- 延长变量的生命周期：外部函数的变量在函数执行完后会被销毁，但是如果有内部函数引用了该变量，那么该变量就会被保存在内存中，直到内部函数被销毁

- 实现装饰器：装饰器就是利用闭包来实现的，通过在函数定义前加上@decorator 的方式来使用装饰器

- 实现回调函数：闭包可以将函数作为参数传递给其他函数，在其他函数调用时执行该函数，这就是回调函数的实现方式之一

需要注意的是，虽然闭包可以带来很多好处，但是如果滥用闭包，可能会导致内存泄漏等问题。因此，在使用闭包时需要注意控制好变量的作用域和生命周期
