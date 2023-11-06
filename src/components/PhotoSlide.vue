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
      accept="image/jpg, image/jpeg"
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
import {getExifData, parseExifData} from "@/utils/readExif";
import {getImageData} from "@/utils/readFile";
import {allCanvasConfigMap} from "@/store/defineCanvasConfig";
import {PreviewRender} from "@/themes/mi/mi";

const {imgSrcList} = defineImgList()
const {currentRenderUid} = defineRender()
const {factor} = defineFactor()
const {iconCache} = defineIcon()

const handleRemove = (uploadFile, uploadFiles) => {
  const uid = uploadFile.uid
  if (allCanvasConfigMap.has(uid)) {
    allCanvasConfigMap.delete(uid)
    // currentRenderUid.value = 0
  }
}

const cacheRenderData = async function(uploadFile) {
  const uid = uploadFile.uid
  if (!allCanvasConfigMap.has(uid)) {
    const imgData = await getImageData(uploadFile.raw)
    let exifData = null
    try {
      exifData = getExifData(imgData)
    } catch (e) {
      exifData = parseExifData(null)
    }
    exifData.LEN = exifData.LEN.replace(/\u0000/g, "")
    const src = uploadFile.url
    let img = null
    try {
      img = await loadImg(src)
    } catch (e) {
      return
    }
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
    PreviewRender(uid, img, exifData, iconImg)
  }
  if (currentRenderUid.value === 0) {
    currentRenderUid.value = uid
  }
}


  const handlePreview = async function (uploadFile) {
    const uid = uploadFile.uid
    if (!allCanvasConfigMap.has(uid)) {
      const imgData = await getImageData(uploadFile.raw)
      let exifData = null
      try {
        exifData = getExifData(imgData)
      } catch (e) {
        exifData = parseExifData(null)
      }
      exifData.LEN = exifData.LEN.replace(/\u0000/g, "")
      const src = uploadFile.url
      let img = null
      try {
        img = await loadImg(src)
      } catch (e) {
        return
      }
      const iconName = getIconSrc(exifData)
      pushToExifCache(src, exifData)
      const iconSrc = `https://pic-1301492519.cos.ap-shanghai.myqcloud.com/icon/${iconName}`
      let iconImg = ""
      if (iconCache.has(iconSrc)) {
        iconImg = iconCache.get(iconSrc)
      } else {
        iconImg = await loadImg(iconSrc)
        pushToIconCache(iconSrc, iconImg)
      }

      PreviewRender(uid, img, exifData, iconImg)
    }
    currentRenderUid.value = uploadFile.uid
  }
</script>
