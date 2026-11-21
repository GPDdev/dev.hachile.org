# GPDdev Projects

<div align="center"><img alt="Tests: Node.js" src="https://img.shields.io/badge/tests-node%20--test-315942"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-315942"><img alt="Version: 1.10.13" src="https://img.shields.io/badge/version-1.10.13-bb593d"><img alt="Language: HTML, CSS, JavaScript" src="https://img.shields.io/badge/language-HTML%20%2F%20CSS%20%2F%20JavaScript-586a73"></div>

[访问网站](https://dev.hachile.org/)

## 目录

- [介绍](#介绍)
- [本地预览](#本地预览)
- [更新项目与 Star](#更新项目与-star)
- [发布](#发布)
- [参与贡献](#参与贡献)
- [许可证](#许可证)

## 介绍

GPDdev 的开发项目展示页，收录软件、工具与实验。支持中文 / English 切换并保存语言偏好。每个项目使用独立的图形封面或仓库截图，提供 GitHub 链接及已有的在线入口。

项目按 GitHub Star 数降序展示，数量相同则按仓库名排序，没有固定置顶。Tongji TapLoop 当前为空仓库，页面如实标注。项目功能、下载方式及许可证以各自仓库为准。

网站使用原生 HTML、CSS、JavaScript，构建只依赖 Node.js 标准库；无需 npm install，没有浏览器端 GitHub API 请求和第三方字体。

## 本地预览

需要 Node.js 22 或更新版本。使用已保存的 Star 快照构建：

```sh
node scripts/build.mjs
python -m http.server 8000
```

打开 [本地预览](http://localhost:8000/)。也可以使用其他静态服务器。生成的根目录 index.html 可直接打开；部署文件位于 dist/。

## 更新项目与 Star

| 文件 | 用途 |
| --- | --- |
| data/projects.json | 项目名单、双语文案、技术标签、图片及入口 |
| data/stars.json | 最近一次成功查询的 Star 快照与时间 |
| index.html | 页面骨架；带 start/end 注释的区块由构建器更新 |
| assets/style.css | 响应式布局、项目配色与图形封面 |
| assets/app.js | 中英文切换与语言偏好 |
| assets/projects/ | 仓库截图和项目横幅 |
| scripts/build.mjs | 获取 Star、排序、生成卡片并输出 dist/ |
| test/build.test.mjs | 名单、排序、异常响应和安全转义检查 |
| .github/workflows/pages.yml | 每次 main 推送后查询 Star、检查并部署 |
| CNAME / icon.png | 自定义域名与用户提供的图标 |

修改 data/projects.json 后运行：

```sh
node --test
node scripts/build.mjs --refresh
```

--refresh 会逐个查询公开仓库并更新快照与页面。可通过环境变量 GITHUB_TOKEN 或 GH_TOKEN 使用自己的令牌，避免匿名 API 限额；不要把令牌写入代码或提交到仓库。没有该选项时使用已有快照，可离线构建。

如果任何查询失败、仓库身份不匹配或 Star 数据无效，构建失败，旧快照及线上站点保留，不会把错误记作 0。处理网络、权限或限额问题后重新执行。新增项目需同时提供双语文案和对应封面；移除项目只需从数据中删除并重新构建。

## 发布

GitHub Pages 使用 GitHub Actions。推送到 main 或在 Actions 手动运行 **Update stars and deploy**，会：

1. 运行 Node.js 检查。
2. 使用自动提供的 GITHUB_TOKEN 获取所有项目最新 Star。
3. 生成静态页面，将 dist/ 部署到 Pages。

CI 生成结果只进入部署产物，不会反复产生机器人提交。线上 data/stars.json 可查看该次部署的实际快照；本地快照在下次 --refresh 时更新。排序在每次发布时刷新，不随每位访客实时请求。

自定义域名保存在 CNAME。发布流程不更改 DNS；GitHub Pages 设置应保持 GitHub Actions 作为 Source。

## 参与贡献

通过 [Issues](https://github.com/GPDdev/dev.hachile.org/issues) 指出失效链接或资料错误。修改构建逻辑后运行 node --test；界面变更请检查中英文、桌面和窄屏、键盘焦点与图片加载。

## 许可证

页面与构建代码使用 [MIT License](LICENSE)。icon.png 为用户提供的图像，assets/projects/ 为各项目原有截图及图片，不包含在此代码许可中。来源见 [素材说明](assets/README.md)；被展示项目与素材保留各自的权利及授权。
