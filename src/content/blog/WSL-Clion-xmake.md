---
title: 在 Clion 上连接 WSL2 并使用 XMake 开发 C++
date: 2023-02-01 11:19:00
tags: [WSL, C++]
---

## 开始

用了太多 JB 家的产品，想着在学生优惠的期限内~~都用个遍~~，那在 C++中它正好有 [Clion](https://www.jetbrains.com/clion/download/)，而且还用不习惯 MS 的 VS，VSCode 写项目又有点轻，那就 Clion 用着试试吧

如果想编译在 Linux 环境的话，WSL 是 win 用户的一大选择

一些版本：Clion：`2022.3.2`、WSL2：` Ubuntu 20.4`、gcc：`v11.1.0 on Ubuntu`、XMake：`v2.7.5`

> 肯定错漏百出）之后再改了

### 将 WSL 作为工具链

只要在设置 -> 构建 -> 工具链 -> +号新建中选择 WSL，它就会自动检测到 WSL 的发行版等配置 (在这之前要去 WSL 先安装好 C++工具链 (g++,gdb,cmake 这些的)

![自动检测到WSL环境](/blog/Cion_WSL.webp)

### 安装 XMake

[XMake.io](https://XMake.io/#/zh-cn/) 主要用于 C/C++ 的项目配置，还有自带的[包管理](https://xrepo.XMake.io/#/zh-cn/getting_started)。它不用写繁琐的 cmake 配置，虽然是 `XMake.lua` 作为配置文件，但没多少 lua 的语法，它还能生成 `CMakeLists.txt` 来兼容和 IDE 适配

XMake 可以只需安装在 win 上，在 [Github releases](https://github.com/XMake-io/XMake/releases) 可找到安装包，或用 scoop：`scoop install XMake`）如果不用 scoop 的话，还需要将 XMake 的目录放进环境变量中

然后需要在 Clion 上下载插件：XMake，就可以在新建 Clion 项目中看到 XMake 了

### 新建 XMake 项目

在新建项目之前，要先指定 XMake 的目录

![选添加 XMake JDK](/blog/Cion_XMake_jdk.webp)

![选中 XMake 目录](/blog/Cion_XMake_jdk1.webp)

### 项目结构

`XMake.lua` 是 XMake 的配置文件，`src/main.cpp` 是项目的入口文件。这时候 Clion 需要 `CMakeLists.txt` 才能配置项目，而 XMake 正好能生成 CMakeLists，在工具栏的 `XMake -> Update CMakeLists`

![装了 XMake 插件就能在工具栏看到](/blog/Cion_XMake_options.webp)

但通常此时去生成或构建会报错：

```bash
> xmake project -k cmake -y
checking for platform ... windows
checking for architecture ... x64
checking for Microsoft Visual Studio (x64) version ... no
error: target(untitled): toolchain not found!
```

没找到工具链，而且生成平台也是检测到的 Win。这时就要去终端手动指定成 Linux 平台：

```bash
xmake f -p linux -a x86_64 -m debug
```

这时再生成或构建项目时，就能看到 ok 了 (这里的 MS VS 不是必须的)

```bash
xmake project -k cmake -y
checking for Microsoft Visual Studio (x86_64) version ... no
create ok!

进程已结束,退出代码0
```

回到 `src/main.cpp`，Clion 会提示选择 `CMakeLists.txt`，只要选上刚生成的就行了，并打开 CmakeLists 选上**自动重新加载 CMake 项目**，这样每当 CMakeLists 有变化时都会自动加载上

## 铛铛~

### 运行项目

这里有两种方式去运行，一是直接运行 Clion 根据 CMake 生成的运行配置 (运行键)。在它的构建输出可以看到：

```bash
====================[ 构建 | untitled | Debug ]===================================
C:\WINDOWS\system32\wsl.exe --distribution Ubuntu-20.04 --exec /usr/bin/fish -c "export CLION_IDE=TRUE && export CLICOLOR_FORCE=1 && export TERM=xterm && export GCC_COLORS='error=01;31:warning=01;35:note=01;36:caret=01;32:locus=01:quote=01' && export JETBRAINS_IDE=TRUE && cd /mnt/c/Users/username/Desktop/untitled/cmake-build-debug && /usr/bin/cmake --build /mnt/c/Users/username/Desktop/untitled/cmake-build-debug --target untitled -- -j 12"
Scanning dependencies of target untitled
[ 50%] Building CXX object CMakeFiles/untitled.dir/src/main.cpp.o
[100%] Linking CXX executable ../build/linux/x86_64/debug/untitled
[100%] Built target untitled

构建 已完成
```

已经正确地用 WSL 来生成出 Linux 可执行文件了，可以在终端验证：

```powershell
> wsl /mnt/c/Users/username/Desktop/untitled/build/linux/x86_64/debug/untitled

hello world!
```

或是用 XMake 的构建运行。需要先 `XMake -> Build Project`，然后在 Clion 的 `运行/调试 配置` 中新建一个运行配置，选上 XMake 即可）但好像连上 WSL 的 XMake 运行会报错

### 运行单文件

为了保证运行单文件时头文件能正确引用上，需要在 CMakeLists 里添加上 `add_executable(xxx src/test/xxx.cpp)`，然后运行在 main 函数旁的三角按钮：运行 xxx

或者下载 CLion 插件 `C/C++ single file execution`，在 cpp 文件中右键，选上最后一行的 `add executable for single C++ file`，它就会自动把这个文件添加到 CMakeList 里

### 添加库、头文件

例如我要写的头文件在 `src/include`，那就加上 `add_includedirs(dir)`

```lua
set_toolchains("gcc")
add_rules("mode.debug", "mode.release")
add_includedirs("src/include")

target("DS_algo")
    set_kind("binary")
    add_files("src/*.cpp")
```

> Lua 是不讲缩进分级的，这里主要是写给人看，更好地标注

添加第三方库则是：`xrepo install xxx`

这点在纯 Win 上的话会因为没检测到工具链报错：

```bash
error: checking for platform ... windows
checking for architecture ... x64
checking for Microsoft Visual Studio (x64) version ... no
error: target(working): toolchain not found!
```

### More

但其实在编译 win 上的话，可以用 Mingw 来构建。需要先指定平台：

```bash
# 需要先指定 mingw 的位置，这里用全局配置就好
xmake g --mingw="D:/path/to/mingw64"

xmake f -p mingw
xmake
```

但在 `xrepo` 上，要另外加个参数指定平台，不然它还是会用检测到的默认 Win 平台

```bash
# 或是其他的操作，都带上 -p
xrepo install -p mingw xxx
```

差不多单写就这些了，更多其他的还没学到）还得是看文档
