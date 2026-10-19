# 添加主题

在 `src/themes` 下新增一个目录和 `theme.js`。应用通过 `import.meta.glob` 自动发现主题，不用修改主题选择器、设置面板、预览、导出或图片编辑代码。可以参考 `mi/theme.js` 和 `default/theme.js`。

`theme.js` 默认导出主题清单：

```js
export default {
  id: 3,                   // 唯一数字 ID
  order: 3,                // 选择器顺序
  name: "新主题",
  render(uid, options) { /* 返回画布配置 */ },
  selectIcon(src, options) { /* 可选：更换图标 */ },
  slideFactor(value, options) { /* 可选：改变底栏高度 */ },
  fields: [
    { key: "parameterInfoConfig", label: "拍摄参数", placeholder: "例如 35mm f/2.8" },
  ],
  iconPicker: false,
  icons: [],
  appearance: [],
  options: [],
};
```

`render` 返回与现有主题相同的画布配置结构；不使用的元素设置 `visible: false`。现有元素包括照片、底栏、背景、相机型号、镜头、拍摄参数、拍摄时间、图标和分割符。`fields` 指向这些元素的配置名，右侧输入框会按清单生成。

`appearance` 和 `options` 都是设置项数组。设置项支持 `switch`、`number`、`color`、`select` 和 `text` 类型。每项声明 `key`、`label`、`type`、`defaultValue`。用 `target` 和 `property` 直接绑定画布配置，例如 `{ target: "verticalBarInfoConfig", property: "width" }`；需要特殊行为时在主题文件里提供 `apply(value)`、`prepare(value)` 或 `applyRender(renderItem, value)`。设置值按照片和主题分别保存，`render` 可通过 `options` 参数读取。

设置面板按“外观 / 文字 / Logo”分组。`appearance` 和普通 `options` 显示在“外观”，`fields` 显示在“文字”；需要放进“Logo”页签的设置项加上 `section: "icon"`。

通用外观开关可以从 `appearance.js` 导入，通用品牌图标列表可以从 `icons.js` 导入。主题也可以在自己的目录中声明额外图标和资源。
