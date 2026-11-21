# GPDdev Projects

<div align="center"><img alt="Tests: manual checks" src="https://img.shields.io/badge/tests-manual%20checks-blue"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-green"><img alt="Version: unversioned" src="https://img.shields.io/badge/version-unversioned-lightgrey"><img alt="Language: HTML, CSS, JavaScript" src="https://img.shields.io/badge/language-HTML%20%2F%20CSS%20%2F%20JavaScript-orange"></div>

[访问网站](https://dev.hachile.org/)

## 目录

- [介绍](#介绍)
- [本地预览](#本地预览)
- [维护](#维护)
- [参与贡献](#参与贡献)
- [许可证](#许可证)

## 介绍

这是 [dev.hachile.org](https://dev.hachile.org/) 的源码，展示 GPDdev 的公开开发项目。页面支持中文和英文切换，语言偏好保存在浏览器中。项目卡片链接到各自的 GitHub 仓库；可在线体验的项目另有网站入口。

## 本地预览

不需要安装依赖。在仓库根目录运行：

```sh
python -m http.server 8000
```

打开 http://localhost:8000/。也可以使用其他静态文件服务器。

## 维护

| 文件 | 用途 |
| --- | --- |
| `index.html` | 页面、样式、项目卡片和英文文案 |
| `CNAME` | GitHub Pages 自定义域名 |
| `icon.png` | 浏览器图标 |

增加项目时，更新项目卡、英文文案和页首的项目数量。链接指向独立仓库，项目功能与下载方式以各仓库的说明为准。

## 参与贡献

欢迎通过 [Issues](https://github.com/GPDdev/dev.hachile.org/issues) 指出失效链接或资料错误。

## 许可证

页面代码使用 [MIT License](LICENSE)。`icon.png` 为用户提供的图像，不包含在此代码许可中；被展示项目各自适用其仓库的许可。
