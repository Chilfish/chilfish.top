---
title: WSL2 与使用 VSCode 来远程连接 Ubuntu
date: 2023-01-15 20:54:23
tags: [Linux, WSL]
---

> 可能存在过期的信息，例如版本以及指令等

## 为什么？

总觉得有必要玩玩 Linux (~~跟风学习~~)，感受下魅力）其实就算是个必经之路吧，反正安卓、Web 服务器什么的，总是要和 Linux 相关的打交道。再者，WSL2 的出现让 Windows 不用再装虚拟机也能体验 Linux 的大部分功能，而且在目前的阶段也是足够够用了

坑还算挺多的）主要参考的是[可能是市面上最详尽的中文 WSL 开发环境配置指南](https://dowww.spencerwoo.com/)

## 开始

### 首先是 Windows 版本

只有 Windows 10 版本 16215 或以后的版本才能够正常运行 WSL

**只有 Windows 10 版本 18362 或 18363 以及以后的版本，或小版本号为 1049 的版本，才能够正常运行 WSL 2。**需要明确，WSL 2 目前只能在 Windows 10 版本 1903、1909 和 2004 中使用 (其中 1903 和 1909 仅支持 x64 系统)

### 开启虚拟化及 “适用于 Linux 的 Windows 子系统”

按 **Win + S** 快捷键打开搜索，输入 “启动或关闭 Windows 功能” 并打开。建议把下图的功能都打开，等待完成后按提示重启电脑

![打开 WSL 功能及虚拟机](/blog/WSL_Start.webp)

### 安装 WSL2

关于搭载的 Linux 版本，我选的是 **Ubuntu 20.04 LTS**

**但在这之前**，如果想要使用 WSL2 的话，要先执行一段命令：先用管理员身份打开 `PowerShell` 终端，输入：

```shell
wsl --set-default-version 2
```

这样之后安装的 Linux 发行版都是由 WSL2 支持的

如果事先安装过了 Ubuntu 的 WSL1 版本，则：

```shell
wsl --set-version Ubuntu-20.04 2
```

> 墙裂先把终端换成 [Windows Terminal](https://github.com/microsoft/terminal/releases/tag/v1.15.3465.0)，也可以从[微软应用商店](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701)上安装。速度最快的话还得是用 GitHub 下载加速或是把 release 链接放到 Bt 软件 (如比特彗星) 下载

同时，在使用 WSL2 后，安装 Linux 之前得先启动 Hyper-v，管理员终端启动：

```shell
bcdedit /set hypervisorlaunchtype auto
```

#### 直接安装 Ubuntu 20.04

可以直接从[微软应用商店](https://apps.microsoft.com/store/detail/ubuntu-2004/9N6SVWS3RX71)上搜索下载，但就只能安装在 C 盘了

#### 安装到任意盘

如果想自定义安装的盘符，可以到 [Ubuntu_2004.appx](https://wsldownload.azureedge.net/Ubuntu_2004.2020.424.0_x64.appx) 上下载压缩包 (建议用 bt 软件下载会更快些)

如果安装在 D 盘，建议先新建一个文件夹，如 `Linux`，将下载的 `Ubuntu_2004.2020.424.0_x64.appx` 解压到该目录下。接着在解压后的目录打开终端 (如果安装了 Windows Terminal，可以右键->“打开于终端”)，执行 `./ubuntu2004.exe`

此时它会在该目录下安装 Ubuntu，等待安装完毕后输入用户名和密码

> 如果此时报错：参考的对象类型不支持尝试的操作，则需要先下载 [NoLsp.exe](https://files.cnblogs.com/files/turingguo/NoLsp.zip)，解压后使用管理员终端运行 `.\NoLsp.exe C:\Windows\System32\wsl.exe` 显示 success 则操作成功，再打开 wsl2 就可以了
>
> ref：[WSL2 解决参考的对象类型不支持尝试的操作](https://www.cnblogs.com/turingguo/p/15718048.html)

最后在终端输入

```shell
wsl -l -v
```

便输出：(VERSION 表示的是 WSL 版本)

```shell
  NAME            STATE      VERSION
* Ubuntu-20.04    Stopped    2
```

## 启动！

安装完毕后，重启 Windows Terminal，在菜单栏的更多里就可以看到 Ubuntu 终端的选项了

![好诶](/blog/WSL_Terminal.webp)

### Ubuntu 与 Win 的文件可以互相访问

用了 WSL 后，Ubuntu 与 Win 可以说是互联的

- 在 Win 上，Ubuntu 文件的位置在：`\\wsl.localhost\Ubuntu-20.04` (在文件资源管理器的路径中输入或终端 cd 过去)
- 在 Ubuntu 上，Win 盘符的位置在：`/mnt`，可以看到 c、d 等盘

两者可以直接访问各自的文件，也能直接运行。也就是说，甚至可以在 PowerShell 中运行 WSL2 的指令：

```bash
wsl hostname
```

## 配置

> 或者 [Ubuntu-start](../note/linux-start.md#sshd)

### SSH

为了能够远程访问 WSL，当然得配置下 SSH 啦。先重装自带的 SSH：

```bash
sudo apt purge openssh-server
sudo apt install openssh-server
```

要远程连到 wsl2 要折腾一些设置，尤其是[网络问题](#wsl-与-局域网)，需要先设置端口映射。例如将 0.0.0.0:322 映射到 wsl:22，这样就能通过连接 win 的 ip、322 端口来访问了

但我尝试先 ssh 连接到 win，在启动 wsl，这似乎并不起效，即便是管理员登录

> 新版更新：现在只需要 ssh 过后在 powershell 运行 `& 'C:\Program Files\WSL\wsl.exe'` 即可打开 wsl

### 连上 VSCode

在 VSCode 中安装插件：`Remote Development`，点开左下角的 “管理” -> “命令面板”，输入 `WSL: new WSL Window` 后，等待下载完成后就会自动连接上 WSL 了

然后有些插件是 Linux 专用版，需要单独下载 (会有个安装到 WSL 的选项)(其实所有的远程连接都差不多这样

## 一些常见的问题

> 在 WSL 2.0.9 与 Windows 11 23H2 之后的版本，可以通过配置来让 WSL 的网络环境与 win 本地完全相同。详见[文档 mirrored-mode-networking](https://learn.microsoft.com/en-us/windows/wsl/networking#mirrored-mode-networking)
> 这样完全不用配置 hosts 和端口转发了，因为 WSL 的 ip 就是 win 的 localhost

### WSL2 的 localhost 与 win 本机不通

到任务管理器可以的看到，WSL 自带了 Hyper-V 虚拟机的一个虚拟网卡，此时在 WSL2 启动的 localhost 服务与 win 并不互通

```bash
> curl http://localhost:3000
curl: (7) Failed to connect to localhost port 3000: Connection refused
```

无论是谁发起的服务，另一方都接收不到，只能是通过 win 的 ip 或 WSL 的 ip 而不是 localhost。于是就只能手动端口转发了或是直接固定 WSL 的 ip，并通过 Host 来 DNS

可以新建一个 ps1 脚本，然后加到计划任务中 (`$WSLName` 由安装的 Linux 发行版决定：`wsl -l -v` 可查看)

```powershell
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
  $arguments = "& '" +$myinvocation.mycommand.definition + "'"
  Start-Process powershell -Verb runAs -ArgumentList $arguments
  Break
}

$WSLName = Ubuntu-20.04
wsl -d $WSLName -u root ip addr add 192.168.50.16/24 broadcast 192.168.50.255 dev eth0 label eth0:1

netsh interface ip add address "vEthernet (WSL)" 192.168.50.88 255.255.255.0
```

其实就是先为 WSL 添加一个路由 ip，再在 win 中为 WSL 的虚拟网卡添加 ip。这样下来，win 访问 WSL 就是 `192.168.50.16`，WSL 访问 win 就是 `192.168.50.88` (具体的 IP 的话可以自定，只要在子网段里就行

然后是为各自添加 Host：

```bash
# win: C:\Windows\System32\drivers\etc\hosts
192.168.50.16 wsl

# WSL: /etc/hosts
192.168.50.88 win
```

试了一下，都可以各自 ping 得通诶

### WSL 与局域网的端口转发

既然都能连到 Win 了，那顺便让局域网也能连上吧。这就需要用上端口转发了，将局域网内对端口的请求转发到 WSL 里。于是参照着写了下脚本 (需要管理员)

```powershell
# 需要管理员终端
# 或者别的要转发的端口
$from = 322
$to = 22

$wslip = wsl -- ip -o -4 -json addr list eth0 `
| ConvertFrom-Json `
| %{ $_.addr_info.local } `
| ?{ $_ }

netsh interface portproxy add v4tov4 listenport=$from listenaddress=0.0.0.0 connectport=$to connectaddress=$wslip
```

这样，就能通过访问 win:322 来连接到 wsl:22 了

查看转发的状态：

```bash
netsh interface portproxy show all
```

删除转发的端口：

```bash
netsh interface portproxy delete v4tov4 listenport=$port listenaddress=0.0.0.0
```

## 参考

- [wsl 2 设置静态 DNS 服务地址及 Linux 和 Windows 主机网络互相访问设置](https://blog.niekun.net/archives/1801.html)
