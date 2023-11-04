<script setup>
import {defineRender} from "@/store/defineRender";
import {
  defineExifCache,
  defineIcon,
} from "@/store/defineImg";
import {defineFactor} from "@/store/defineFactor";

const {exifCache} = defineExifCache()
const {iconCache} = defineIcon()
const {factor} = defineFactor()
const {renderCache, currentRenderUid} = defineRender()

async function reset() {
  if (renderCache.has(currentRenderUid.value) && currentRenderUid.value !== 0) {
    // const renderItem = renderCache.get(currentRenderUid.value)
    // renderItem.deviceInfoConfig.text = currentT
    // const src = id2Src.get(renderIdx.value)
    // const exifData = exifCache.get(src)
    //
    // const img = await loadImg(src)
    // const iconName = getIconSrc(exifData)
    // const iconSrc = `https://pic-1301492519.cos.ap-shanghai.myqcloud.com/icon/${iconName}`
    // let iconImg = ""
    // if (iconCache.has(iconSrc)) {
    //   iconImg = iconCache.get(iconSrc)
    // } else {
    //   iconImg = await loadImg(iconSrc)
    //   pushToIconCache(src)
    // }
    //
    // const padding = 100
    // const rectH = img.height * factor.value
    // const middle = img.height + rectH/3
    // const rectW = img.width
    // const genMarkInfo = getMarkInfo(exifData, padding, middle, rectW, rectH, img.height, iconImg)
    // const renderItem = genRenderItem(img, genMarkInfo)
    //
    // renderCache.set(currentRenderUid.value, renderItem)
  }
}
</script>

<template>
  <div class="inputContainer">
    <input class="inputArea" v-model="renderCache.get(currentRenderUid).deviceInfoConfig.text"/>
    <input class="inputArea" v-model="renderCache.get(currentRenderUid).lensInfoConfig.text"/>
    <input class="inputArea" v-model="renderCache.get(currentRenderUid).parameterInfoConfig.text"/>
    <input class="inputArea" v-model="renderCache.get(currentRenderUid).timeInfoConfig.text"/>
    <input type="button" value="reset" @click="reset">
  </div>

</template>

<style scoped>
.inputContainer{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  margin: 20px;
}
.inputArea{
  padding: 5px;
}
</style>