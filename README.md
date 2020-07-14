# ITTLR 云CI构建系统

> 管理端 云CI构建系统。

## 依赖其他模块

- ittlr-admin-common
- ittlr-admin-basic

以上两个仓库的权限必须拥有，否则无法使用。

## 克隆仓库

```bash
git clone git@gitea.ittlr.com:ittlr/ittlr-admin-ci.git
```

## 安装依赖

```bash
it-md install # 必须在仓库根目录执行，且必须拥有依赖的仓库的权限。
yarn install
```

## 配置环境变量

```bash
cp /app-config所在目录/ai.ittlr.com/env-file/.env.production .
```

## 本地启动

```bash
npm run serve
```

浏览器打开访问：[http://localhost:8009](http://localhost:8009)

## 构建部署

```bash
npm run build
```

当收到更新模块通知时，执行一下命令更新：

```bash
it-md update # 必须在仓库根目录执行
```
