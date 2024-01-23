---
title: 第三方库与标准库
date: 2023-04-12
---

> 由 GPT 与 GitHub Copilot 强力驱动

### 解析 JSON jackson

例如解析下面这个 json 数组，先转为 json 字符串

```json
[
  {
    "uid": "1",
    "name": "Chilfish",
    "avatar": "https://p.chilfish.top/avatar.webp",
    "lastMessage": "ha haha",
    "lastTime": "1681142224000"
  }
]
```

将返回 list

```java
public List<ChatItem> ChatList(String json) throws Exception {
  ObjectMapper objectMapper = new ObjectMapper();
  JsonNode rootNode = objectMapper.readTree(json);
  List<ChatItem> chatItems = new ArrayList<>();

  for (JsonNode node : rootNode) {
    String uid = node.get("uid").asText();
    String name = node.get("name").asText();
    String avatar = node.get("avatar").asText();
    String lastMessage = node.get("lastMessage").asText();
    String lastMessageTime = node.get("lastTime").asText();

    ChatItem chatItem = new ChatItem(uid, name, avatar, lastMessage, lastMessageTime);
    chatItems.add(chatItem);
  }
  return chatItems;
}
```

### 格式化时间戳 util.Date

```java
public static String format(long time, String format) {
  Date date = new Date(time);
  @SuppressLint("SimpleDateFormat") SimpleDateFormat sdf = new SimpleDateFormat(format);
  return sdf.format(date);
}
```

### filter 过滤 List

数组操作肯定少不了 filter

```java
list
  .stream()
  .filter(this::filterFunc)
  .collect(Collectors.toList());
```
