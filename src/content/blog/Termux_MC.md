---
title: Deploy a Minecraft Server on Android Termux
date: 2023-04-03
tags: [Linux, Android]
---

其实是突然想到，让米板 5 干坐着也不是事，有些浪费这 855 Plus 了）于是就意识到 MC 服务器不都一般在 Linux 上的嘛，然后这不是还有一个 Termux 嘛，网上一搜果然有，接下来就是验证想法了

Termux 可以在酷安找到，或是在 [F-droid](https://f-droid.org/en/packages/com.termux/) 上有官版，然后 ssh 到电脑上来敲 -> [Termux 初始化](./tips/android.md#初始化)

### initialization

先更新和安装 wget：

```bash
pkg update -y && pkg upgrade -y && pkg install wget -y
```

然后安装 Java，似乎还只有 Java17，但也够了

```bash
pkg install openjdk-17 -y
```

卡住记得回车继续，安装完后看 `java --version` 应该就能看到版本信息了

### install MC Server

一般来说是装在储存卡下的，需要先为 Termux 获取储存卡权限：

```bash
termux-setup-storage
```

然后会弹出权限申请，同意就行。然后 cd 到储存卡根目录，并新建文件夹来放 MC

```bash
cd ~/storage/shared
mkdir Minecraft-server && cd Minecraft-server
```

接着是下载 [server 的 jar](https://www.minecraft.net/zh-hans/download/server)，极大可能需要 7 根木棒摆 H 合成的东西来加速下载，所以我是在电脑上下好了再传到板上。又或者相较于官方的包，可以选择 [PaperMC](https://papermc.io/downloads/paper)

> vanilla.jar 是 Minecraft 官方原版服务器软件，它是未经修改的纯净服务器，只包含 Minecraft 的基本功能和特性。而 paper.jar 是一种基于原版的第三方服务器软件，它对原版进行了优化和改进，可以提供更好的性能和更多的功能
>
> Paper 通过优化服务器的代码、调整配置文件和添加插件等方式来提高服务器的性能和稳定性。 Paper 还提供了更多的命令和设置选项，使服务器管理更加方便。因此，对于需要更好性能和更多功能的玩家，建议使用 paper.jar 作为服务器软件

运行前需要先 同意许可证：

```bash
echo "eula=true" > eula.txt
```

然后运行它：

```bash
java -jar paper.jar
```

它会先下载 paper.jar 对应的 MC 包，其中还是需要木梯子。也可以在电脑上运行后，会将游戏主体下载到 `cache/mojang_{版本}.jar` ，然后将这个目录文件拷到 `Minecraft-server/` 下，再运行 paper 就好

> 同时基于 Java 的跨平台，这个 server.jar 也完全可以在 win 上直接运行，官方的那个 server.exe 应该就是把这一过程打包了
>
> 但无奈电脑不大跑得动 MC 的计算，所以才把这一部分的运算交给了米板，电脑负责渲染就好了

### run it！

我结合了 PCL2 上的运行参数，可以在 home 下新建一个脚本

```bash
vim ~/MC-server.sh
# 添加下面的

cd ~/storage/shared/Minecraft-server/
java -Xms2G -Xmx2G -XX:+UseG1GC -XX:-UseAdaptiveSizePolicy -XX:-OmitStackTraceInFastThrow -Dfml.ignoreInvalidMinecraftCertificates=True -Dfml.ignorePatchDiscrepancies=True -Dlog4j2.formatMsgNoLookups=true -jar server-1.19.4.jar nogui
```

参数解释：

- `-Xms2G`：设置 Java 虚拟机初始堆大小为 2G
- `-Xmx2G`：设置 Java 虚拟机最大堆大小为 2G
- `-XX:+UseG1GC`：使用 G1 GC（Garbage First）垃圾回收器
- `-XX:-UseAdaptiveSizePolicy`：禁用自适应策略
- `-XX:-OmitStackTraceInFastThrow`：在快速抛出异常时不忽略堆栈跟踪信息
- `-Dfml.ignoreInvalidMinecraftCertificates=True`：忽略无效的 Minecraft 证书
- `-Dfml.ignorePatchDiscrepancies=True`：忽略补丁不一致
- `-Dlog4j2.formatMsgNoLookups=true`：使用日志记录工具 log4j2 格式化消息时，不使用任何变量替换

然后就能在局域网下对上 ip 加 25565 端口访问了

### server.properties

> more at [wiki](https://minecraft.fandom.com/zh/wiki/Server.properties)

这个文件是用来给服务器配置的，基本改一下下面的就行

其中，就算关了正版验证，如果用正版的账号登录的话，他还是需要联网来验证了（所以这就是相较于 离线模式 的关系了）

```properties
# 关闭正版验证
online-mode=false
# 游戏难度
difficulty=easy # | normal | hard | peaceful
```

更改后需要重新加载服务器：

```bash
reload confirm
```

### 一些服务器指令

- **赋予管理员权限**，在玩家进去之后，服务器命令行：`op name`
