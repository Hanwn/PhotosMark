<script setup>

import {defineRender} from "@/store/defineRender";
import {getImageData} from "@/utils/readFile";
import {getExifData} from "@/utils/readExif";
import {defineIcon, pushToIconCache, pushToImgList} from "@/store/defineImg";
import {loadImg} from "@/utils/loadImg";
import {getIconSrc} from "@/utils/getIcon";
import {genRenderItem, getMarkInfo} from "@/utils/parameterInfoConfig";
import {defineFactor} from "@/store/defineFactor";

const {renderIdx, renderList, pushToRenderList}= defineRender()
const {iconCache} = defineIcon()
const {factor} = defineFactor()


const readImgData = async function(file) {
  let imgData = ""
  try {
    imgData = await getImageData(file)
  } catch (e) {
    console.log(e)
    return
  }
  const exifData = getExifData(imgData)
  exifData.LEN = exifData.LEN.replace(/\u0000/g, "")
  let src = URL.createObjectURL(file)
  pushToImgList(src)

  const img = await loadImg(src)
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
  pushToRenderList(renderItem)
}

function uploadFiles(e) {
  let files = e.target.files
  if (!files.length) {
    return
  }
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    readImgData(file)
  }
}

</script>

<template>
  <div>
    <input type="file" id="upload" multiple="multiple" @change="uploadFiles">
    <input v-model="renderList[renderIdx].deviceInfoConfig.text"/>
  </div>

</template>

<style scoped>

</style>