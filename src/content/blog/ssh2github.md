---
title: 用 SSH 推拉 GitHub 并实现多账户切换
date: 2023-01-13 21:01:00
tags: [Git, SSH]
---

## 为什么要 SSH

一开始使用 git 时是在 VSCode 上集成的，初次 push 时填好 github 账号密码之后，之后都不用填密码了。但网上都说用 HTTPS clone 的仓库推拉的时候都要输入密码，原来是有一个配置

```bash
git config --global credential.helper store
```

IDE 已经帮忙把账号密码存在全局了，而且设置的用户名和邮箱也是全局的，所以就 “新手友好” 多了

而 SSH 协议在初次配置好之后，前后都不用输入账号密码，也还能保证数据的安全。这倒没什么，主要是我想用两个 GitHub 账号来练习一下，两个不同的邮箱注册。但这时问题就在，开始时我都把账号信息设全局了，这要怎么以另一个 git 身份来推拉呢……？

正好看到[在一台电脑上同时使用多个 github 账号](https://blog.csdn.net/qq_43199318/article/details/103469792)中使用到了 SSH，于是就跟着设置好了，还顺便升级了下 git 版本）

> 更详细的说明可见 [SSH](../note/ssh.md)
> 以下终端 windows 下要在 Git Bash 的命令窗口下执行 (或是 powershell

## 设置 SSH

### 取消全局设置

先删除掉之前的配置：

```bash
git config --global --unset user.name
git config --global --unset user.email
```

也可以直接去配置文件 `C:\Users\{name}\.gitconfig` 或是在 `~/.gitconfig` 中删除掉

```bash
[user]
    name = xxx
    email = xxx@gmail.com
```

### 创建新的 ssh 密钥

```bash
cd ~/.ssh
ssh-keygen -t rsa -C "your@email.com" -f "~/.ssh/name"
```

这时终端会停在 `Enter passphrase (empty for no passphrase):`，这里只要选默认的回车就好。最后终端会输出：

```bash
Generating public/private rsa key pair.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in test
Your public key has been saved in name.pub
The key fingerprint is:
SHA256:IftSUT3kqF/vLRyOs0mJ9GPg+Eas9eikdTuYAC7OWXs your@email.com
The key's randomart image is:
+---[RSA 3072]----+
|          .o.    |
|         . oo    |
|      . o . ..   |
|      .o +       |
|     ...S.o .    |
|    . oo.=+= o.  |
|   o +..o=*=B+.. |
|    + ..E==+==+. |
|       ..oo ++...|
+----[SHA256]-----+
```

表示密钥生成成功。这时在 `~/.ssh/` 下会看到两个文件：`name` 表示生成的私钥，`name.pub` 表示生成的公钥

### 添加私钥到 ssh 中

打开 ssh-agent

```bash
ssh-agent -s
```

此时一般会输出类似如下的：

```bash
SSH_AUTH_SOCK=/tmp/ssh-C00BbFpAjnb2/agent.3204; export SSH_AUTH_SOCK;
SSH_AGENT_PID=3205; export SSH_AGENT_PID;
echo Agent pid 3205;
```

然后是添加私钥到账户中：

```bash
ssh-add ~/.ssh/name
```

此时会输出：

```bash
Identity added: /c/Users/user/.ssh/name (your@email.com)
```

### 将公钥添加到 GitHub 账户

首先先复制公钥 `name.pub` 的内容，不能有多余的字符

然后打开 GitHub：

- 右上角下拉面板选择 Settings
- 左侧选择 SSH and GPG keys
- 点击 New SSH key
- 随便起一个 title
- 把公钥粘贴到下面

基本就大功告成了~

### 测试与 github 的 ssh 连接

终端输入：

```bash
ssh -T git@github.com
```

首次连接需要用户确认：

```bash
The authenticity of host 'github.com (20.205.243.166)' can't be established.
ECDSA key fingerprint is SHA256:p2QAMXNIC1TJYWeIOttrVc98/R1BUFWu3/LiyKgUfQM.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

输入 yes 就好：

```bash
Hi name! You've successfully authenticated, but GitHub does not provide shell access.
```

如果 name 是你的 github 用户名，就说明连接成功了

其中，有可能会报 [Connection reset by 192.30.255.112 port 22](https://stackoverflow.com/questions/15589682/ssh-connect-to-host-github-com-port-22-connection-timed-out)，这时需要在 `~/.ssh/` 下新建 `config` 文件并编辑：

```bash
Host github.com
  HostName ssh.github.com
  IdentityFile ~/.ssh/id_rsa # 对应私钥的位置
  Port 443
```

### 更改仓库的远程连接方式

到 github 仓库的 clone 选项中选中 ssh 链接并复制，终端 cd 到本地仓库：

```bash
git remote set-url origin git@github.com:<user>/<repo>.git
```

然后检查 git 的远程仓库：

```bash
git remote -v
```

如果是：就大成功

```bash
origin git@<user>/<repo>.git (fetch)
origin git@<user>/<repo>.git (push)
```

## 设置多用户

### git 多用户配置

其实就重复生成密钥到把公钥添加到各自的 github 仓库的步骤，注意密钥名称得不重复

然后是重点：在 `~/.ssh/` 下新建 `config` 文件并编辑：

```bash
# 第一个
Host one.github.com
  HostName ssh.github.com
  IdentityFile ~/.ssh/id_rsa_one # 对应私钥的位置
  Port 443

# 第二个
Host two.github.com # 前缀名可以任意设置
  HostName ssh.github.com
  IdentityFile ~/.ssh/id_rsa_two
  Port 443
```

这样，连接的时候就要指定用户：

```bash
ssh –T git@one.github.com
ssh –T git@two.github.com
```

回复分别是 ID1 和 ID2 的 github 名，就表示连接成功了

clone 仓库就变成了：

```bash
git clone git@one.github.com:<user>/<repo>.git
```

### 设置多用户 git 仓库的 name 和 email

虽然可以每次都在仓库下

```bash
git config user.name  ID1
git config user.email E1
```

但这也太不优雅了，于是有一个开源的 npm 包：[git 多用户切换设置 gum](https://github.com/gauseen/gum)。前提得先装了 Node.js）或许有别的可以代替，那再找找看吧

```shell
pnpm i -g @gauseen/gum
```

然后添加用户：

```shell
gum set User1 --name "user1" --email "email1"
```

这样的。切换用户时，在仓库下执行：

```bash
gum use User1
```

> 更多详见 [Gum#RADME](https://github.com/gauseen/gum#index)
