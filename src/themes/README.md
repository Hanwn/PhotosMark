# 主题插件开发

## 可用数据

- uid2Src
- iconCache


## 对外接口

 为`photosmark`开发插件需要提向外提供以下三个接口

- `PreviewRender(uid)`
- `SelectIcon(iconSrc)`
- `SlideFactor(factorValue)`

### PreviewRender

这个函数需要将传入的id对应的图片渲染到画布中

- 参数：uid，当前需要渲染的图片id
- 返回值：{}

### SelectIcon

- 参数：iconSrc,需要更换的Icon地址
- 返回值：


### SlideFactor

当用户~~滑动更改factor的滑动条~~拖拽底部画布时，当前主题需要提供的行为

- 参数
- 返回值
