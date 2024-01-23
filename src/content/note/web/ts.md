---
title: TypeScript
date: 2023-07-13
---

可以先从 [Typescript 入门教程] 开始，然后再到 [Typescript 文档] 补了，也可以熟读 [Typescript Book]

## 类型

### 字面量类型

在 DOM 的事件中有这么一句： `x.addEventListener('click', fn)`，这里用字符串 click 来指定事件的类型，而且在 VSCode 的写下 `cl`的时候还会有完整的补全。这背后就是字面量类型的作用了

```ts
type Event = 'click' | 'blur' | 'keydown'
```

### 键值类型

类似枚举，但实际上 Typescript 的枚举在类型提示和使用上还是挺糟心的。例如：

```ts
enum Color {
  Red = '#ff0000',
  Green = '#00ff00',
  Blue = '#0000ff',
}

function styled(text: string, color: Color) {}
```

这时候鼠标悬浮在 color 上，显示的类型还是 `enum Color`，这还得点进去看它的实现才能知道是怎么回事。同时要使用的话，只能是 `styled('text', Color.Red)`，而不能像字面量类型那样使用字符串，但纯字面量类型又不能直接用键值对的形式。所以在这方面更推荐使用 **对象**，下面的用法

```ts
const ColorConfig = {
  Red: '#ff0000',
  Green: '#00ff00',
  Blue: '#0000ff',
} as const

type Color = keyof typeof ColorConfig

function styled(text: string, color: Color) {}

styled('text', 'Red')
```

这时候 color 的类型提示就成了 `(parameter) color: "Red" | "Green" | "Blue"`，在调用函数的时候也就能直接传字符串进去，享受到字面量类型的便利和键值对的功能了

参考自：[Enums considered harmful]

### 类型缩小

通常是为了将 any 或者 `|` 了 null 等其他类型，然后写一个 isType 函数来将参数的类型缩小

在 TypeScript 中缩小类型范围的其他方法包括：

- `instanceof` 操作: 用于检查对象是否是特定类的实例
- `in` 操作: 用于检查对象中是否存在属性
- `typeof` 操作: 用于在运行时检查值的类型
- 内部函数，比如: `Array.isArray()`: 用于检查值是否为数组

#### 类型谓词 x is Type

例如要写一个判断类型的函数（可能是一个复杂的 JSON 对象中的某些键值）

```ts
function isString(test: any): boolean {
  return typeof test === 'string'
}

function example(foo: any) {
  if (isString(foo)) {
    // 这里是没有得到正确的将 foo 推断为 string
  }
}
```

如果像这样返回为 Boolean 的话，此时判断后的类型还是 any。这时候就需要改一下它的返回值：

```ts
function isString(test: any): test is string {
  return typeof test === 'string'
}
```

这样就能成功地在 if 判断中将 foo 的类型缩小为 string 了

### | &

集合的思想，`|` 取两个类型的并集， `&` 取的是交集，没有交集的时候就断定为 never。且任何类型 & | any 还是 any

```ts
type a = string | number // string or number
type b = string & number // never
type c = string & any // any
type d = string | any // any
```

### 类型操作

[Typescript 入门教程]: http://ts.xcatliu.com/
[Typescript 文档]: https://www.typescriptlang.org/docs/
[Typescript Book]: https://github.com/gibbok/typescript-book
[Enums considered harmful]: https://www.youtube.com/watch?v=jjMbPt_H3RQ
