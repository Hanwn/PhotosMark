<script setup>

import {defineRender} from "@/store/defineRender";
import {getImageData} from "@/utils/readFile";
import {getExifData} from "@/utils/readExif";
import {
  defineExifCache,
  defineIcon,
  id2Src,
  pushToExifCache,
  pushToIconCache,
  pushToID2Src,
  pushToImgList
} from "@/store/defineImg";
import {loadImg} from "@/utils/loadImg";
import {getIconSrc} from "@/utils/getIcon";
import {genRenderItem, getMarkInfo} from "@/utils/parameterInfoConfig";
import {defineFactor} from "@/store/defineFactor";

const {renderIdx, renderList, pushToRenderList, setRenderIdx, setRenderListByRenderIdx}= defineRender()
const {exifCache} = defineExifCache()
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
  pushToExifCache(src, exifData)

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
  setRenderIdx(renderIdx.value + 1)
  pushToID2Src(renderIdx.value, src)
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

async function reset() {
  console.log(renderIdx.value, id2Src.get(renderIdx.value))
  if (id2Src.has(renderIdx.value)) {
    const src = id2Src.get(renderIdx.value)
    const exifData = exifCache.get(src)

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
    setRenderListByRenderIdx(renderIdx.value, renderItem)

  }
  // renderList[renderIdx.value] = genRenderItem()
}

</script>

<template>
  <div>
    <input type="file" id="upload" multiple="multiple" @change="uploadFiles"/>
    <input type="button" value="reset" @click="reset">
    <input v-model="renderList[renderIdx].deviceInfoConfig.text"/>
    <input v-model="renderList[renderIdx].lensInfoConfig.text"/>
    <input v-model="renderList[renderIdx].timeInfoConfig.text"/>
    <input v-model="renderList[renderIdx].parameterInfoConfig.text"/>
  </div>

</template>

<style scoped>

</style>