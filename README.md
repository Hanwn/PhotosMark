# PhotosMark

[![Deploy to GitHub Pages](https://github.com/Hanwn/PhotosMark/actions/workflows/deploy.yml/badge.svg)](https://github.com/Hanwn/PhotosMark/actions/workflows/deploy.yml)
![Vue 3](https://img.shields.io/badge/Vue-3-42b883?logo=vue.js&logoColor=white)
![Vite 4](https://img.shields.io/badge/Vite-4-646cff?logo=vite&logoColor=white)
![Client-side](https://img.shields.io/badge/processing-client--side-52525b)
![Docker ready](https://img.shields.io/badge/Docker-ready-2496ed?logo=docker&logoColor=white)

[English](README.md) · [简体中文](README.zh-CN.md)

**Live demo:** [hanwn.github.io/PhotosMark](https://hanwn.github.io/PhotosMark/)

PhotosMark is a browser-based photo watermark editor. It reads, edits, and exports photos locally without a backend service.

## Features

- Import multiple JPG photos, browse them in a left-side filmstrip, and export JPG files in a batch.
- Switch between Classic and Minimal themes, each with its own text, logo, and appearance settings.
- Drag text, logos, and dividers on the canvas with alignment guides and snapping.
- Adjust borders, logo size, and typography, and switch between light and dark modes.
- Add themes through files in `src/themes`; see the [theme guide](src/themes/README.md).

## Usage

1. Click **Add photos** (添加照片) on the left and choose one or more JPG files.
2. Choose a theme below the preview and edit settings in the Appearance, Text, and Logo tabs on the right.
3. Drag watermark elements on the canvas, then click **Download all photos** (下载全部照片). Your browser may ask you to allow multiple downloads.

## Local development

Requires Node.js 20 or newer.

```bash
npm ci
npm run dev
```

Run `npm run build` for a production build. Static files are written to `dist`.

## Deployment

### GitHub Pages

Set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. Pushing to `main` runs `.github/workflows/deploy.yml` and publishes to the live demo URL above. The workflow configures the asset path for the repository subdirectory.

### Cloudflare Pages or Workers

For Cloudflare Pages, connect this repository, use `npm run build` as the build command, and set `dist` as the output directory. The included `wrangler.toml` also supports Workers static assets:

```bash
npm ci
npm run build
npx wrangler deploy
```

### Docker

The multistage image builds the static site and serves it with Nginx at `http://localhost:8080`.

```bash
docker build -t photosmark .
docker run -d --name photosmark -p 8080:80 --restart unless-stopped photosmark
```

Photos are not uploaded to a PhotosMark server. Exports are generated in your browser.

## Support

[Buy me a coffee](https://www.buymeacoffee.com/hanwn7721n)
