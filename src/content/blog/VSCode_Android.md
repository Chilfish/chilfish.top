---
title: VSCode on Android
date: 2023-04-04
tags: [Linux, Termux]
---

### 折腾前言

虽然已经有 [Code FA](https://github.com/nightmare-space/vscode_for_android) 这样的软件可以直接跑 vscode，但 Bug 蛮多的，而且又另装了 Ubuntu 隔离了环境，但没提供外部 Shell 来访问这个 Ubuntu。它的实现方式也是经典的 code-server 再跑在 WebView 上，那我就想着还不如在本机上直接跑 code-server，于是就开始了折腾之路......

虽然 [文档](https://coder.com/docs/code-server/latest/termux) 已经讲好了，但实际用 pkg 下下来的 node-lts 已经是 v18 了，但 code-server 居然仅支持 v16，而 apt 和 pkg 又没法指定版本......尝试了诸如 n、fnm、nvm 这样的 node 版本管理器，但实测在 wsl2 的 Ubuntu 完美运行，就是在 Termux 上出现了网络、目录、权限等问题下不了或者运行不过...... fnm 在 Termux 的网络问题过了两年了 [issue](https://github.com/Schniz/fnm/issues/520) 还是没人理.... 但也不能直接从 [.tar.gz](https://github.com/Schniz/fnm/issues/161) 上安装

但还是最后在 Reddit 上翻到了一个 [教程](https://gist.github.com/ppoffice/b9e88c9fd1daf882bc0e7f31221dda01?permalink_comment_id=4339755#gistcomment-4339755)，说是要先 [装个 Ubuntu](./tips/android.md#安装-ubuntu)，然后就能愉快地使用了......

而且 Code FA 也差不多是这个方案，用 proot-distro 来跑 Ubuntu

<figure align="center"><img src="/img/vscode_termux.webp"/><figcaption>
好诶
</figcaption></figure>

但是睡前想了又想，这不就是在模拟器里套模拟器了嘛...

早上爬起看了眼，果然是有方法的，不 root 的话，就用 [UserLAnd](https://play.google.com/store/apps/details?id=tech.ula) 了

### Start Ubuntu

前置的在 [安装 UserLAnd](./tips/android.md#更好的-userland)

### 一键安装

> 更新：现在已经支持直接从 pkg 仓库安装了，就能方便地升级之类的， 见 [文档](https://coder.com/docs/code-server/latest/termux#installation)

噢这实在是太蠢了，居然要一点一点地下载安装，但其实只要一条脚本就好了......就在 index 里，照着文档的反而一堆坑

```bash
curl -fsSL https://code-server.dev/install.sh | sh
```

等装好后运行

```bash
code-server --auth none
```

这边建议用 Chrome 打开 http://localhost:8080，然后选安装为应用，PWA 会更舒服些

<figure align="center"><img src="/img/vscode_ubuntu.webp"/><figcaption>
好诶
</figcaption></figure>

但同样是内嵌 Ubuntu，Termux 套出来的还是识别出安卓诶

### 配置 VSCode

基本没什么，但似乎没法登陆，但也可以在电脑上选 齿轮 -> 配置文件 -> 导出配置文件 -> 导出为 gits，然后再把 gits 的 raw 链接复制过去就行。且记得先别勾上拓展

再就是，如果网络问题或者断网运行的时候，那个插件栏会一直转圈而不激活，这时需要先去设置把 Extensions 的 `Auto Check Updates` 给关掉

以及，像是 C++ 这个插件是不能直接下的，需要从 [网页版](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) 的右侧 Download Extensions 中选中 arm64 来下载

同时，这个 UserLAnd 是不能直接访问内部存储的所有文件的，但可以在 `/storage/internal` 中，对应手机里的是 `Android/data/tech.ula/files/storage`。所以需要将下载的插件移动到这个目录里，然后选 **"从 VSIX 安装"**
