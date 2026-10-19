# PHOTO MARK

Vue 3 + Konva 构建的纯前端照片水印工具。界面采用 shadcn 风格的本地组件样式。

## :wave:Introduce

- 照片水印生成器


## :sparkles:Feature

- 多图片生成，批量下载
- 纯前端实现，照片在浏览器中处理
- 按原始尺寸导出 JPEG，导出文件不包含原图 EXIF
- 可视化操纵，直观简单
- 支持多种设备
  - Sony
  - Nikon
  - Canon
  - Lumix
  - Dji

##  TODO

- [ ] 优化移动端内存占用
- [ ] 优化移动端布局
- [ ] 支持icon替换
- [ ] 支持更多主题
- [x] 支持静态资源私有化部署

## 本地运行

```bash
npm ci
npm run dev
```

## 部署到 Cloudflare Workers

项目不需要后端。图标和界面资源都随构建产物一起部署，照片只在用户浏览器内读取和导出。

```bash
npm ci
npm run build
npx wrangler deploy
```

`wrangler.toml` 已配置 `dist` 为 Workers 静态资源目录。首次部署需要登录 Cloudflare 账户。



## Buy me coffee

<a href="https://www.buymeacoffee.com/hanwn7721n" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >
</a>
