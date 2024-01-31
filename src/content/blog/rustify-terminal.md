---
title: 锈化你的命令行工具
date: 2023-11-21
tags: [Rust]
---

Rust 作为一门系统级语言，在命令行工具的开发上有着天然的优势。于是就在 Github 的 Rust topic 下找到了一些有意思的项目，并通过 [scoop](https://scoop.sh) 安装到了 Windows 上

这些工具通常都是系统自带软件的替代品，它们都使用 Rust 来重写，更现代、更快、更好用 😍，特别是 git 等的支持

### bat

[sharkdp/bat](https://github.com/sharkdp/bat) 是一个 cat 的替代品，它的特点是语法高亮和 Git 集成

下载：`scoop install main/bat`

### eza

[eza-community/eza](https://github.com/eza-community/eza) 是一个 ls 的替代品，有更好看的输出、gitignore 支持、更多的排序方式等特性。这是我的一个配置

```powershell
function lss {
  eza -lnhaa --git-ignore --time-style "+%m-%d %H:%m" --no-quotes --sort type $args
}
```

下载：`scoop install main/eza`

![图片描述](/blog/rustify_eza.webp)

### zoxide

[ajeetdsouza/zoxide](https://github.com/ajeetdsouza/zoxide) 是一个 cd 的替代品，它会记录你的 cd 历史，然后根据你的输入进行模糊匹配。可以把 cd alias 到它：`New-Alias Set-LocationWithFnm z`

下载：`scoop install main/zoxide`

### fd

[sharkdp/fd](https://github.com/sharkdp/fd) 。fd 是 find 的快速且用户友好的替代方案，find 是 Unix/Linux 中用于遍历文件层次结构的内置命令行程序。 fd 为最常见的用例提供固执己见的默认值。要按名称查找特定文件，请编写 fd PATTERN 而不是 `find -iname ‘*PATTERN*’` 。 fd 也非常快，并且它带有大量选项，例如默认忽略 .gitignore 中的隐藏目录、文件和模式

下载：`scoop install main/fd`

### starship

[starship/starship](https://github.com/starship/starship) 是一个适用于任何 shell 的快速、高度可定制的提示符。它的特点是快速、可定制、跨 shell、跨平台、内置模块化、多语言支持、高度可定制、支持所有主流的 shell。这是我的一个配置，在 `~/.config/starship.toml` [gist](https://gist.github.com/Chilfish/ddd52f779d87c648374178b6c341bd55)。同时需要安装额外的字体：[meslo-lg](https://www.fontmirror.com/meslo-lg)

下载：`scoop install main/starship`

### ripgrep

[BurntSushi/ripgrep](https://github.com/BurntSushi/ripgrep) 是一个面向行的搜索工具，它递归地搜索当前目录中的正则表达式模式。默认情况下，ripgrep 将遵守 gitignore 规则并自动跳过隐藏文件/目录和二进制文件

下载：`scoop install main/ripgrep`

### fnm

[Schniz/fnm](https://github.com/Schniz/fnm) 是一个更好用的 node 版本管理器，可以随意地下载、切换 node 的版本

### tokei

[XAMPPRocky/tokei](https://github.com/XAMPPRocky/tokei) 是一个非常强非续快的代码行数统计工具，默认通过 gitignore 来排除文件，基本支持所有主流的语言，甚至连 Vue、markdown 的内嵌语言都统计了

下载：`scoop install main/tokei`

![](/blog/rustify_tokei.webp)

### nushell

[nushell/nushell](https://github.com/nushell/nushell) 是一个现代的 shell，它使用 Rust 编写，具有友好的语法和强大的自动补全功能。它使用 nu 语言来作为其脚本语言，它是一种数据导向的 shell，它的语法类似于 SQL，但是它的数据类型是动态的，并完全地支持管道和函数式编程。更多详见其文档

下载：`scoop install main/nushell`

### miniserver

[svenstaro/miniserve](https://github.com/svenstaro/miniserve) 是一个通过 http(s) 启动文件服务器的工具，默认支持局域网访问、文件树、认证等功能，甚至能通过发起请求来上传文件（差个按钮）。可以抛弃 live-server 或是 vite 了）

下载：`scoop install main/miniserve`
