---
title: Docker 化你的项目
date: 2023-12-13
---

## 为什么要 Docker 化

Docker是一种开源的容器化平台，它可以将应用程序及其依赖项打包到一个独立的、可移植的容器中。这个容器可以在不同的环境中运行，无论是开发环境、测试环境还是生产环境，都能保持一致的运行结果。Docker的核心概念是容器，它是一个轻量级的、独立的运行环境，包含了应用程序及其所需的操作系统、库和依赖项

Docker 化你的项目，可以让你的项目更加轻量化，更加便携化，更加易于维护，更加易于部署

> by Copilot & GPT

## Docker 化你的项目

### 安装 Docker

Windows 上可以装一个 Docker Desktop，然后就不要打开它（doge）。win11 过后，WSL2 可以通过配置 `networkingMode=mirrored` 来与 Windows 共享网卡，但却与 Docker Desktop 冲突，所以还是要在 WSL2 里安装 Docker Engine。详见讨论: [WSL2 Docker Network]

基本上按官网的步骤来安装就行 [docker ubuntu]

）安装 dokcer Desktop 还是图它的 CLI，可以 docker init 等等，虽然还没找到抽离出来的

### Docker 概念

容器化：Docker使用容器化技术来实现应用程序的打包和隔离。容器是一个独立的运行单元，包含应用程序及其所有依赖项（例如库、运行时环境等）。与传统的虚拟机不同，容器不需要完整的操作系统，而是共享主机操作系统的内核。这使得容器更加轻量级、启动更快，并且在资源利用方面更高效

镜像：镜像是Docker容器的基础。镜像是一个只读的模板，包含了运行应用程序所需的所有文件系统、库和依赖项。通过使用Dockerfile文件定义，我们可以构建自定义的镜像。镜像是可移植的，可以在不同的环境中部署和运行

仓库：Docker仓库是用于存储和分享Docker镜像的地方。Docker Hub是一个公共的仓库，其中包含了大量的官方和社区维护的镜像。我们也可以搭建自己的私有仓库，用于存储和管理自定义的镜像

容器编排：Docker可以与其他工具（如Docker Compose和Kubernetes）结合使用，实现容器的编排和管理。容器编排可以帮助我们定义和管理多个容器的关系，以实现复杂的应用程序架构。例如，我们可以使用Docker Compose定义一个由多个容器组成的应用程序，并通过简单的命令启动、停止和管理整个应用程序。而Kubernetes则提供了更强大的容器编排和管理功能，可以自动扩展、负载均衡和监控容器

应用部署：使用Docker可以实现快速、可重复和可靠的应用部署。通过将应用程序及其所有依赖项打包到一个容器中，我们可以确保应用程序在不同的环境中以相同的方式运行。这消除了环境配置的差异性，减少了部署过程中的问题

现在我们来看一个实际的例子，说明Docker的应用场景

假设我们正在开发一个Web应用程序，它使用Node.js作为后端服务，并使用MySQL作为数据库。在传统的开发环境中，我们需要手动安装和配置Node.js和MySQL，并确保它们能够正确运行。这可能会导致环境配置的差异性和潜在的问题

使用Docker，我们可以将Node.js和MySQL打包到两个独立的容器中，并定义它们之间的网络连接。我们可以使用Dockerfile定义Node.js容器的构建过程，包括安装依赖项、复制应用程序代码和设置运行命令。类似地，我们可以使用Dockerfile定义MySQL容器的构建过程，包括设置数据库和用户

一旦我们构建了这两个容器的镜像，我们可以在任何支持Docker的环境中部署它们。我们只需要运行两个容器，并确保它们能够相互通信。这样，我们就可以在不同的环境中以相同的方式运行我们的应用程序，而不必担心环境配置的问题

### Dockerfile

Dockerfile是用于定义Docker镜像构建过程的文本文件。它包含了一系列的指令，用于指定镜像的基础操作系统、安装软件包、复制文件、设置环境变量等。通过编写Dockerfile，我们可以自定义和管理自己的镜像，以满足应用程序的特定需求

下面我们来详细讲解Dockerfile的一些常用指令和一些技巧

1. FROM指令：FROM指令用于指定基础镜像。基础镜像是构建过程的起点，可以是官方的Docker镜像，也可以是自定义的镜像
2. RUN指令：RUN指令用于在镜像中执行命令。我们可以使用RUN指令安装软件包、运行脚本等
3. COPY和ADD指令：COPY和ADD指令用于将文件从主机复制到镜像中。COPY指令只能复制本地文件，而ADD指令还支持从URL下载文件并解压缩
4. WORKDIR指令：WORKDIR指令用于设置工作目录，即在镜像中执行命令时的默认目录
5. ENV指令：ENV指令用于设置环境变量。我们可以使用ENV指令定义应用程序所需的环境变量
6. EXPOSE指令：EXPOSE指令用于声明容器运行时的监听端口。它并不会实际打开或映射端口，只是用于文档和容器连接的提示
7. CMD和ENTRYPOINT指令：CMD和ENTRYPOINT指令用于指定容器启动时要执行的命令。CMD指令可以被覆盖，而ENTRYPOINT指令则不能被覆盖

除了这些基本指令外，还有一些高级技巧可以应用在Dockerfile中，例如多阶段构建

#### 多阶段构建

多阶段构建是一种在单个Dockerfile中定义多个构建阶段的技术。它可以帮助我们减小镜像的大小，并且只包含运行时所需的文件

例如，我们可以在第一个阶段中使用一个包含构建工具的镜像来编译应用程序，然后在第二个阶段中使用一个更小的镜像来运行应用程序。这样可以减小最终镜像的大小，并提高运行效率

下面是一个使用多阶段构建的示例Dockerfile：

```dockerfile
# 第一阶段：构建应用程序
FROM node:14 as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# 第二阶段：运行应用程序
FROM nginx:latest
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

在上面的示例中，第一阶段使用Node.js镜像来构建应用程序，第二阶段使用Nginx镜像来运行应用程序。通过COPY --from=builder指令，我们将第一阶段构建的结果复制到第二阶段中，从而减小了最终镜像的大小。最终的镜像只包含了运行应用程序所需的文件，而不包含构建工具和源代码

#### 构建缓存

Docker使用构建缓存来提高镜像的构建效率。当我们构建一个镜像时，Docker会检查每个指令的哈希值，如果指令的哈希值与之前的构建相同，则会使用缓存的结果。这样，如果我们只修改了Dockerfile中的某些指令，而其他指令没有变化，则Docker会使用缓存的结果，从而提高构建效率

应用在多阶段构建中就是，如果我们只修改了应用程序的源代码，而其他指令没有变化，则Docker会使用缓存的结果。这样，我们就可以只重新构建应用程序，而不必重新构建构建工具和源代码

但是，有时候我们需要强制Docker忽略缓存，例如在构建时更新软件包。我们可以使用--no-cache选项来强制Docker忽略缓存

#### 使用轻量化镜像源

为了减小镜像的大小，通常我们都会从带有 `-alpine` 后缀的镜像开始构建。Alpine Linux是一个轻量级的Linux发行版，它的镜像只有几十MB，仅包含了必要的软件

现在 `docker init` 默认就使用了这些最佳实践

### Docker Compose

Docker Compose是一个用于定义和运行多个Docker容器的工具。它使用简单的YAML文件来配置应用程序的服务、网络和卷等方面的设置。通过使用Docker Compose，我们可以轻松地创建、启动、停止和管理多个相关的Docker容器，构建复杂的应用程序环境

Docker Compose的主要概念包括服务、网络和卷。服务定义了应用程序的各个组件，每个组件通常对应一个Docker容器。网络定义了服务之间的通信方式，可以是默认的桥接网络，也可以是自定义的网络。卷用于在容器之间共享数据

我们以一个 Web 应用为例，它包含了前后端、数据库和数据的存储位置

```yaml
# docker-compose.yml
version: '3'
services:
  web:
    build:
      context: ./web
      dockerfile: Dockerfile-Web
    ports:
      - 80:80

  server:
    build:
      context: ./server
      dockerfile: Dockerfile-Server
    ports:
      - 3000:3000
    volumes:
      - ./server:/app
    depends_on:
      - db
  db:
    image: mysql:8.0.28
    environment:
      - MYSQL_ROOT_PASSWORD=secret
      - MYSQL_DATABASE=myapp
```

通过运行以下命令，我们可以使用Docker Compose来创建和启动这些服务：

```bash
docker-compose up -d
```

这将会根据docker-compose.yml文件中的定义，创建并启动对应的容器。我们可以使用`docker-compose ps`命令来查看容器的运行状态

[WSL2 Docker Network]: https://github.com/microsoft/WSL/issues/10494#issuecomment-1813011387
[docker ubuntu]: https://docs.docker.com/engine/install/ubuntu/
