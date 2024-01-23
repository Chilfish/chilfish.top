---
title: JavaSE
date: 2022-07-24
---

[标准库与第三方库](Libs.md)、[Kotlin](../Kotlin.md)

## 基础语法

### Java 概述

bala

#### 第一行 Java

Java 是完全面向对象的语言，文件名与类名相同，且首字母通常大写。用 `javac *.java` 将 `*.java` 文件编译后得到二进制文件 `*.class`

```java
import java.util.Scanner;

public class Fish {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String str = in.next();
        System.out.println(str);
    }
}
```

## 数据类型

#### 基本类型

还是 `int`、`float`、`String`、`char`、`boolean`，**常量**为 `final`

- **整形：**
  - 范围： `byte`： $\pm2^7-1$ 、 `short`： $\pm2^{15}-1$ 、 `int`： $\pm2^{31}-1$
    、`long`： $\pm2^{63}-1$
  - 特殊表示：长数字可以用下划线分隔： `int a = 2_0000_0000`，`0x`开头表十六进制，`0b`开头表示二进制
- **浮点型：**
  - 范围：`float`： $\pm 3.4 \times 10^{38}$ 、`double`： $\pm 1.79 \times 10^{308}$
  - 表示：`float` 类型要以 `f` 结尾，默认是 `double`
- **单字符：**
  - 16 位 Unicode 字符集，编码方式为 **UTF-16BE**
  - `UTF-16` 使用 2 或者 4 字节表示一个字符，在 65536 以内的占两个字节，而基本上所有汉字的 `Unicode` 编码 [在 19968 到 40869 之间](http://www.chi2ko.com/tool/CJK.htm)，所以一个 char 类型可以存储一个汉字
  - 使用 `''` 括起来
  ```java
  char c1 = 'A'; // 使用单个字符
  char c2 = 65; // 使用十进制的整数（Unicode 值），[0, 65535]
  char c3 = '\u0061'; // 使用十六进制的整数，格式'\uXXXX'，('\u0000'~'\u00FF')
  ```

### 数组

**创建：**

```java
int[] arr = new int[len];        //指定长度但不能初始化
int[] arr = new int[]{233, 455}; // 初始化并推断长度
// 或直接地：
int[] arr = {233};
// 而字符串数组：
String[] str = {"fish", "mie"};
```

**特性：** 数组是引用型数据，直接用等号赋值数组时，两者指向同一个地址

**java.util.Arrays 中的类方法：**

- `String toString(Object[] arr)`：将 a 数组转换成一个字符串，括在方括号（`[]`）中，相邻元素用字符 `, `（逗号加空格）分隔
- `void sort(Object[] a)`：根据元素的自然顺序对指定对象数组按升序进行排序，数组中的所有元素都必须实现 `Comparable `接口
  （`jdk1.7` 后，对于原始数据类型，使用双轴快速排序（`Dual-Pivot QuickSort`），对于对象数据类型，使用 `TimSort`）
- `void sort(T[] a, Comparator<? super T> c)`：根据指定比较器产生的顺序对指定对象数组进行排序
- `void parallelSort(Object[] a)`：以并发的方式对 a 数组的数组元素进行排序
- `void setAll(T[] array, IntFunction<T> generator)`：使用提供的函数计算每一个元素的值，对指定数组中的所有元素进行设置
- `void parallelSetAll(T[] array, IntFunction<T> generator)`：以并发的方式，使用提供的函数计算每一个元素的值，对指定数组中的所有元素进行设置
- `type binarySearch(Object[] a, type key)`：使用二分法查询 key 元素值在 a 数组中出现的索引，如果 a 数组不包含 key 元素值，则返回 - (插入点 + 1)（调用该方法时要求数组中元素已经按**升序排列**；插入点为第一个大于 key 的元素索引）
- `boolean equals(Object[] a, Object[] a2)`：如果 a 数组和 a2 数组的长度相等，且 a 数组和 a2 数组的数组元素也一一相同，该方法将返回 `true`
- `Object[] copyOf(Object[] original, int newLength)`：复制 `original` 数组，截取或用 `0`（数值类型）、`false`（布尔类型）或者 `null`（引用类型）填充，以使新数组的长度为 `newLength`
- `List<T> asList(T... a)`：把一个引用类型的数组或指定个数的对象转换成固定长度的 List（`Arrays.ArrayList`），只能遍历访问该集合里的元素，不可增加、删除该集合里的元素，否则会引发 `UnsupportedOperationException` 异常（对数组元素的修改，会影响转化过来的集合）

### 字符串

**多行字符串：** 其中共同的前置空格会被去掉

```java
String str = """
        |  mie |
        |  Fish|
        |  233 |
        """
```

**格式化 | 模板字符串：** 可以用类似 _C 语言_ 的`printf`，也能用 `String.format("", xx)`：

```java
public static String fun(String key, int value) {
    return String.format("""
            {
                key: %s,
                value: %d
            }""", key, value);
}
```

## 函数方法

**可变参数列表：** 传入的参数个数可变，可为数组，参数最终体现的是**数组**类型

```java
public static int add(int... numbers) {
  int sum = 0;
  for (int num : numbers) {
      sum += num;
  }
  System.out.println(Arrays.toString(numbers));
  return sum;
}
```

## 面向对象

### 修饰符

**控制访问权限：**

- 默认为 `default`，只能在当前类或包下的类访问
- `private` 只能在当前类访问
- `protected` 可在被继承的子类访问
- `public` 可以在任何地方被访问

**`static`：**

- **静态方法**
  - 静态方法可以直接 **通过类名调用**，任何对象也可以调用，因此静态方法中不存在 `this` 和 `super` 关键词
  - 静态方法 **不可以访问** 所属类的实例变量和实例方法（非静态）！因为实例变量和方法都是与对象相关的，而 **静态方法是独立于对象的**
  - `static` 方法必须被实现，不可以抽象
  - 静态方法 **可以直接调用** 同类的其他的静态成员（包括变量和方法）
  - 虽然静态方法不可以调用非静态成员，但是对象可以调用静态方法
- **静态变量：** 可以看作 `static` 变量为一种全局变量
  - 可以被构造器和实例方法调用
  - 属于整个类而不是某一个对象
  - 不会被回收
- **静态代码块：** 一段不依赖于类和方法的代码
  - 静态代码块在类被加载的的时候运行且只运行一次
  - 静态代码块**优先于主函数执行**。静态代码块还是写在类中，由类调用
  - 静态代码块中的变量是局部变量，和普通方法中的变量没有区别

**`final`：**

- `final` 修饰类时，表明这个类 **不能被继承**。 且类中的所有成员方法都会被**隐式地**指定为 `final` 方法
- `final` 修饰方法时，表明这个方法 **不能被任何子类重写**，因此，如果只有在想明确禁止该方法在子类中被覆盖的情况下才将方法设置为 `final`
- `final` 修饰变量分为两种情况，一种是修饰基本数据类型，表示数据类型的**值不能被修改**； 一种是修饰引用类型，表示对其初始化之后便**不能再让其指向另一个对象**

**`this`：**

- 指向对象本身，或对象中的变量
- `this(args)` 用于调用构造函数

**`super`：** 和 `this` 差不多，但指向了被继承的父类。且：调用 `super()` 必须写在子类构造方法的第一行，否则编译不通过

**`abstract`：** 抽象类

### 多态

多态的 3 个必要**条件**

1. 继承
2. 重写
3. **父类引用指向子类对象**

**要点：**

- 使用父类类型的引用指向子类的对象
- 该引用只能调用**父类中定义的方法和变量**
- 如果**子类中重写了父类中的一个方法**，那么在调用这个方法的时候，将会调用**子类**中的这个方法（动态连接、动态调用）
  也就是不能被重写的不算多态
  - **`static` 方法**：因为被 `static` 修饰的方法是属于类的，而不是属于实例的
  - **`final` 方法**：因为被 `final` 修饰的方法无法被子类重写
  - **`private` 方法和 `protected` 方法**：前者是因为被 `private` 修饰的方法对子类不可见。后者是因为尽管被 `protected` 修饰的方法可以被子类见到，也可以被子类重写，但是它是无法被外部所引用的
- **变量不能被重写**（覆盖），"重写" 的概念只针对方法，如果在子类中"重写"了父类中的变量，那么在编译时会报错

**例：**

```java
class Father {
    void func1() {
        func2();
    }
    // 这是父类中的func2()方法，因为下面的子类中重写了该方法 ，所以在父类类型的引用中调用时
    // 这个方法将不再有效，取而代之的是将调用子类中重写的func2()方法
    void func2() {
        System.out.println("AAA");
    }
}
class Child extends Father {
    // func1(int i)是对func1()方法的一个 *重载*
    // 由于在父类中没有定义这个方法，所以它不能被父类类型的引用调用
    // 所以在下面的main方法中child.func1(233)会报错
    void func1(int i) {
        System.out.println("BBB");
    }
    // func2()重写了父类Father中的func2()方法
    // 如果父类类型的引用中调用了func2()方法，那么必然是子类中重写的这个方法
    @Override
    void func2() {
        System.out.println("CCC");
    }
}
// in main
public static void main(String[] args) {
    Father child = new Child(); // 父类引用子类对象即为多态
    child.func1();
}
```

### 抽象类与接口

- 用 `abstract` 定义抽象类
- 用 `implements` 使用接口
- 抽象类主要用来 定义父类的整体属性方法，接口是用来 拓展一些有部分共用但不是全部的新方法

### 内部类

### 常见类

#### Object 类

**克隆方法：** 要重写 clone 函数才能实现深拷贝

```java
class Goldfish implements Cloneable {
    @Override
    public Goldfish clone() {
        Goldfish cloned;
        try {
            cloned = (Goldfish) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }
        return cloned;
    }
}
```
