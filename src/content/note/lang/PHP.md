---
title: PHP
date: 2022-04-19
---

## 基础语法

### 一些......

- PHP 是**弱类型语言**，变量类型在运行时确定，所以不需要声明数据类型。且**变量类型是动态**的
- 变量名区分大小写，**但** 函数却不区分大小写。两者还可以相等但不建议
- **输出：**
  - `echo '$d is: ', "$d desu;", EOL` 中，单引号的变量输出变量名，双引号的输出变量值
  - 会输出到终端或浏览器页面上
  - 浏览器的换行只能是 `<br>` 或 `<p>`，终端上的是 `"\n"`

### Array 数组

- PHP 中的 array 实际上是一个**有序映射**。映射是一种把 `values` 关联到 `keys` 的类型。此类型针对多种不同用途进行了优化； 它可以被视为数组、列表（向量）、哈希表（映射的实现）、字典、集合、堆栈、队列等等
- **定义：** 且 key 值唯一
  ```php
  // 普通数组
  $a = [1, 2, 3];
  // 字典 map
  $map = [
      key1 => value1, // key 只能是 string 或 int
      key2 => value2  // value 可以是任意类型
  ];
  ```
- 此外 key 会有如下的 **强制转换：**
  - `String` 中包含有效的十进制 `int` ，除非数字前面有一个 + 号，否则将被转换为 int 类型。另外， "08" 不会被强制转换，因为它不是一个有效的十进制整数
  - `Float` 也会被转换为 `int` ，意味着其小数部分会被舍去
  - `Bool` 也会被转换成 `int`
  - `Null` 会被转换为空字符串，即键名 `null` 实际会被储存为 ""
  - `Array` 和 `object` 不能 被用为键名。坚持这么做会导致警告：Illegal offset type
- 添加键值可直接用赋值：`$a['new'] = 'mie';`
  删除键值：`unset($a['key']);`，但下标并不会重新分配
- **循环：**
  - 普通 for
    ```php
    for ($i = 0; $i < count($a); ++$i){
        echo $i, ": ", $a[$i], EOL;
    }
    ```
  - foreach
    ```php
    foreach ($arr as $key => $value) {
        echo $key, ': ', $value, EOL;
    }
    ```
- **排序：**
  - `sort`、`asort`：按值升序
  - `ksort`：按键升序

### Cookie 与 Session

#### Cookie

- `setcookie(name, value, expire, path, domain);`
- 参数：
  - name：Cookie 的变量名
  - value：Cookie 的变量值
  - expire：Cookie 的有效期
  - path：Cookie 的服务器路径
  - domain：Cookie 的有效域名
  - secure:是否采用 HTTPS 来传输 Cookie
- 有效期单位为秒，`time() + $expire` ，改为减号则为删除 Cookie

#### Session

- 在 php 文件的开头必须先启动：`session_start()`
- `$_SESSION` 本质上就是个数组
- 销毁 session：
  ```php
  $_SESSION = array();
  session_destroy();
  ```

### 文件操作

- 从表单中上传文件：

  ```html
  <form action="fish.php" method="post" enctype="multipart/form-data">
    上传：<input type="file" name="file" />
    <input type="submit" value="提交" />
  </form>
  ```

- 上传并储存文件：

  ```php
  <?php
  if ($_FILES["file"]["error"] > 0) {
      echo "错误：" . $_FILES["file"]["error"] . "<br>";
  } else {
      echo "上传文件名: " . $_FILES["file"]["name"] . "<br>";
      echo "文件类型: " . $_FILES["file"]["type"] . "<br>";
      echo "文件大小: " . ($_FILES["file"]["size"] / 1024) . " kB<br>";
      echo "文件临时存储的位置: " . $_FILES["file"]["tmp_name"], '<br><br>';

      if (file_exists("upload/" . $_FILES["file"]["name"])) {
          echo $_FILES["file"]["name"] . " 文件已经存在。 ";
      } else {
          // 如果 upload 目录不存在该文件则将文件上传到 upload 目录下
          move_uploaded_file($_FILES["file"]["tmp_name"], "upload/" . $_FILES["file"]["name"]);
          echo "文件存储在: " . "upload/" . $_FILES["file"]["name"];
      }
  }
  ```

#### 读写文件

```php
$file = fopen('name', 'mode'); // 打开文件
fclose($file); // 关闭文件
fgets($file); // 读取行
fgetc($file); //读取字符
fwrite($file, $mie); //写入
feof($file); // 文件尾 (return bool)
```

#### 读写模式

![文件的读写模式](/blog/lang/php_file.png)

### 服务器环境信息

```php
print_r($_SERVER);
```

[文档](https://www.php.net/manual/zh/reserved.variables.server.php)

## 表单

### 创建表单

- 在 <a href="html.md#表单"><b>HTML</b></a> 中的表单
- **获取：** 且返回的是数组
  ```php
  $_POST[name] | $_GET | $_REQUEST // 必须全大写
  ```
- **常见表单元素处理：**
  至于表单元素中的文本框文本域一类的元素，都是直接将元素的 name 属性值作为**键**，用户填写的信息作为**值**，发送到服务端
  - 将 **多选** 或是 **下拉选项** 中将选项返回成数组，则 name 后加上 `[ ]`： `<input name="fish[]">`
  - 防注入的表单验证：
    ```php
    function test_input($data): string
    {
        return htmlspecialchars(stripslashes(trim($data)));
    }
    ```
    > `trim`：去除没必要的空格、换行
    > `stripslashes`：去除反斜杠
    > `htmlspecialchars`：转为 HTML 实体符号

### 处理登录

- 以简单为例：

  ```html
  <form action="login.php" method="POST">
    <label>
      账号：<input type="text" name="name" /><br />
      密码：<input type="password" name="password" /><br />
    </label>
    <input type="submit" value="提交" name="login" /><br />
  </form>
  ```

  - 处理：

    ```php
    <?php
    session_start();  //启动session储存
    if (isset($_POST['login'])) {
        $name = trim($_POST['name']);
        $password = trim($_POST['password']); //通常地防注入处理
        if ($name == '' || $password == '') {
            echo "不准空";
            exit;
        } elseif ($name != 'fish' || $password != 'fish') {
            echo "不准错";
            exit;
        } else {
            $_SESSION['name'] = $name;
            $_SESSION['is_login'] = 1;
            setcookie('name', '', time() - 999);
            setcookie('code', '', time() - 999);

            header('location:index.php'); //跳转链接时的 HTTP头
        }
    }
    ?>
    ```

  - 目标页面判断登录状态：
    ```php
    <?php
    session_start();
    if (isset($_COOKIE['name'])) {
        $_SESSION['name'] = $_COOKIE['name'];
        $_SESSION['is_login'] = 1;
    }
    if (isset($_SESSION['is_login'])) {
      xxx
    }
    else
    ```

- mie

## 连接 MySQL

PHP 数据对象 （PDO） 扩展为 PHP 访问数据库定义了一个轻量级的一致接口。实现 PDO 接口的每个数据库驱动可以公开具体数据库的特性作为标准扩展功能

> 字典：[PHP_PDO](https://www.runoob.com/php/php-pdo.html)

### PDO 类

- `PDO::__construct($dsn ,$username, $password)` 创建一个表示数据库连接的 PDO 实例：
  ```php
  try {
      $dbh = new PDO($dsn, $user, $password);
  } catch (PDOException $e) {
      echo 'Connection failed: ' . $e->getMessage();
  }
  ```
- `exec ($statement) : int` 执行 SQL 语句，并返回影响的行数：
  ```php
  $dbh->exec($sql);
  ```
- `query ($statement) : PDOStatement` 执行 SQL 语句，并返回 PDOstatement 类的结果

  ```php
  $arr = $dbh->query($sql);
  ```

- `prepare($sql)`：预处理功能，在多次执行相同的 SQL 语句并且只是更换了参数（例如表名，字段名）的情况可以大幅提高执行效率

  > 一次编译、多次运行，省去了解析优化等过程；此外预编译语句能防止 SQL 注入

  ```php
  $sql="insert into userinfo values(?, ?)";
  $in_result = $db->prepare($sql);
  $user="php3"; $pwd1="111111";
  $in_result->bindParam(1, $user);
  $in_result->bindParam(2, $pwd);
  $in_result->execute();
  if($in_result->rowCount()==0)
      echo "插入记录失败!";
  else
      echo "插入记录成功!";
  ```

- **事务：** [MySQL 事务](./MySQL.md#事务)

  - `beginTransaction()`：开始事务
  - `rollback()`：回滚事务

  ```php
  try {
      $db->exec("set names utf-8");
      $db->beginTransaction();
      $rows=$db->exec($sql);
      if(!$rows)
          throw new PDOException("失败");
      echo "成功!";
      $db->commit();
  }
  catch (PDOException $e) {
      echo $e->getMessage();
      $db->rollBack();   //回滚(要么成功要么失败)
  }
  ```

- 其他函数：
  - `PDO::getAttribute()` — 取回一个数据库连接的属性
  - `PDO::getAvailableDrivers()` — 返回一个可用驱动的数组
  - `PDO::inTransaction()` — 检查是否在一个事务内
  - `PDO::lastInsertId()` — 返回最后插入行的 ID 或序列值

### PDOstatement 类

- `fetch($fetch_style)` 从结果集 中获取下一行（只有一行结果）。其中的参数：
  - `PDO::FETCH_ASSOC` ：返回一个索引为结果集列名的数组
  - `PDO::FETCH_BOTH` （默认）：返回一个索引为结果集列名和以 0 开始的列号的数组
  - `PDO::FETCH_BOUND` ：返回 true ，并分配结果集中的列值给 PDOStatement::bindColumn() 方法绑定的 PHP 变量
  - `PDO::FETCH_CLASS` ：返回一个请求类的新实例，映射结果集中的列名到类中对应的属性名
  - `PDO::FETCH_INTO` ` ：更新一个被请求类已存在的实例，映射结果集中的列到类中命名的属性
  - `PDO::FETCH_LAZY` ：结合使用 `PDO::FETCH_BOTH` 和 `PDO::FETCH_OBJ` ，创建供用来访问的对象变量名
  - `PDO::FETCH_NUM` ：返回一个索引为以 0 开始的结果集列号的数组
  - `PDO::FETCH_OBJ` ：返回一个属性名对应结果集列名的匿名对象
  ```php
  $dbh->query($sql)->fetch(PDO::FETCH_ASSOC);
  ```
- `fetchAll($fetch_style)` 返回结果的所有行
