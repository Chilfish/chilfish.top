---
title: 常见接口及其通信协议
date: 2022-09-28
tags: [cs]
---

## USB 接口

### 物理接口

发展至今 USB 有 7 种不同的接口类型：

![USB 的物理接口](/blog/cs/USB_interface.png)

![USB 的发展史](/blog/cs/USB_History.jpg)

#### Type C 接口

`USB Type-C`，又称 USB-C，是一种 USB 的硬件接口形式，外观上最大特点在于其上下端完全一致，与 `Micro-USB` 相比不再区分 USB 正反面

**USB-C 规范 1.0** 由 USB **开发者论坛（USB-IF）** 发布，并于 2014 年 8 月完成。与 USB 3.1 规格大致相同。但 USB-C 只是一个接口，不一定支持 `USB 3.x` 或 `Power Delivery`

![母头](/blog/cs/USB_Type-C_Receptacle_Pinout.svg)

![公头](/blog/cs/USB_Type-C_Plug_Pinout.svg)

> 可以很明显看出，插口内的 Pin 功能相对于中心对称。公头插入母头，无论正反插，引脚功能都完美契合。而且电源 `VBUS/GND` 都拥有 4 个 Pin，最大支持 5A 电流，在保证高速数据传输的同时也提高了电流承载能力

#### 接口的功能

![出处: https://www.anandtech.com/show/8558/displayport-alternate-mode-for-usb-typec-announced](/blog/cs/USB_Type-C_Pin.png)

**但：** 不是所有的 Type-C 都是满血的接口，会在仅充电需求中砍掉一些接口：

- 24Pin 全功能的 TypeC 好用是好用，但接口的采购成本比较高。况且小家电使用的 MCU 就没有 USB3.0，`USB2.0` 就足够一般设备的使用，于是就有了 **16Pin 的 TypeC**

- 对于玩具、牙刷等生活用品，产品定位上没有 USB 通信的需求，只需要 USB 取电充电。那么连 USB2.0 都可以省掉了。**6Pin TypeC** 正式出道 <br> &emsp;&emsp; `6Pin TypeC` 仅仅保留 Vbus、GND、CC1、CC2。接口两侧对称分布着两组 GND、Vbus，使得防反插功能保留，粗线也让其更为方便的传输大电流

- CC1、CC2 用于 PD 设备识别，承载 USB-PD 的通信，以向供电端请求电源供给。在传输电力的同时，USB 数据传输不会受到影响

### 协议

#### 数据传输

![其中，USB-PD是基于 USB3.2 Gen2 的传输协议](/blog/cs/USB_protocol.png)

#### 充电标准

`USB Power Delivery`（简称：**USB PD**）是 USB 开发者论坛在 2012 年 7 月 5 日发布的 **USB 充电标准与技术**

**USB PD 1.0：** （黑历史，只是画饼）

![只是设想](/blog/cs/USB_PD1.0.png)

**USB DP 2.0：** 改用了 `USB Type-C` 口 (USB3.1)

![注：60W 以上必须用 6A 电线](/blog/cs/USB_PD2.0.png)

**USB DP 3.0：** 相较于 DP 2.0，加入可编程电源供应，可兼容各家快充协议，最新可支持 `QC4+` 快充

**USB DP 3.1：** 把原先 PD 3.0 的内容归纳至标准功率范围，最大功率维持原本的 100 瓦，并同时增加扩展功率范围最大功率为 **240 瓦**

![USB DP3.1](/blog/cs/USB_PD3.1.png)

#### 雷电协议

**Thunderbolt**（又称“雷电”，苹果中国译为“雷雳”）是由英特尔发表的**连接器标准**，目的在于当作电脑与其他设备之间的通用总线，第一代与第二代接口是与 Mini DisplayPort 集成，较新的第三代开始改为与 USB Type-C 结合，并能提供电源。 早期由英特尔独立研发，使用光纤传输；后来在一次科技展示会场上，苹果公司看到了早期光纤传输的原型后，主动对英特尔表示兴趣并给予开发上的建议，致使正式发表的第一代从光纤改用铜线和苹果的 **Mini DP** 外形

&emsp;&emsp; 第三代改为使用 **USB Type-C 接口**。继续延伸多合一的集成特点，因此它既能以双向 $40 Gbit/s$ 传输数据，又能兼容` Mini DP` 设备直接连接 Thunderbolt 接口传输视频与声音信号

![电脑上的雷电接口及充电线通常有着尊贵的闪电图标](/blog/cs/USB_DP.png)

![各代雷电的区别](/blog/cs/USB_DP_Gen.png)

![](/blog/cs/USB_DP_CompareWithOther.png)

## 视频接口

## 参考

- [少数派\_翻旧账讲新史 —— USB 协议](https://sspai.com/post/72867)
- **维基百科**
- [CSDN\_一文读懂 USB TypeC 与 USB-PD](https://blog.csdn.net/Mark_md/article/details/114578359)
- [酷安\_图解 USB 充电史系列](https://www.coolapk.com/feed/34580957?shareKey=MmU4YjIxZjJkNWYwNjMzNDcxZDg)
