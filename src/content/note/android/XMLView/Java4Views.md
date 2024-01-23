---
title: 控制 View 属性的 Java 代码
date: 2023-04-12
tags: [Android]
---

旨在用 Java 动态控制 xml 中的属性）这不 js 嘛）

### LayoutParams

控制 `android:layout_xx`

LayoutParams 通常在代码中用于动态地设置一个 View 的布局参数，以便在运行时改变 View 的位置、大小、对齐方式等属性

除了常见的 margin、width 等，在 RelativeLayout 中，LayoutParams 还可以定义 View 与其它 View 的相对位置关系，如 `alignParentTop`、`alignLeft` 等属性

在实际使用中，LayoutParams 通常是通过 View 的 `getLayoutParams()` 方法获取，然后通过设置其属性来改变 View 的布局参数。例如：

```java
LinearLayout.LayoutParams params = (LinearLayout.LayoutParams) view.getLayoutParams();
params.width = 100;
params.height = 100;
params.gravity = Gravity.CENTER;
view.setLayoutParams(params);
```

通过以上代码，我们可以将一个 View 的宽度和高度都设置为 100 像素，同时将其在父容器中居中对齐。这样，我们就可以在运行时动态地改变 View 的布局参数，从而实现灵活的 UI 布局

### ImageView

例如设置网络图片作为 src，就要用到第三方库 [glide](https://github.com/bumptech/glide)。在 app 的 build.gradle 的 dependencies 添加：

```groovy
  implementation 'com.github.bumptech.glide:glide:4.12.0'
  annotationProcessor 'com.github.bumptech.glide:compiler:4.12.0'
```

然后就是导入）记得带 try catch

```java
try {
  Glide.with(view.getContext())
      .load(url)
      .into(imgViewId);
} catch (Exception e) {
      e.printStackTrace();
}
```
