<template>
  <el-upload
    drag
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
import { Plus } from "@element-plus/icons-vue";
import {
  defineIcon,
  defineImgList,
  pushToIconCache,
  uid2Src,
} from "@/store/defineImg";
import { defineRender } from "@/store/defineRender";
import { loadImg } from "@/utils/loadImg";
import { getIconSrc } from "@/utils/getIcon";
import { getExifData, parseExifData } from "@/utils/readExif";
import { getImageData } from "@/utils/readFile";
import {
  allCanvasConfigMap,
  defineCanvasConfig,
} from "@/store/defineCanvasConfig";
import { PreviewRender } from "@/themes/renderReouter";
import { factor, themeIdx } from "@/store/defineThemes";
import { checkList, readSettings } from "@/store/defineSettings";
import { requestNotifyStatus } from "@/utils/notify";

const { imgSrcList } = defineImgList();
const { currentRenderUid, marshal, parameterDisable, unMarshal } =
  defineRender();
const { iconCache } = defineIcon();
const { topBannerRectConfig, leftBannerRectConfig, rightBannerRectConfig } =
  defineCanvasConfig();

let lastUid = 0;
let currentUid = 0;

const handleRemove = (uploadFile, uploadFiles) => {
  const uid = uploadFile.uid;
  if (allCanvasConfigMap.has(uid)) {
    allCanvasConfigMap.delete(uid);
    if (allCanvasConfigMap.size === 1) {
      parameterDisable.value = true;
    }
  }
};

const cacheRenderData = async function (uploadFile, uploadFiles) {
  for (let item of uploadFiles) {
    const uid = item.uid;
    const src = item.url;
    const name = item.name;
    const raw = item.raw;
    if (!uid2Src.has(uid)) {
      uid2Src.set(uid, {
        name: name,
        src: src,
        raw: raw,
        renderThemeIdx: 1,
        renderFactor: 0.125,
        img: null,
        exif: null,
      });
    }
  }
  factor.value = 0.125;
  const uid = uploadFile.uid;
  if (!allCanvasConfigMap.has(uid)) {
    const imgData = await getImageData(uploadFile.raw);
    let exifData = null;
    try {
      exifData = getExifData(imgData);
    } catch (e) {
      exifData = parseExifData(null);
      // ElMessage.error("Oops, Your picture is not contain exif data");
      requestNotifyStatus(
        "Oops, Your picture is not contain exif data.",
        "warning",
      );
    }
    exifData.LEN = exifData.LEN.replace(/\u0000/g, "");
    uid2Src.get(uid).exif = exifData;
    const src = uploadFile.url;
    let img = null;
    try {
      img = await loadImg(src);
      uid2Src.get(uid).img = img;
    } catch (e) {
      // ElMessage.warning("Oops, load img failed, please try again");
      requestNotifyStatus("Oops, load img failed, please try again", "error");
      return;
    }

    if (img.height > img.width) {
      uid2Src.get(uid).renderFactor = 0.1;
      factor.value = 0.1;
    }
    const iconName = getIconSrc(exifData);
    const iconSrc = readSettings().value.iconPrefix + iconName;
    let iconImg = "";
    if (!iconCache.has(iconSrc)) {
      try {
        iconImg = await loadImg(iconSrc);
      } catch (e) {
        requestNotifyStatus("Oops, load img failed, please try again", "error");
      }
      pushToIconCache(iconSrc, iconImg);
    }
  }

  if (currentRenderUid.value === 0 || allCanvasConfigMap.size === 2) {
    currentRenderUid.value = uid;
    currentUid = uid;
    factor.value = uid2Src.get(uid).renderFactor;
    PreviewRender(uid);
    unMarshal(uid);
  }
  parameterDisable.value = false;
};

const handlePreview = async function (uploadFile) {
  const uid = uploadFile.uid;
  if (!allCanvasConfigMap.has(uid)) {
    const fileObj = uid2Src.get(uid);
    const exifData = fileObj.exif;
    const iconName = getIconSrc(exifData);
    const iconSrc = readSettings().value.iconPrefix + iconName;

    let iconImg = "";
    if (!iconCache.has(iconSrc)) {
      iconImg = await loadImg(iconSrc);
      pushToIconCache(iconSrc, iconImg);
    }
    PreviewRender(uid);
  }
  currentRenderUid.value = uploadFile.uid;
  lastUid = currentUid;
  currentUid = uid;
  console.log(lastUid, currentUid);
  marshal(lastUid);
  unMarshal(currentUid);
  themeIdx.value = uid2Src.get(uid).renderThemeIdx;
  factor.value = uid2Src.get(uid).renderFactor;

  let visible = false;
  for (let i = 0; i < checkList.value.length; i++) {
    if (checkList.value[i].includes("白边")) {
      topBannerRectConfig.visible = true;
      leftBannerRectConfig.visible = true;
      rightBannerRectConfig.visible = true;
      visible = true;
      break;
    }
  }
  if (visible === false) {
    topBannerRectConfig.visible = false;
    leftBannerRectConfig.visible = false;
    rightBannerRectConfig.visible = false;
  }
};
</script>
