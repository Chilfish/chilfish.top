---
title: Git & GitHub
date: 2022-07-10
tags: [note, Git]
---

## Git config

使用 git config 命令进行 git 的配置，常用命令如下：

<div class="tableBox">

<span></span>
命令 | 作用
| :- | :- |
`git config --list` | 打印出当前环境的 git 配置信息，接 `--global` 可以打印全局配置
`git config user.name fish` | git 配置 `username` 为 `fish`,可后接`--global`
`git config user.email xxx@gxx.com` | git 配置 `email` 为 `xxx@gxx.com`，可后接 `--global`
`git config --global core.autocrlf false` | windows 总提示 `CR/LF` 的警告，设置后可去除
`git config --global credential.helper store `| 终端环境保存 `https` 的密钥，避免每次都要密码
`git config --global core.quotepath false` | 用来解决 _git status_ 显示中文乱码的问题。`git-bash`，找到`选项->文本->本地 Locale`， 设置为 `zh_CN`，而旁边的字符集选框选为 `UTF-8`

</div>

当然，除了命令行配置，还可以直接编辑文件 `~/.gitconfig` 文件，但是请清楚修改的具体含义，避免出现 git 后续使用的不必要的错误

## Git 初始化

### git init

如果不依赖任何远端仓库，而是自行本地新建仓库并初始化，使用 `git init` 即可。示例如下，创建一个名为 MyGitRepo 的仓库：

```shell
mkdir MyGitRepo
cd MyGitRepo
git init
```

在 `git init` 执行后，执行 `ls -a` 可以看到多了一个 `.git` 文件夹，这就是 git 的主干文件了

### git clone

然而大多数时候，我们并不需要自己新建，而是需要从远端 Git 仓库获取已经有的仓库。通常的流程大都是，先在例如 GitHub 的平台上新建仓库，再克隆这个仓库来开发

假如现在想克隆本仓库 https://github.com/Organic-Fish/Notes.git ，则在命令行执行：

```shell
git clone https://github.com/Organic-Fish/Notes.git
```

命令执行完成后便多了个 `Notes`（仓库名）的文件夹 (如果因为网络失败，则可能需要 git 加速，或者代理加速了)

> 如果因为网络的原因，clone 的速度太慢，或者报错。有 2 种方法可以尝试：
>
> - **Github 的镜像站进行加速：** 只需要把 `https://github.com` 替换成 `https://hub.fastgit.org` 即可
> - Git 加速工具 **Dev-SideCar**，地址：[Dev-SideCar](https://github.com/docmirror/dev-sidecar)(鸡生蛋生鸡了\doge)

## 编辑到提交

### git add/restore

Git 操作一个新文件的流程为：工作区(也就是本地文件)–> 暂存区(staged) –> 仓库，如下图所示：

![Git 新增文件流程](/blog/cs/Git_add.png)

在完成开发后

> :construction:

<!-- ### git remote

## 分支与标签管理

## 提交历史

## 推送到远程仓库

## 合并与重置 -->

<!-- - **git 的一些：**
  - `git remote`： 查看是否有远程仓库
    没有远程仓库   `git remote add [远程仓库名] [远程地址]`： 配置远程仓库
  - `git clone [url]`：克隆项目 / `git pull` 拉取最新代码
  - `git status`：本地仓库状态
  - `git add.` ：提交到暂存区中
  - `git commit -m '描述'`： 提交到本地仓库中
  - `git push [远程仓库名] [分支名]`： 提交到远程仓库
- **分支：**
  - `git branch`：列出本地的所有分支，当前所在分支以 "\*" 标出
  - `git branch -v`：列出本地的所有分支并显示最后一次提交，当前所在分支以 "\*" 标出
  - `git branch -b [新分支名]`： 创建新的分支，在新分支上修改代码
  - `git branch -d [分支名]`： 删除之前修改代码的分支,删之前先 `branch` 查看
  - `git branch -m [<原分支名称>] <新的分支名称>`：修改分支名
  - `git checkout [分支名]`： 切换到指定的分支
  - `git checkout -b [分支名]`： 将当前分支复制到新的分支进行开发。等同于 `git branch` 和 `git checkout` 两个命令合并
  - `git merge [分支名]`： 把修改代码的分支合并到当前分支
- 提交代码前先更新远程的代码，但如果当前分支修改了代码没有提交，更新下来的代码可能会导致与当前未提交的代码冲突或被覆盖。所以： `git stash`：放弃当前更改 -->
