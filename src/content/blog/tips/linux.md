---
title: Tips for Linux
date: 2023-02-03
tags: [Linux]
---

> 建议熟记）：[国光：Web 狗的要懂的 Linux 基础知识](https://www.sqlsec.com/2019/10/linux.html)

[Getting Start](../../note/linux-start.md)

### Ubuntu 安装 NeoVim>=0.9

在 apt 中，即便使用了 PPA，下载下来的 neovim 依旧不是最新的版本，而是 `neovim/jammy 0.7.2-3~bpo22.04.1~ppa1 amd64` 类似这样的版本，但有些插件却要求 0.8 以上的版本……

于是就可以通过 [NeoVim releases] 来安装它的可执行文件，并复制到环境变量文件夹下

```bash
wget https://github.com/neovim/neovim/releases/download/v0.9.4/nvim-linux64.tar.gz

tar -zxf nvim-linux64.tar.gz

sudo cp nvim-linux64/bin/nvim /usr/local/bin
```

[NeoVim releases]: https://github.com/neovim/neovim/releases

### yum 升级 Git 至 2.4 版本

好像阿里云的 `Alibaba Cloud Linux 2.1903 LTS 64位` 服务器的 yum 下载 git 总是只能更新到 1.8 版本...... 于是就翻到了这个

先安装依赖包

```bash
yum -y install zlib-devel curl-devel openssl-devel perl cpio expat-devel gettext-devel openssl zlib autoconf tk perl-ExtUtils-MakeMaker
```

然后下载 Git 源码

在 [Github releases](https://github.com/git/git/releases) 中找到最新的源码

```bash
wget https://github.com/git/git/archive/v2.4.0.tar.gz

tar zxvf v2.4.0.tar.gz && cd v2.4.0.tar.gz
```

编译安装

建议一步一步来，好 error 时定位错误

```bash
autoconf
./configure

make
make install
```

然后加到环境里

```bash
vim /etc/ld.so.conf

# 最后一行加上：
/usr/local/lib
```

保存退出后查看 `git --version`
