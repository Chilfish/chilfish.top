---
title: SSH
date: 2023-04-05
tags: [note, SSH]
---

### SSH

SSH（Secure Shell）是一种协议，使用公钥密码学允许在网络上安全远程登录计算机。SSH 客户端程序（例如 OpenSSH 中的 ssh）通常在远程登录会话期间运行，并配置为查找用户主目录中的文件中的用户私钥（例如 `~/.ssh/id_rsa`）

为了增加安全性（例如，防止攻击者读取本地文件系统上的任何文件），通常将私钥以加密形式存储，在这种情况下，加密密钥是从用户记忆的口令计算出来。因为输入口令可能很繁琐，所以许多用户希望每个本地登录会话只需输入一次口令。存储未加密密钥最安全的位置是程序内存，在类 Unix 操作系统中，内存通常与进程相关联

通常 SSH 客户端进程不能用于存储未加密键，因为 SSH 客户端进程只持续远程登录会话期间。因此，用户运行一个名为 `ssh-agent` 的程序，在本地登录会话持续时间之外运行，并将未加密键存储在内存中，并使用 Unix 域套接字与 SSH 客户端进行通信

SSH 协议主要由两个部分组成：SSH 客户端和 SSH 服务器。SSH 客户端是一个工具，用于连接到 SSH 服务器并执行命令。SSH 服务器则是一个服务，用于接受来自 SSH 客户端的连接，并提供安全的远程访问

SSH 协议的主要特点和优点包括：

- 加密传输：SSH 使用加密技术来保护数据传输的安全性，防止数据被窃听、篡改或伪造

- 认证机制：SSH 提供了多种身份验证方式，包括密码、公钥、证书等，可以有效地防止非法访问

- 文件传输：SSH 可以用于安全地传输文件，支持 SCP 和 SFTP 协议

SSH 以**非对称加密**实现身份验证。身份验证有多种途径，例如其中一种方法是使用自动生成的公钥-私钥对来简单地加密网络连接，随后使用密码认证进行登录；另一种方法是人工生成一对公钥和私钥，通过生成的密钥进行认证，这样就可以在不输入密码的情况下登录

任何人都可以自行生成密钥。公钥需要放在待访问的电脑之中，而对应的私钥需要由用户自行保管。认证过程基于生成出来的私钥，但整个认证过程中私钥本身不会传输到网络中

### 开启 SSH

win 上默认开启了客户端，服务端要到 设置 -> 应用 -> 可选功能 -> 添加功能 -> 搜索 OpenSSH 服务器

Ubuntu 上则是 `apt install openssh-server`

### 开始

先以 Ubuntu 为例。配置文件在 `/etc/ssh/sshd_config`

```bash
# 指定 sshd 监听的端口号为 2222，而不是默认的 22 端口
Port 2222

# 允许 root 用户通过 ssh 登录到服务器
PermitRootLogin yes

# 允许使用密码进行身份验证，而不是仅使用 SSH 密钥
PasswordAuthentication yes

# 允许所有用户通过 ssh 登录到服务器
# 这个配置可能存在安全风险，建议更改为具体的用户名列表，以限制访问权限
AllowUsers *
```

然后重启服务

```bash
sudo service ssh restart
```

Win 10 同理，但配置文件在 `C:/ProgramData/ssh/sshd_config`，同时需要使用管理员权限的编辑器来编辑，也需要在 服务 中重启 OpenSSH Server

### 生成 key

其实有自带的 key，在 `/etc/ssh/ssh_host_rsa_key.pub` 和 `C:/ProgramData/ssh/ssh_host_rsa_key.pub` 下，以用户名@主机名的方式，并需要管理员权限才能查看。所以一般都应该是为当前用户生成一个 key

```bash
# 简单默认的方式：
ssh-keygen -t rsa
```

其中的参数如下

- -t：指定要创建的密钥类型，例如 rsa、dsa、ecdsa 等
- -b：指定密钥长度，例如 2048 位或 4096 位
- -C：添加注释，用于描述密钥，例如用户名或电子邮件地址
- -f：指定要创建的密钥文件的名称和路径
- -N：指定密钥密码，用于保护密钥文件
- -P：更改或删除密钥密码
- -i：将现有的公钥转换为 OpenSSH 格式并打印出来
- -y：将现有的私钥转换为 OpenSSH 格式并打印出来
- -q：启用静默模式，不输出任何错误或警告信息

其中要求输入的 passphrase 是指这个私钥的密码，直接回车以跳过

默认情况下是以 当前用户名@主机名 作为密钥的标识，并生成在 `~/ssh/`下，`id_rsa` 标识密钥，`id_rsa_pub` 表示公钥，通常要分享公布的也是公钥，密钥用于系统解密通信时被公钥加密的数据

### 连接服务器

一般情况下，这时候就能用 `ssh username@server -p 2222` 来连接对方了，一般 host 是指服务器的 ip 或域名

其中的一些参数

- -p：指定远程主机的端口号，默认为 22

- -i：指定私钥文件路径

- -l：指定登录用户名

- -X：开启 X11 转发，可以在远程主机上运行图形界面应用程序

- -v：显示详细的调试信息

- -N：仅进行连接，不启动远程 shell

- -C：开启压缩传输，可以加快传输速度

- -A：开启身份验证代理，可以在远程主机上再次进行身份验证

首次连接时候需要先登记客户端的公钥信息，yes 就好

```bash
The authenticity of host '[192.168.50.88]:2222' can't be established.
ECDSA key fingerprint is SHA256:giqj7wnJZt5eGEAz7JROlkw2b3qiseb5yvfPd0WEc0M.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

这时就需要输入服务器端这个用户的密码了。在 win 中，这个默认是微软账号的密码，如果是离线登录，则是 PIN 或者创建账号时设的密码

当然我们还是希望免密登录，这就需要将客户端的公钥完整地添加到服务器的 `~/.ssh/authenticity_keys` 中。可以直接复制过去，也能通过以下来以 ssh 的形式添加过去。然后再输入一次服务器用户的密码就行了，这样之后的每次连接都不用密码了

```bash
ssh-copy-id user@server
```

其中的一些参数

- -i：指定要复制的公钥文件，默认为 `~/.ssh/id_rsa.pub`
- -p：指定远程主机的 SSH 端口号，默认为 22
- -o：指定 ssh 选项，例如 `-o "ProxyCommand ssh user@proxyhost -W %h:%p"`
- -f：将公钥添加到远程主机的 authorized_keys 文件中时，不需要进行交互式确认，直接进行覆盖
- -n：将公钥添加到远程主机的 authorized_keys 文件中时，不要将用户名追加到文件的末尾

有一点是，如果服务器的默认终端是 fish shell 就会报错，语法不兼容...... 这时候就需要用 scp 来代替了

```bash
scp ~/.ssh/id_rsa.pub user@server:~/.ssh/authorized_keys
```

### authorized_keys && known_hosts

**authorized_keys** 是 SSH 协议中用于实现公钥身份验证的文件，存储在 SSH 服务器的用户目录下。在使用 SSH 连接到远程服务器时，如果 SSH 客户端提供的公钥与 authorized_keys 文件中的公钥匹配，则可以成功连接到服务器

也就是说，只要将客户端的公钥添加到服务器的 authorized_keys，就能免密登录服务器了。但前提是得有权限访问到服务器端并更改文件

为了保证安全性，可以将 authorized_keys 文件的权限设置为 600 或 644。这样，只有 SSH 服务器的用户可以读取 authorized_keys 文件中的公钥，提高了安全性

而 **known_hosts** 是 SSH 协议中用于存储已知主机公钥的文件。在使用 SSH 连接到远程主机时，SSH 客户端会将远程主机的公钥保存到 known_hosts 文件中。下次连接到同一主机时，SSH 客户端会比对本地保存的公钥和远程主机返回的公钥是否一致，如果不一致则会发出警告，提示可能存在安全问题

known_hosts 文件的作用是确保 SSH 客户端连接到正确的主机，并防止中间人攻击。中间人攻击是指攻击者在 SSH 连接过程中截获数据并伪造数据，使得 SSH 客户端连接到了攻击者控制的主机上，从而获取敏感信息

SSH 客户端连接到新的主机时，会提示用户是否接受该主机的公钥。如果用户确认该主机的公钥是正确的，则可以将公钥添加到 known_hosts 文件中，避免下次连接时再次提示

### ssh-agent

假设现在有两套密钥用于两台不同的主机，而 ssh 连接的时候如果不指定私钥的位置，由于有多套密钥，那它只能靠输入主机的密码来辨别身份（即便已经加入了 authorized_keys）。而连接的时候又指定私钥又太不优雅（当然可以在 config 中指定），所以就有了一个用于管理私钥的 ssh-agent

bash 下启用 ssh-agent

```bash
ssh-agent
```

然后添加 ssh key

```bash
ssh-add /path/to/key

# 输出
Identity added: .ssh/id_rsa (name@host)
```

这样，用 ssh 连接的时候就可以不用指定私钥不输密码了

可以通过 `ssh-add -l` 来列出已经添加的私钥的指纹信息

**还是 fish shell**，并不能启用 agent，需要将以下函数添加到 `~/.config/fish/functions/fish_ssh_agent.fish`

```bash
function fish_ssh_agent --description 'launch the ssh-agent and add the id_rsa identity'
    if begin
        set -q SSH_AGENT_PID
        and kill -0 $SSH_AGENT_PID
        and grep -q '^ssh-agent' /proc/$SSH_AGENT_PID/cmdline
    end
        echo "ssh-agent running on pid $SSH_AGENT_PID"
    else
        eval (command ssh-agent -c | sed 's/^setenv/set -Ux/')
    end
    set -l identity $HOME/.ssh/id_rsa
    set -l fingerprint (ssh-keygen -lf $identity | awk '{print $2}')
    ssh-add -l | grep -q $fingerprint
        or ssh-add $identity
end
```

然后就能用 `fish_ssh_agent` 来启用了（需要先 fish 重进 fish shell）

### ~\/.ssh\/config

这个文件用于连接时的配置

- Host：远程主机名或 IP 地址
- HostName：远程主机名或 IP 地址，与 Host 配置项作用相同，但可以在 ProxyCommand 中使用
- Port：SSH 连接的端口号
- User：SSH 连接的用户名
- IdentityFile：SSH 连接时使用的私钥文件路径
- ProxyCommand：通过代理服务器连接远程主机的命令
- ForwardAgent：是否开启 SSH Agent 转发功能
- ServerAliveInterval：SSH 连接保持活跃的时间间隔
- LogLevel：日志输出级别
- Compression：是否开启数据压缩
- ControlMaster：是否开启 SSH 连接复用
- ControlPath：SSH 连接复用时的控制 socket 文件路径
- ControlPersist：SSH 连接复用时的持续时间
- LocalForward：本地端口转发
- RemoteForward：远程端口转发
- ExitOnForwardFailure：是否在端口转发失败时退出 SSH 连接
- SendEnv：发送本地环境变量到远程主机

一般都有这么设置

```bash
Host github.com
  HostName ssh.github.com
  IdentityFile ~/.ssh/id_rsa
  Port 443

Host organic.github.com
  HostName ssh.github.com
  IdentityFile ~/.ssh/organic_rsa
  Port 443
```

其中，如果多用户连接同一个主机时，可以通过用户名来区分，但连接 GitHub 时，默认用的都是 `git@github.com`，也就是用户名只有一个

GitHub 是通过用户的公钥来区分用户的，一个公钥对应一个用户。这时候如果要在同一台电脑上 ssh 多个 github 账号时，就需要用 Host 来标识了。而其中的 HostName 是真正连接主机的 ip，并需要指定对应的私钥位置

> Host 需要以域名的格式，不带协议、端口、参数、路径

同时，一般来说连接 GitHub 需要用 ssh.github.com:443 来连接

> 这里的缩进只是给人看的，用于更好地分辨不同的用户主机

### scp & sftp 基于 SSH 传送文件

SCP（Secure Copy）是一种基于 SSH 协议的安全文件传输工具，用于在本地主机和远程主机之间传输文件

常用的参数包括：

- -r：递归复制整个目录
- -P：指定远程主机的端口号
- -i：指定使用的身份验证文件
- -q：不显示传输进度信息
- -C：压缩传输的数据
- -v：显示详细的传输进度信息
- -p：保留文件的访问和修改时间

SFTP（Secure File Transfer Protocol）是一种基于 SSH 协议的安全文件传输协议，用于在本地主机和远程主机之间传输文件

常用的参数包括：

- -r：递归复制整个目录
- -P：指定远程主机的端口号
- -i：指定使用的身份验证文件
- -q：不显示传输进度信息
- -c：指定加密算法
- -v：显示详细的传输进度信息
- -B：指定数据包的大小

**示例：**

上传文件：

```bash
scp local_file user@server:/remote/directory
```

下载远程文件到本地主机：

```bash
scp user@server:/remote/directory/remote_file local_file
```

上传本地目录到远程主机：

```bash
scp -r local_directory user@server:/remote/directory
```

下载远程目录到本地主机：

```bash
scp -r user@server:/remote/directory local_directory
```

上传本地文件到远程主机并指定端口号：

```bash
scp -P port local_file user@server:/remote/directory
```

下载远程文件到本地主机并指定身份验证文件：

```bash
scp -i /path/to/identity_file user@server:/remote/directory/remote_file local_file
```
