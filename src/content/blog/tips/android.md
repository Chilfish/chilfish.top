---
title: Tips for Android
date: 2023-02-03
tags: [Termux, Android]
---

## Termux

**主要参考：** [国光：Termux 高级终端安装使用配置教程](https://www.sqlsec.com/2018/05/termux.html)

### 初始化

先换源

```bash
sed -i 's@^\(deb.*stable main\)$@#\1\ndeb https://mirrors.tuna.tsinghua.edu.cn/termux/termux-packages-24 stable main@' $PREFIX/etc/apt/sources.list

sed -i 's@^\(deb.*games stable\)$@#\1\ndeb https://mirrors.tuna.tsinghua.edu.cn/termux/game-packages-24 games stable@' $PREFIX/etc/apt/sources.list.d/game.list

sed -i 's@^\(deb.*science stable\)$@#\1\ndeb https://mirrors.tuna.tsinghua.edu.cn/termux/science-packages-24 science stable@' $PREFIX/etc/apt/sources.list.d/science.list

pkg update
```

然后使用 ssh 让电脑连接，不然操作起来太不舒服了（或者外接键鼠也行 hhh）

```bash
pkg install openssh -y

ssh-keygen -A

sshd
```

和电脑一个局域网，可以用 `ifconfig` 查看 ip，用 `whoami` 查看用户名，用 `passwd` 修改密码）在手机 root 之前是没有 sudo root 权限的

在电脑终端上就可以用 ssh 连接上 termux 了，注意它的端口是 8022。连上之后，就大致地和 Linux 差不多了，不同的是 `/usr/local/bin` 对应的是 `$PREFIX` 或是 `/data/data/com.termux/files/usr/bin`

然后就是装上一堆工具了，fish，git 什么的......

包管理用的是 pkg：

```bash
pkg search <query>              # 搜索包
pkg install <package>           # 安装包
pkg uninstall <package>         # 卸载包
pkg reinstall <package>         # 重新安装包
pkg update                      # 更新源
pkg upgrade                     # 升级软件包
pkg list-all                    # 列出可供安装的所有包
pkg list-installed              # 列出已经安装的包
pkg show <package>              # 显示某个包的详细信息
pkg files <package>             # 显示某个包的相关文件夹路径
```

### 和一般 Linux 一些不同的地方

### 安装 Ubuntu

虽然有些套娃，但还是可行的：

```bash
pkg install proot-distro
proot-distro install ubuntu
proot-distro login ubuntu
```

这样就能在 termux 里跑 Ubuntu 了...但这样模拟器里套模拟器，还不如下面的这个，直接装 Ubuntu

## 更好的 userLAnd

现在 Google Play 上下载 [UserLAnd](https://play.google.com/store/apps/details?id=tech.ula)，点进去后选 Ubuntu 的终端就行了

这时它会先验证然后下载 Ubuntu，其中一定得网络状态稳定，不然一直报错 hh。目前装的是 Ubuntu22.04，但好像特别空，很多软件都没

这个的好处是，可以在 unroot 的情况直接使用 sudo，当然涉及到得 root 才能更改的系统设置是牡蛎的

但 **需要注意的是**，初次需要联网验证，但有时梯子也完全不行，需要自定义它验证的地址：

- 右上角菜单 -> settings -> 勾选 Use Custom URL for Apps Server
- 网址填上国内镜像 https://gitee.com/play-code/UserLAnd-Assets-Support/raw/staging/assets/arm64/assets.txt

下面导航栏中，Sessions 代表会话，新开一个终端就是一个会话，File systems 就是系统实体

开始时，选上 Ubuntu -> Minimal -> Terminal 就行了

然后就是设置 UBuntu 了，具体的 [Getting Start](../../note/cs/linux/start.md)

### 一些坑点

并不能在 Ubuntu 里用 passwd 修改密码，因为它是用默认密码来 ssh 连接的。默认密码在 File systems，长按实体 -> Edit，里面就是只读的密码了......

而且，既然是 ssh 到 localhost 的，那 `cat .ssh/id_rsa.pub >> .ssh/authorized_keys` 不就好了嘛......但实际上还是不行，所以在这里是 **完全不能修改密码** 的）而且改过之后，似乎就只能随缘进去了，而且 ssh 的密码还是默认密码

绕开它联网验证的方式就是先断网打开 Session 后，就能进到它的终端了，这时再开网络（木梯似乎很随缘，所以还是断网登录吧）

如果进不去终端，则可以通过另外 ssh 的方式，在 termux 中

```bash
# 它默认启动的端口是 2022，与 sshd 的端口设置是不冲突的
ssh userland@localhost -p 2022
```

输入它的默认密码后，再将 Termux 的 key.pub 复制到它的 authorized_keys 中，就能直接连接了

> 其中好像有时会连接假死，需要 ctrl+D 来唤醒它
