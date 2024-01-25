---
title: 文件 IO 流
date: 2023-04-12
tags: [note, android]
---

### 读取项目 assets 的文本文件

assets 文件夹用来放一些静态文件，与 `res/raw` 类似吧，与 res 和 java 同级，都在 `\app\src\main\` 下

现假设要读取 assets 下的一个 json 文件，并转为字符串。把 IS 写进 try 里，可以自动地关闭文件流，就和 py 的 with open 一样

```java
JsonParser jsonParser = new JsonParser();
StringBuilder json = new StringBuilder();

try (InputStream inputStream = getApplicationContext().getAssets().open("messages.json")) {
  BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
  String line;
  while ((line = reader.readLine()) != null) {
    json.append(line);
  }

  ans = json.toString();
} catch (Exception e) {
  e.printStackTrace();
}
```
