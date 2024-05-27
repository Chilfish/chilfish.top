---
title: Chilpost Spring Boot Kotlin 后端实现
date: 2023-12-12
tags: [dev-logs, api, Kotlin, Spring Boot]
---

咱还是因为 Web 的大作业要求 Spring Boot，有些看不起 Node 后端，那还是写一份 SB 的实现吧 😹 当然，得是 Kotlin 的 😇

咱放在了 [chilpost-sb] 这个 repo 里

> 咱写着写着 Kotlin 版本的后端成了主线，Nuxt 得拖拖了，找个较好的 Node 后端技术栈
> 实在是因为 Kotlin 太甜了，让人很难推掉它 hhh

### 工具选择

除了 Spring Boot 外，还是用 Kotlin 友好的 [JetBrains/Exposed] 作为 SQL 框架，[org.bitbucket.b_c:jose4j] 作为 JWT/JWS 的支持，和要求的 MySQL。依赖如下

```kotlin
val exposedVersion = "0.44.0"

dependencies {
    implementation("org.jetbrains.exposed:exposed-core:$exposedVersion")
    implementation("org.jetbrains.exposed:exposed-dao:$exposedVersion")
    implementation("org.jetbrains.exposed:exposed-jdbc:$exposedVersion")
    implementation("org.jetbrains.exposed:exposed-json:$exposedVersion")
    implementation("org.jetbrains.exposed:exposed-java-time:$exposedVersion")
    implementation("org.jetbrains.exposed:exposed-spring-boot-starter:$exposedVersion")

    implementation("org.bitbucket.b_c:jose4j:0.9.3")
    implementation("org.springframework.boot:spring-boot-starter-web")

    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.5.1")

    developmentOnly("org.springframework.boot:spring-boot-devtools")
    runtimeOnly("com.mysql:mysql-connector-j")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}
```

### 开始

因为之前有写过 Nest.js (反过来了 hh)，所以还算是比较熟练 hhhh 且算是在 Nuxt 中写了还算好的后端最佳实践，现在要做的只是迁移到 SB 而已

例如抛弃 Restful Api，改用 [all 200 api]、统一的异常处理、JWS 等等

比较惊艳的还是 Exposed 写 DAO，以及 Kotlin 语法的优雅。例如：

```kotlin
fun getUserByEmail(email: String) = (UserTable innerJoin UserStatusTable)
    .select { UserTable.email eq email }
    .map(::toUserDetail)
    .firstOrNull() ?: throw newError(ErrorCode.NOT_FOUND_USER)
```

虽然它不直接支持视图，但也能通过 Kotlin 来间接实现

```kotlin
fun postWithOwner() = PostTable
    .innerJoin(PostStatusTable)
    .join(
        UserTable,
        JoinType.INNER,
        PostTable.ownerId,
        UserTable.id
    )

fun postQuery() = postWithOwner().selectAll()
    .orderBy(PostTable.createdAt to SortOrder.DESC)
```

这些函数都是返回 `Query`，可以继续链式调用，最后再 `map` 到 DTO

### 不该返回自增 id 给前端

一直都是下意识地将主键 id 作为返回的 id，但其实这有很多的弊端，和不安全的地方。b 站将自增 AV 号换为了较为随机的 BV 号，uid 也改为固定长度的随机数字。这部分也是属于老生常谈的问题了，后续我都改为了 uuid 字符串

### 携用户信息的接口

有些接口对于登录用户是另一种表现，例如该推文是否点赞，这部分应该交由后端来查好了再返回给前端，而不是返回一个点赞的 id 数组。且不说实际上这个点赞数组在内部使用主键的自增 id 来存的，把超大的数组传过去似乎不是很合理 hhhh

于是也还是使用携带的 token 中解析出用户信息，那这样就要改一下后端中间件的逻辑了，不在白名单列表 (如搜索、推文详情这些不强求登录后才能请求的路径) 并出错时才报错

同时，为了更易读，应该将这个解析出来的用户命名为像是 ctxUser，表示这个接口 context 的 user，就不会和像是要关注别人的另一个 user 弄混了

```kotlin {3,10}
val token = req.getHeader("Authorization")?.trim()?.split(" ")
if (
    !isInWhiteList(path) &&
    (token.isNullOrEmpty() || token.size != 2 || token[0] != "Bearer")
)
    throw newError(ErrorCode.INVALID_TOKEN)

val userInfo = verifyToken<TokenData>(token?.lastOrNull())

if (userInfo == null && !isInWhiteList(path))
    throw newError(ErrorCode.INVALID_TOKEN)

req.setAttribute("ctxUser", userInfo)

chain.doFilter(request, response)
```

### 外部文件支持

用户上传的文件应该放在专门的 OSS 服务器，或是本机中的某个地方，总之不是 resources，这是会被打包进 jar 中的

于是为了 serve 外部文件，就得专门写一下文件路由：

```kotlin
@Controller
@RequestMapping("/files")
class FileController {
    fun emptyFile(): File {
        val ba = ByteArray(0)
        val file = File.createTempFile("empty", "file")
        file.writeBytes(ba)
        return file
    }

    @GetMapping("/**")
    fun getFile(): ResponseEntity<FileSystemResource> {
        val req = (RequestContextHolder.getRequestAttributes() as ServletRequestAttributes).request
        val filePath = req.servletPath.substringAfter("/files/")

        var file = File("files/$filePath")
        if (!file.exists()) {
            file = emptyFile()
        }
        val headers = HttpHeaders()
        headers.contentType = MediaType.APPLICATION_OCTET_STREAM
        headers.contentDisposition = ContentDisposition.builder("inline")
            .filename(file.name)
            .build()

        val resource = FileSystemResource(file)
        return ResponseEntity(resource, headers, HttpStatus.OK)
    }
}
```

文件将保存在 `$pwd/files` 下，同时它支持深度路径，即 `/files/a/b/c/d.png`

[chilpost-sb]: https://github.com/Chilfish/chilpost-sb
[JetBrains/Exposed]: https://github.com/JetBrains/Exposed
[org.bitbucket.b_c:jose4j]: https://bitbucket.org/b_c/jose4j/wiki/Home
[all 200 api]: ../return-all-HTTP200-api.md#spring-boot
