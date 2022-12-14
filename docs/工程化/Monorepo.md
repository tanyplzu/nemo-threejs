---
title: Monorepo
order: 1
toc: 'content'
nav:
  title: 工程化
  order: 5
---

## Monorepo

两种项目的组织方式

- Multirepo 每个包对应一个项目
- Monorepo 一个项目仓库中管理多个模块/包

### Multirepo

在通常情况下，我们新开一个项目会先在 Github 上面创建一个新仓库，然后在本地创建这个项目，和远程仓库进行关联，基本上是一个仓库对应一个项目。

- 管理、调试困难
- 分支管理混乱
- 依赖关系复杂
- 三方依赖版本可能不一致
- 占用总空间大
- 不利于团队协作

### Monorepo

Monorepo 是管理项目代码的一个方式，Monorepo 的核心观点是所有的项目在一个代码仓库中。

```bash
.
├── packages
│      ├─ module-a
│      │    ├─ src            # 模块 a 的源码
│      │    └─ package.json   # 自动生成的，仅模块 a 的依赖
│      └─ module-b
│           ├─ src            # 模块 b 的源码
│           └─ package.json   # 自动生成的，仅模块 b 的依赖
├── tsconfig.json             # 配置文件，对整个项目生效
├── .eslintrc                 # 配置文件，对整个项目生效
├── node_modules              # 整个项目只有一个外层 node_modules
└── package.json              # 包含整个项目所有依赖
```

目前常见的 monorepo 解决方案是 Lerna 和 yarn 的 workspaces 特性。

### Lerna 和 workspaces 工作流

一般将 Lerna 结合 yarn 一起使用：使用 Lerna 发布，使用 yarn workspaces 管理依赖

**安装依赖**

monorepos 各个库之间存在依赖，如 A 依赖于 B，因此我们通常需要将 B link 到 A 的 node_module 里，一旦仓库很多的话，手动的管理这些 link 操作负担很大，因此需要自动化的 link 操作，按照拓扑排序将各个依赖进行 link;

通过使用 workspace，​yarn install​ 会自动的帮忙解决安装和 link 问题

```bash
yarn install # 等价于
lerna bootstrap --npm-client yarn --use-workspaces
```

**清理环境**

```bash
$ lerna clean # 清理所有的node_modules
$ yarn workspaces run clean # 执行所有package的clean操作,删除各个package里的node_modules以及编译产物
```

**安装|删除依赖**

```bash
yarn workspace packageB remove packageA
yarn workspaces remove lodash
yarn remove -W -D typescript
```

**项目构建**
monorepo 区别于普通项目之处在于各个 package 之间存在相互依赖，如 packageB 只有在 packageA 构建完之后才能进行构建，否则就会出错，这实际上要求我们以一种拓扑排序的规则进行构建。yarn 的 workspace 暂时并未支持按照拓扑排序规则执行命令。lerna 支持按照拓扑排序规则执行命令, ​--sort​ 参数可以控制以拓扑排序规则执行命令

```bash
lerna run --stream --sort build
```

**项目测试**

每个 package 单独支持 test 命令，使用 ​yarn workspace run test​，坏处是不好统一收集所有代码的测试覆盖率

**版本升级及发包**

yarn 官方并不打算支持发布流程，只是想做好包管理工具，因此这部分还是需要通过 lerna 支持

## Lerna

Lerna 是业界知名度最高的 Monorepo 管理工具，功能完整。但由于通用性要求非常高，需要支持任意项目间 Monorepo 的组合，因此在 packages 文件夹下的配置文件还是与独立仓库保持一致，这样在 TS 环境下会造成配置截断的问题。同时包之间的引用也通过更通用的 symlink 完成，这导致了还是要在子模块目录存在 node_modules 文件夹，而且效果依赖项目初始化命令。

### lerna 常用 commands

- `lerna init` 初始化 lerna 管理项目，生成如下目录:

```bash
packages/
package.json
lerna.json
```

- `lerna bootstrap --hoist` 为所有项目安装依赖，并链接所有依赖包，类似于 npm i 使用--hoist 选项后，所有公共的依赖都只会安装在根目录的 node_modules 目录中去,而不会在每个包目录下的 node_modules 中都保留各自的依赖包。
- `lerna clean` 删除所有项目的 node_modules 目录
- `lerna run [script]` 默认为所有的项目运行 npm run [script]脚本，可以指定项目；
- `lerna changed` 列出下次发版 lerna publish 要更新的包。
- `lerna publish` 版本发布，按提示选择版本号(递增，或自定义)，将会执行以下步骤：

  - 运行 lerna updated 来决定哪一个包需要被 publish
  - 如果有必要，将会更新 lerna.json 中的 version
  - 将所有更新过的的包中的 package.json 的 version 字段更新
  - 将所有更新过的包中的依赖更新
  - 为新版本创建一个 git commit 或 tag
  - 将包 publish 到 npm 上；注意要先用 npm adduser 登录 npm 源，否则会失败；

- `lerna add <package>[@version][--dev] [--exact][--peer]` ：可以指定为某一个或所有的包安装依赖，依赖可以是外部(npm i 安装的)也可以是内部依赖(packages/下的包，会创建符号链接)

  - `lerna add babel`, 该命令会在 package-1 和 package-2 下安装 babel
  - `lerna add react --scope=package-1` ,该命令会在 package-1 下安装 react
  - `lerna add package-2 --scope=package-1`，该命令会在 package-1 下安装 package-2

- `lerna create <name> [loc]` 创建一个 lerna 管理的包
- `lerna ls` 控制台打印 packages 下的包名
- `lerna link` 类似 `npm link`,创建软连接(但是实测怎么不起作用)

### lerna 的两种模式

lerna 有两种工作模：Independent mode 和 Fixed/Locked mode  
lerna 的默认模式是 Fixed/Locked mode，在这种模式下，实际上 lerna 是把工程当作一个整体来对待。每次发布 packages，都是全量发布，无论是否修改。  
但是在 Independent mode 下，lerna 会配合 Git，检查文件变动，只发布有改动的 package。

```json
{
  "lerna": "3.5.1",
  "packages": ["packages/*"],
  "version": "independent", <-- 这里设置
  "stream": true,
  "command": {
    "publish": {
      "npmClient": "npm",
      "allowBranch": "develop",
      "verifyAccess": false,
      "message": "chore(release): publish",
      "registry": "https://registry.npm.local"
    }
  },
  "conventionalCommits": true
}
```

## yarn workspace

只需要在根 package.json 中以 workspaces 字段声明 packages 目录和"private": true，yarn 就会以 monorepo 的方式管理 packages。yarn 会以 semver 约定来分析 dependencies 的版本，安装依赖时更快、占用体积更小；

- `yarn workspaces add package`：给所有应用都安装依赖
- `yarn workspace project add package`：给某个应用安装依赖
- `yarn add -W -D package`：给根应用安装依赖

## 缺点

monorepo 感觉更适合内聚性比较强的工具类、框架类工程，例如 react 相关、 Angular 相关，一般发布会有一系列的依赖同步更新；同时这种工程发展是可控的，不会随意膨胀，所以库的体积也是可控的。

业务类的工程代码管理感觉不适合用 monorepo

一是业务代码膨胀很快，不可控，体积会变很大，迟早要拆；  
二是用了 monorepo 自动化发布不好搞，业务一般是要求能独立发布，互不影响，多工程好搞自动化，只要关心 repo 地址就行，剩下的事情外部工具直接执行 repo 内的 ci 文件就行，monorepo 的话是不是要写很多文件夹的逻辑；  
三是业务类的工程往往和组织架构相关，不同的一群人各做各的业务，monorepo 不好做细粒度的权限管理，目前 github gitlab 的权限管理只能到仓库级还不能到目录级；  
四是可以不同的业务用不同的技术实现，比如订单相关可以用 react，用户相关可以用 Angular，目前 monorepo 的管理工具对多技术体系的支持不是那么好；  
五是多工程的依赖完全是独立的，互不影响，给了一些升级依赖延迟的余地。现实世界中业务有些可能就是需要一些旧的依赖，并且还改不动，独立工程的话，可以就先活着，慢慢死去或另起工程更换。

但是多工程需要很强的基建基础，要不然人工维护很痛苦

> [精读《Monorepo 的优势》 github](https://github.com/dt-fe/weekly/issues/151)

## 资料

- [基于 lerna 和 yarn workspace 的 monorepo 工作流](https://zhuanlan.zhihu.com/p/71385053)
- [封装 Vue.js 组件库](https://www.yuque.com/u1694620/danl0o/bn18x7#78fa3934)
- [lerna](https://github.com/lerna/lerna)
- [Why Lerna and Yarn Workspaces is a Perfect Match for Building Mono-Repos – A Close Look at Features and Performance](https://doppelmutzi.github.io/monorepo-lerna-yarn-workspaces/)
- [A Beginner's Guide to Lerna with Yarn Workspaces](https://medium.com/@jsilvax/a-workflow-guide-for-lerna-with-yarn-workspaces-60f97481149d)
- [Creating a Monorepo with Lerna & Yarn Workspaces](https://medium.com/hy-vee-engineering/creating-a-monorepo-with-lerna-yarn-workspaces-cf163908965d)
  [精读《Monorepo 的优势》 黄子毅](https://segmentfault.com/a/1190000019157024)
