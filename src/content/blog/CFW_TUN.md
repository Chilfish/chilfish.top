---
title: Clash for Windows 使用 TUN 模式实现网卡级代理
date: 2023-01-16 22:25:00
---

### 前言

> 大幅参考了 [Clash for Windows 优雅地使用 TUN 模式接管系统流量](https://www.dejavu.moe/posts/cfw-tun/)、[Clash 文档#tun 模式](https://docs.cfw.lbyczf.com/contents/tun.html)

众所周知有些软件是不能直接走系统代理的，像是 Git、npm 和最近在搞的 WSL2，需要手动配置）但 Clash 提供了一个 TUN 模式：

TUN 是 三层设备 ，模拟 网络层 设备，操作 第三层 数据包比如 IP 数据包，TUN 虚拟网卡实现 IP 层隧道

Tun 模式通过新建一个 **Tun 虚拟网卡** 接受操作系统的三层浏览流量，从而拓展 Clash 入口（inbound）转发能力，Tun 模式可以提升 Clash 处理 UDP 流量的能力，可以劫持任何三层流量，实现 DNS 劫持也是轻而易举，并且它与部分操作系统的网络栈结合也非常好，可以提升利用 iptables 等组件的能力

<figure><img src="/img/clash_tun.webp"/><figcaption>
走代理时会先虚拟网卡
</figcaption></figure>

### 开始吧

首先要去防火墙把 Clash.core 的权限打开，到 General 点开 `Service Mode` 右边的 `Manage` 并 install，等待它重启后

<figure><img src="/img/clash_setting.webp"/><figcaption>
开关切换这样
</figcaption></figure>

并点 Mixin Mode 旁的齿轮图，填下下面的配置。看看任务管理器多了张网卡，且代理时有流量通过，就表示大功告成了

我的 [Mixin.yaml](https://gist.github.com/Chilfish/8529a98ba4626cd0a45a55d7d668fac6)

### 可能会有的坑

开启 TUN 后，在 **网络适配器选项** 里的 Clash 网卡有可能会显示 “无网络访问权限”，但实际上能联网。就如同平常 win 联网抽风时网络那里是个地球 :globe_with_meridians: 图标但也能联网……具体影响就是会导致 win 系统应用认为没连上网报错 `0x800704cf`。[issues](https://github.com/Dreamacro/clash/issues/1407) 也表示挺玄的，但 clash.core 降级就好了）

<figure><img src="/img/clash_status.webp"/><figcaption>
“无网络访问权限”
</figcaption></figure>
