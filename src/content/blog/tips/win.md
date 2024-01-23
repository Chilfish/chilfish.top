---
title: Tips for Windows 10
date: 2023-02-01
tags: [Win]
---

### 添加开机自启脚本

在目录 `"~\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup"` 中添加脚本就行

> 只在 powershell (Bash 类的终端) 中，`~` 才被表示为 `C:\Users\Username`， explorer 的路径栏也不支持

至于 powershell 的启动配置文件，可以通过 `$profile | Get-Member -Type NoteProperty` 来查看

### 端口占用

Kill 时需要管理员

```bash
> netstat -ano | findstr $Port

Proto  Local Address   Foreign Address    State         PID
TCP    0.0.0.0:2333    0.0.0.0:0          LISTENING     3112

> taskkill /pid $PID /F
```

### 创建符号链接

需要管理员

```bash
New-Item -ItemType SymbolicLink -Path "D:/Link" -Target "D:/Target"
```

结果就是在 D 目录下新建了名为 Link 并指向 D:/Target 的链接：

```bash
Mode       LastWriteTime         Length Name
----       -------------         ------ ----
l----      2023/02/19 19:39      D:/Link -> D:/Target
```

### 有无线网卡但没 WIFI

也就是能在网络适配器中看到并启用了 WLAN，但是在网络界面并没有 WIFI 选项

需要先 win 键，搜索 服务，翻到 WLAN AutConfig 选项，大概率是停用了，需要双击打开，选择启动类型为自动，然后右键启动
