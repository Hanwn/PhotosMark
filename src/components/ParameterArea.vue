<script setup>
import {defineRender} from "@/store/defineRender";
import {
  defineExifCache,
  defineIcon, pushToExifCache, pushToIconCache, uid2Src,
} from "@/store/defineImg";
import {defineFactor} from "@/store/defineFactor";
import {loadImg} from "@/utils/loadImg";
import {getIconSrc} from "@/utils/getIcon";
import {genRenderItem, getMarkInfo} from "@/utils/parameterInfoConfig";
import {Aim, Calendar, Camera, Clock, InfoFilled, Refresh} from "@element-plus/icons-vue";
import Download from "@/components/Download.vue";

const {exifCache} = defineExifCache()
const {iconCache} = defineIcon()
const {factor} = defineFactor()
const {renderCache, currentRenderUid} = defineRender()

async function reset() {
  if (renderCache.has(currentRenderUid.value) && currentRenderUid.value !== 0) {
    const src = uid2Src.get(currentRenderUid.value)
    // TODO: mi.js
    const img = await loadImg(src)
    const exifData = exifCache.get(src)
    pushToExifCache(src, exifData)
    const iconName = getIconSrc(exifData)
    const iconSrc = `https://pic-1301492519.cos.ap-shanghai.myqcloud.com/icon/${iconName}`
    let iconImg = ""
    if (iconCache.has(iconSrc)) {
      iconImg = iconCache.get(iconSrc)
    } else {
      iconImg = await loadImg(iconSrc)
      pushToIconCache(src)
    }

    const padding = 100
    const rectH = img.height * factor.value
    const middle = img.height + rectH/3
    const rectW = img.width
    const genMarkInfo = getMarkInfo(exifData, padding, middle, rectW, rectH, img.height, iconImg)
    const renderItem = genRenderItem(img, genMarkInfo)

    renderCache.set(currentRenderUid.value, renderItem)
  }
}
</script>

<template>
  <div class="inputContainer">
      <el-input
        v-model="renderCache.get(currentRenderUid).deviceInfoConfig.text"
        class="w-50 m-2"
        placeholder="Device info"
        :prefix-icon="Camera"
      />

    <el-input
        v-model="renderCache.get(currentRenderUid).lensInfoConfig.text"
        class="w-50 m-2"
        placeholder="Lens Info"
        :prefix-icon="Aim"
    />
    <el-input
        v-model="renderCache.get(currentRenderUid).parameterInfoConfig.text"
        class="w-50 m-2"
        placeholder="parameter Info"
        :prefix-icon="InfoFilled"
    />
    <el-input
        v-model="renderCache.get(currentRenderUid).timeInfoConfig.text"
        class="w-50 m-2"
        placeholder="time info"
        :prefix-icon="Calendar"
    />

    <el-button type="danger" @click="reset">
      Reset
      <el-icon class="el-icon--left">
        <Refresh/>
      </el-icon>
    </el-button>

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