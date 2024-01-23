---
title: 使用 SMB 协议让 PC变私人 NAS
date: 2023-01-20
tags: [Net]
---

### 苦路西……

当设备多起来之后，设备之间的文件共享就逐渐成了需求之一。让文件们都分开在每个设备里，新增时再各自局域网传过去，但很明显这也太蠢了）

于是就有了各种的云盘，只要设个自动备份什么的，就都能随时下载上传了。但又很明显，要速度没容量，要容量又没速度，以及随时都有可能的被夹没……

又于是又一批人选择了私人云盘->NAS 或类似的文件服务器，但问题又是，相对地来说贵很多……两三千起步的群辉对于我更喜欢白嫖垃圾的来说实在是太远了）还不包括围绕它的外设们

所以说现在比较丐的方案就借助手上的电脑了，串上年末买的移动硬盘，搭建起基于 SMB 协议的丐版 NAS，存上一些公共数据。这样的状况下，只要开着电脑，在局域网下就都能访问到共享的文件夹了。而反过来也很容易）

### 小说下 SMB 协议

服务器消息块 (**SMB，Server Message Block**) 协议是**网络文件共享协议**，微软和英特尔在 1987 年制定的协议，主要是作为 Microsoft 网络的通讯协议，可以让应用程序访问远程服务器上的文件或其他资源

在 Win 上的体现就是，右键文件夹->属性->共享 中的共享文件夹涉及到的网络协议主要就是 SMB，它最常见的应用就是让内网的其他设备访问这个文件夹

### 开启文件夹共享

#### 首先得开放网络共享

到控制面板分别打开 `网络和Internet -> 网络和共享中心 -> 更改高级共享设置`，分别开放至下图

<figure align="center"><img src="/img/SMB_openFound.webp"/><figcaption>
）里面的“来宾和公共” 也要打开，如果连的WIFI或以太网是公共的话
</figcaption></figure>

#### 开启 SMB 功能

这里的话，SMB 1.0 在 win10 中是默认关闭的，因为它有被中间人攻击的可能，把它关了就好，这里只要打开 SMB 直通。确定并按提示重启就好

<figure align="center"><img src="/img/SMB_openSMB.webp"/><figcaption>
也是 Win+S 弹出搜索后，搜索打开 启用或关闭 Windows 功能
</figcaption></figure>

#### 新建一个 Win 用户

虽然直接用登录的用户也行，但为了权限之类的隔离开来，可以新建一个用来共享文件夹的用户。先是 Win + S 搜索打开 计算机管理，分别点开左边的 `系统工具->本地用户和组->用户`，右键选择 “新用户”，按下图填写就好）注意这里的用户名和密码就是之后手机访问时的用户名密码了

<figure align="center"><img src="/img/SMB_PConfig.webp"/><figcaption>
大概填成这样
</figcaption></figure>

#### 选择要共享的文件夹

这一步我发现不同版本的 Win10 的界面都不大一样，但步骤也没差多少。首先到要开放的文件夹右键打开属性，到共享栏中，选中 高级共享，按下图填写就好

<figure align="center"><img src="/img/SMB_shareDir.webp"/><figcaption>
）一路确定
</figcaption></figure>

#### 确定共享状态

还是在 **计算机管理** 的窗口中，点左边的 共享文件夹 可以看到正在共享的文件夹和连接数

或者也可以在文件资源管理器（我的电脑）的路径栏中输入 `\\localhost` 来查看正在共享的文件夹。到这一步就基本搞定了

### 客户端软件

#### 文件管理

我用的是跨多端（Win、Android、IOS、Mac）的 [猫头鹰文件](https://skyjos.cn/owlfiles/)，安卓端在 [酷安](https://www.coolapk.com/apk/266816)

<figure align="center"><img src="/img/SMB_owl.webp"/><figcaption>
可以连接超多地方
</figcaption></figure>

登录账号的话，不知为什么 pc 端没微信登录，安卓端没谷歌登录……只有 apple 账户是各端都有的，那就用 Apple 登录吧）

然后按引导或 [帮助文档](https://www.skyjos.cn/owlfiles/help/android/) 添加连接就好。主机 ip 的话就填当前 WiFi 的 ipv4 地址。或者可以等它检测出局域网主机，在下面的 **网络邻居** 中就是了

测了下速度……基本能把千兆 WiFi 稳定在 110MB/s 左右）当然上限还是和硬盘速度有关，用移动硬盘读写却 60% 左右

<figure align="center"><img src="/img/SMB_speed.webp"/><figcaption>
上图上传，下右图下载
</figcaption></figure>

#### 视频播放器

当然用的更多还是瘫床上观看硬盘上的视频了）用的是 [MX Player](https://whiccx5.lanzoul.com/b00109v2j)（挂的话就到酷安搜搜），同时它也支持 SMB 连接以及超多的一堆功能，可以说是手机端视频播放器的超顶了

<figure align="center"><img src="/img/SMB_MXPlayer.webp"/><figcaption>
在左滑->本地网络中添加
</figcaption></figure>

### 其他一些

同时这个猫头鹰也支持本地启动 HTTP/FTP 服务器，供局域网内访问，这样就可以直接通过浏览器来分享本地文件了

至于让外网访问，就弄一个内网穿透什么的吧之类的）

更多可看 [什么值得买：SMB、FTP、WebDAV 协议，傻傻分不清？5000 字教程，教你快速上手 ](https://post.smzdm.com/p/ar6k932q/)
