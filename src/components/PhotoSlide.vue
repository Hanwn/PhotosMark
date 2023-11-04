<template>
  <el-upload
      v-model:file-list="imgSrcList"
      action="#"
      list-type="picture-card"
      :on-remove="handleRemove"
      :on-preview="handlePreview"
      :auto-upload="false"
      :on-change="cacheRenderData"
      :multiple="true"
      accept="image"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import {defineIcon, defineImgList, pushToExifCache, pushToIconCache, uid2Src} from "@/store/defineImg"
import {defineRender} from "@/store/defineRender";
import {genRenderItem, getMarkInfo} from "@/utils/parameterInfoConfig";
import {loadImg} from "@/utils/loadImg";
import {getIconSrc} from "@/utils/getIcon";
import {defineFactor} from "@/store/defineFactor";
import {getExifData} from "@/utils/readExif";
import {getImageData} from "@/utils/readFile";

const {imgSrcList} = defineImgList()
const {currentRenderUid, renderCache} = defineRender()
const {factor} = defineFactor()
const {iconCache} = defineIcon()

const handleRemove = (uploadFile, uploadFiles) => {
  const uid = uploadFile.uid
  if (renderCache.has(uid)) {
    renderCache.delete(uid)
    currentRenderUid.value = 0
  }
}

const cacheRenderData = async function(uploadFile) {
  const uid = uploadFile.uid
  if (!renderCache.has(uid)) {
    const imgData = await getImageData(uploadFile.raw)
    const exifData = getExifData(imgData)
    exifData.LEN = exifData.LEN.replace(/\u0000/g, "")
    const src = uploadFile.url
    const img = await loadImg(src)
    const iconName = getIconSrc(exifData)
    pushToExifCache(src, exifData)
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
    const middle = img.height + rectH / 3
    const rectW = img.width
    const genMarkInfo = getMarkInfo(exifData, padding, middle, rectW, rectH, img.height, iconImg)
    const renderItem = genRenderItem(img, genMarkInfo)
    renderCache.set(uid, renderItem)
  }
  if (currentRenderUid.value === 0) {
    currentRenderUid.value = uid
  }
}


  const handlePreview = async function (uploadFile) {
    const uid = uploadFile.uid
    if (!renderCache.has(uid)) {
      const imgData = await getImageData(uploadFile.raw)
      const exifData = getExifData(imgData)
      exifData.LEN = exifData.LEN.replace(/\u0000/g, "")
      const src = uploadFile.url
      const img = await loadImg(src)
      const iconName = getIconSrc(exifData)
      pushToExifCache(src, exifData)
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
      const middle = img.height + rectH / 3
      const rectW = img.width
      const genMarkInfo = getMarkInfo(exifData, padding, middle, rectW, rectH, img.height, iconImg)
      const renderItem = genRenderItem(img, genMarkInfo)
      renderCache.set(uid, renderItem)
    }
    currentRenderUid.value = uploadFile.uid
  }
</script>
