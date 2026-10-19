# PhotosMark

[![Deploy to GitHub Pages](https://github.com/Hanwn/PhotosMark/actions/workflows/deploy.yml/badge.svg)](https://github.com/Hanwn/PhotosMark/actions/workflows/deploy.yml)
![Vue 3](https://img.shields.io/badge/Vue-3-42b883?logo=vue.js&logoColor=white)
![Vite 4](https://img.shields.io/badge/Vite-4-646cff?logo=vite&logoColor=white)
![纯前端](https://img.shields.io/badge/处理方式-纯前端-52525b)
![支持 Docker](https://img.shields.io/badge/Docker-支持-2496ed?logo=docker&logoColor=white)

[English](README.md) · [简体中文](README.zh-CN.md)

**在线体验：** [hanwn.github.io/PhotosMark](https://hanwn.github.io/PhotosMark/)

PhotosMark 是一个纯前端照片水印与排版工具。照片在浏览器中读取、编辑和导出，不需要后端服务。

## 功能

- 批量导入 JPG 照片，在左侧缩略图栏切换照片，批量导出 JPG。
- 提供经典和简约主题；主题的文字、Logo 和外观设置随主题切换。
- 在画布上拖动文字、Logo 和分隔符，使用对齐吸附线辅助排版。
- 可调整边框、Logo 大小和文字样式，并切换日间或暗色界面。
- 可通过 `src/themes` 下的主题文件扩展新主题，参见[主题开发说明](src/themes/README.md)。
- 照片排版支持 2–9 张照片，提供网格、主图、横竖长条、斜条和交错等十二种布局预设，可调整画布比例、间距与背景色，并按源图像素生成高清 JPG。

## 使用方法

1. 点击左侧“添加照片”，选择一张或多张 JPG。
2. 在预览区下方选择主题，在右侧“外观 / 文字 / Logo”页签中编辑设置。
3. 直接拖动画布上的水印元素，最后点击“下载全部照片”。批量下载时，浏览器可能要求允许多个文件下载。

制作拼版时，点击顶部“照片排版”，添加 2–9 张 JPG、PNG 或 WebP。选择布局预设和画布比例；在预览的网格内拖动可调整取景，拖到另一网格可交换照片。选中照片后还可单独设置缩放和水平、垂直位置，最后下载排版照片。

## 本地开发

需要 Node.js 20 或更新版本。

```bash
npm ci
npm run dev
```

生产构建使用 `npm run build`，输出目录为 `dist`。

## 部署

### GitHub Pages

在仓库 **Settings → Pages → Build and deployment** 中将 Source 设为 **GitHub Actions**。推送到 `main` 后，`.github/workflows/deploy.yml` 会自动构建和发布到上方的体验地址。工作流会为仓库子路径设置资源前缀。

### Cloudflare Pages 或 Workers

使用 Cloudflare Pages 时，连接此仓库，构建命令填 `npm run build`，输出目录填 `dist`。也可以使用仓库中的 `wrangler.toml` 将静态资源部署到 Workers：

```bash
npm ci
npm run build
npx wrangler deploy
```

### Docker

镜像构建时生成静态文件，并由 Nginx 提供页面。打开 `http://localhost:8080` 即可访问。

```bash
docker build -t photosmark .
docker run -d --name photosmark -p 8080:80 --restart unless-stopped photosmark
```

照片不会上传到 PhotosMark 服务；导出文件由浏览器本地生成。

## 支持项目

[请我喝杯咖啡](https://www.buymeacoffee.com/hanwn7721n)
