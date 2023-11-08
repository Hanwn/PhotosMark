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
import {loadImg} from "@/utils/loadImg";
import {getIconSrc} from "@/utils/getIcon";
import {defineFactor} from "@/store/defineFactor";
import {getExifData, parseExifData} from "@/utils/readExif";
import {getImageData} from "@/utils/readFile";
import {allCanvasConfigMap} from "@/store/defineCanvasConfig";
import {PreviewRender} from "@/themes/renderReouter";
import {themeIdx} from "@/store/defineThemes";

const {imgSrcList} = defineImgList()
const {currentRenderUid, marshal,parameterDisable, unMarshal} = defineRender()
const {factor} = defineFactor()
const {iconCache} = defineIcon()

let lastUid = 0
let currentUid = 0

const handleRemove = (uploadFile, uploadFiles) => {
  const uid = uploadFile.uid
  if (allCanvasConfigMap.has(uid)) {
    allCanvasConfigMap.delete(uid)
    if (allCanvasConfigMap.size === 1) {
    }
  }
}

const cacheRenderData = async function(uploadFile, uploadFiles) {
  for (let item of uploadFiles) {
    const uid = item.uid
    const src= item.url
    const name = item.name
    const raw = item.raw
    if (!uid2Src.has(uid)) {
      uid2Src.set(uid, {
        name: name,
        src: src,
        raw: raw,
        renderThemeIdx: 1,
      })
    }
  }
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
    parameterDisable.value = false
    unMarshal(uid)
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
    lastUid = currentUid
    currentUid = uid
    marshal(lastUid)
    unMarshal(currentUid)
    themeIdx.value = uid2Src.get(uid).renderThemeIdx
  }
</script>
