---
title: Scss、Less 拓展的 CSS
date: 2022-11-19
---

> [Scss 教程](https://juejin.cn/post/7055101823442485255)

## SCSS

### 基础语法

#### 编译

- 安装 `live Sass Compile` 插件，再点底栏的 `watch sass`。 `settings.json` 的配置：

```json
{
  "liveSassCompile.settings.formats": [
    {
      "format": "compact", // 可定制的出口 CSS样式
      // - expanded：缩进成css样式
      // - nested：按Scss的嵌套层次缩进
      // - compact：按分类缩进，以空行为界
      // - compressed：完全缩进成一行
      "extensionName": ".min.css", // 编译后缀名
      "savePath": "/css" // 编译保存的路径，以当前工作区为根目录
    }
  ],
  // 排除编译的路径
  "liveSassCompile.settings.excludeList": ["**/node_modules/**", ".vscode/**"]
}
```

> 而且不编译单行注释， `compressed` 不编译多行注释，`/*! xxx */` 强制编译

#### 变量

```scss
$primary_color: #243e59;
$name: "fish";
// 使用
.#{$name} {
  color: $primary_color;
}
// 编译成：
.fish {
  color: #243e59;
}
```

**模板字符串：** `#{$var}`：在字符串里套变量

**嵌套选择：** 像 `html` 那样的嵌套结构。而缩略属性也能写：

```scss
html {
  font: {
    size: 16px;
    decoration: none;
    family: "Lato", sans-serif;
  }
}
// 等同于
html {
  font-size: 16px;
  font-family: "xxxx";
}
```

**父级选择器：** 也就是将 当前的属性名替换成 `&`

```scss
.fish {
  color: #654321;
  &:hover {
    color: #123456;
  }
}
//编译成：
.fish {
  color: #654321;
}
.fish:hover {
  color: #123456;
}
```

### 继承 复用与导入

- **`@mixin`：** 类比于函数，还可以传入参数。按顺序传入或指定参数名
  ```scss
  // 默认参数为0
  @mixin absolute($top: 0, $right: 0) {
    position: absolute;
    top: $top;
    right: $right;
  }
  .fish {
    @include absolute(20px, 30px); // absolute();
  }
  ```
  `@mixin` 是可以重复使用的一组 css 声明，有助于减少重复代码，只需声明一次，就可在文件中引用。混合指令可以包含所有的 css 规则，绝大部分 scss 规则，可以传递参数，输出多样化的样式
- **`@extend`：** 继承样式： `@extend .fish;`
- **`@import`：** scss 拓展了 `@import` 的功能，允许其导入 scss 或 sass 文件。被导入的文件将合并编译到同一个 css 文件中，被导入的文件中所包含的变量或者混合指令 (`mixin`) 都可以在导入的文件中使用
- **`@Partials`：** 忽略编译的文件，在文件名前加一个下划线。主要是用来定义**公共样式**的，专门用于被其他的 scss 文件 import 进行使用的
- **`@function`：** 主要用于计算，带返回值 `@return`

**也就是：** `@function` 用来计算，`@mixin` 用来封装样式，`@import` 用来抽离他们为一个模块

### 语句

#### @if

`@if` 语法和 js 类似，基本格式是`@if...@else if...@else`

```scss
.fish {
  @if ($a > 20) {
    color: #123;
  } @else if ($a < 20) {
    color: #234;
  } @else {
    color: #233;
  }
}
```

#### @for

for 在条件范围内重复操作，这个指令包含两种格式： `@for $var from <start> through | to <end>;`

两者区别在于 `through` 与 `to` 的含义：

- 使用 `through` 时，条件范围：`[start, end]`
- 使用 `to` 时条件范围：`[start, end)`
- `$var` 可以是任何变量，比如`$i`，`<start>` 和 `<end>` 必须是整数值

```scss
@for $i from 1 to 3 {
  .fish span:nth-child(#{$i}) {
    width: 20 * ($i - 1) + px;
  }
}
```

#### @each

类似于 `foreach`

```scss
$num_list: 1 3 4;
@each $ele in $num_list {
  .p#{$ele} {
    height: $ele * $ele;
  }
}
```

#### @while

```scss
$column: 12;
@while $column>0 {
  .col-sm-#{$column} {
    width: $column / 12 * 100%;
  }
  $column: $column - 1;
}
```

## 与 Less 的不同之处
