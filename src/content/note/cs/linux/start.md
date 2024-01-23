---
title: Ubuntu - get start
date: 2023-04-05
tags: [Linux]
---

> 从未如此混乱的 Ubuntu 开局......

这里以一个比较干净的 Ubuntu 来举例

### sshd

> 更多可见 [ssh](../software/ssh.md)

第一步肯定得先连接上 ssh。先安装先决软件：

```bash
sudo apt install -y openssh-server vim --fix-missing
```

> 没 sudo 的话，可能得先安装 sudo `apt install sudo`

设置配置之前得先备份

```bash
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak

# 更改
sudo vim /etc/ssh/sshd_config
```

添加或更改

```bash
# 或者别的端口，其实这段配置并不是必须的
Port 2222
PermitRootLogin yes
PasswordAuthentication yes
AllowUsers *
```

然后重启 sshd 服务

```bash
sudo service sshd restart
```

生成密钥，并添加到 sshd 中

```bash
ssh-keygen -t rsa -C "your@email.com"

ssh-agent bash
ssh-add ~/.ssh/id_rsa
```

这样就能在电脑上用 ssh 连接了，忘记密码可以： `passwd` 设置

当然，也能直接将客户端的公钥添加到服务器的 authorized_keys 中，这样就能免密登录了

### 换源

清华源：https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/

而如果是 arm64 的话，用的是 ubuntu-ports

先备份~

```bash
cp /etc/apt/sources.list /etc/apt/sources.list.bak

vim /etc/apt/sources.list

sudo apt update -y && sudo apt upgrade
```

### 常用软件

```bash
sudo apt install -y net-tools screenfetch git curl wget tree unzip
```

### 换用 zsh 及 oh-my-zsh

sh（Z Shell）是一种流行的 Unix shell 程序，它是 bash 和 tcsh 的改进版本。它包含了许多功能和命令，使得命令行更加易用和高效

Zsh 提供了许多功能，包括自动补全、历史记录、别名、函数、插件、主题等。它的自动补全功能非常强大，可以自动完成文件名、命令、选项和参数等，大大提高了工作效率。历史记录功能可以让你轻松地搜索和运行以前的命令。别名和函数功能可以让你自定义命令，使得命令行更加灵活

Zsh 还支持插件和主题，可以让你轻松地扩展和定制你的 shell 环境。你可以选择不同的主题来改变命令行的外观和感觉，也可以安装各种插件来增强功能

**安装 oh-my-zsh**：oh-my-zsh 是一个强大的 zsh 管理框架，它包括了许多有用的插件和主题。安装 oh-my-zsh 可以通过运行以下命令来完成：

```bash
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

**安装 zsh-autosuggestions 插件**：zsh-autosuggestions 是一个 zsh 补全插件，它可以根据您之前输入的命令自动补全命令

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions
```

**安装 zsh-syntax-highlighting 插件**：zsh-syntax-highlighting 是一个 zsh 插件，它可以根据您的输入语法高亮显示命令

```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting
```

**启用插件和主题**：

```bash
vim ~/.zshrc

ZSH_THEME="amuse"
plugins=(git bundler rails zsh-autosuggestions zsh-syntax-highlighting)
```

**重新启动终端**：完成上述步骤后，需要重新启动终端以使更改生效

更多配置可见 [antfu's .zshrc](https://github.com/antfu/dotfiles/blob/main/.zshrc)

### 或者是 fish shell

感觉开箱就带一堆功能的 fish 会更好一些，除了它和 bash 有很多不兼容的地方，有些软件要下 fish 特供版

> 所以基于这点，还是配置 zsh 好了，至少在使用别人脚本上没那么麻烦

```bash
apt install fish
```

然后可以用 `which fish` 来查看 fish 的位置，一般来说是在 `/usr/bin/fish`，就可以更换默认终端：

```bash
chsh -s /usr/bin/fish
```

接着就是主题了，也是叫 [oh-my-fish](https://github.com/oh-my-fish/oh-my-fish)

```bash
curl https://raw.githubusercontent.com/oh-my-fish/oh-my-fish/master/bin/install | fish
```

## 开发工具、环境

### c++

先安装构建工具、默认的 gcc

```bash
sudo apt install build-essential gcc g++ gdb
```

然后再下载 gcc/g++11：

```bash
sudo apt install gcc-11 g++-11
```

等超级久之后，将默认的 gcc/g++换成 11 的：

```bash
# 命令最后的 1和10是优先级，如果使用auto选择模式，系统将默认使用优先级高的
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-9 1
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-11 10

sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-9 1 sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-11 10
```

### Nodejs

用 Node 版本管理器 [fnm](https://github.com/Schniz/fnm) 来安装各版本的 Node

```bash
curl -fsSL https://fnm.vercel.app/install | bash
```

输入 `fnm -V` 输出版本号则安装成功。下载 Node：

```bash
fnm install --lts
```

等超久且没进度条后，输入 `node -v` 有输出版本号则安装成功

然后第一件事就是安装 pnpm 了） `npm install -g pnpm`

> 在 Win 下安装，可以先下 [fnm.exe](https://github.com/Schniz/fnm/releases)，并放到环境变量中，下载 node 步骤是一样的

> 但有个问题是 `node -v` 不起作用，因为 node 不在环境变量中，需要去 Powershell 的配置文件 `~\Documents\PowerShell\Microsoft.PowerShell_profile.ps1` 中添加一句 `fnm env --use-on-cd | Out-String | Invoke-Expression` 就好了
