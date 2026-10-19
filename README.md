# PhotosMark

[简体中文](#简体中文) · [English](#english)

**在线体验 / Live demo:** [hanwn.github.io/PhotosMark](https://hanwn.github.io/PhotosMark/)（首次启用 GitHub Pages 并发布后可访问 / Available after the first GitHub Pages deployment）

## 简体中文

PhotosMark 是一个纯前端照片水印工具。照片在浏览器中读取、编辑和导出，不需要后端服务。

### 功能

- 批量导入 JPG 照片，在左侧缩略图栏切换照片，批量导出 JPG。
- 提供经典和简约主题；主题的文字、Logo 和外观设置随主题切换。
- 在画布上拖动文字、Logo 和分隔符，使用对齐吸附线辅助排版。
- 可调整边框、Logo 大小和文字样式，并切换日间或暗色界面。
- 可通过 `src/themes` 下的主题文件扩展新主题，参见[主题开发说明](src/themes/README.md)。

### 使用方法

1. 点击左侧“添加照片”，选择一张或多张 JPG。
2. 在预览区下方选择主题，在右侧“外观 / 文字 / Logo”页签中编辑设置。
3. 直接拖动画布上的元素，最后点击“下载全部照片”。批量下载时，浏览器可能要求允许多个文件下载。

### 本地开发

需要 Node.js 20 或更新版本。

```bash
npm ci
npm run dev
```

生产构建使用 `npm run build`，输出目录为 `dist`。

### 部署

**GitHub Pages：** 在仓库 **Settings → Pages → Build and deployment** 中将 Source 设为 **GitHub Actions**。推送到 `main` 后，`.github/workflows/deploy.yml` 会自动构建和发布到上方的体验地址。工作流会为仓库子路径设置资源前缀。

**Cloudflare Pages：** 连接此仓库，构建命令填 `npm run build`，输出目录填 `dist`。无需运行服务器。也可以使用仓库中的 `wrangler.toml` 将静态资源部署到 Cloudflare Workers：

```bash
npm ci
npm run build
npx wrangler deploy
```

**Docker：** 镜像构建时生成静态文件，并由 Nginx 提供页面。打开 `http://localhost:8080` 即可访问。

```bash
docker build -t photosmark .
docker run -d --name photosmark -p 8080:80 --restart unless-stopped photosmark
```

照片不会上传到 PhotosMark 服务；导出文件由浏览器本地生成。

## English

PhotosMark is a browser-based photo watermark editor. It reads, edits, and exports photos locally, without a backend service.

### Features

- Import multiple JPG photos, browse them in a left-side filmstrip, and export JPG files in a batch.
- Switch between Classic and Minimal themes, each with its own text, logo, and appearance settings.
- Drag text, logos, and dividers on the canvas with alignment guides and snapping.
- Adjust borders, logo size, and typography, and switch between light and dark modes.
- Add themes through files in `src/themes`; see the [theme guide](src/themes/README.md).

### Usage

1. Click “添加照片” on the left and choose one or more JPG files.
2. Choose a theme below the preview and edit settings in the Appearance, Text, and Logo tabs on the right.
3. Drag elements on the canvas, then click “下载全部照片” to export. Your browser may ask you to allow multiple downloads.

### Local development

Requires Node.js 20 or newer.

```bash
npm ci
npm run dev
```

Run `npm run build` for a production build. Static files are written to `dist`.

### Deployment

**GitHub Pages:** Set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. Pushing to `main` runs `.github/workflows/deploy.yml` and publishes to the live demo URL above. The workflow configures the asset path for the repository subdirectory.

**Cloudflare Pages:** Connect this repository, use `npm run build` as the build command, and set `dist` as the output directory. For Cloudflare Workers static assets, the included `wrangler.toml` also supports `npm ci`, `npm run build`, and `npx wrangler deploy`.

**Docker:** The multistage image builds the static site and serves it with Nginx at `http://localhost:8080`.

```bash
docker build -t photosmark .
docker run -d --name photosmark -p 8080:80 --restart unless-stopped photosmark
```

Photos are not uploaded to a PhotosMark server. Exports are generated in your browser.

## Support

[Buy me a coffee](https://www.buymeacoffee.com/hanwn7721n)
