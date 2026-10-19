<template>
  <div class="photo-library">
    <label class="upload-zone" @dragover.prevent @drop.prevent="onDrop">
      <input type="file" accept="image/jpeg" multiple aria-label="添加 JPG 照片" @change="onSelect" />
      <span class="upload-icon" aria-hidden="true">＋</span><span>添加照片</span>
    </label>
    <p v-if="!imgSrcList.length" class="library-empty">可批量添加 JPG，也可以把照片拖到上方。</p>
    <div v-else class="photo-library-list" aria-label="照片缩略图">
      <div v-for="(file, index) in imgSrcList" :key="file.uid" class="photo-tile" :class="{ active: currentRenderUid === file.uid }">
        <button class="photo-preview" :aria-label="`预览 ${file.name}`" :aria-pressed="currentRenderUid === file.uid" @click="handlePreview(file)"><img :src="file.url" alt="" loading="lazy" decoding="async" /><span v-if="file.status !== 'ready'" class="photo-status">{{ file.status === 'error' ? '加载失败' : '处理中…' }}</span></button>
        <button class="remove-photo" :aria-label="`删除 ${file.name}`" title="删除照片" @click="removeFile(file)">×</button>
        <div class="photo-caption"><span class="photo-index">{{ String(index + 1).padStart(2, '0') }}</span><span class="photo-name" :title="file.name">{{ file.name }}</span></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  defineIcon,
  defineImgList,
  pushToIconCache,
  uid2Src,
} from "@/store/defineImg";
import { defineRender } from "@/store/defineRender";
import { loadImg } from "@/utils/loadImg";
import { ensureImage, releaseImage } from "@/utils/imageCache";
import { getIconSrc } from "@/utils/getIcon";
import { getExifData, parseExifData } from "@/utils/readExif";
import { getImageData } from "@/utils/readFile";
import {
  allCanvasConfigMap,
  defineCanvasConfig,
} from "@/store/defineCanvasConfig";
import { PreviewRender } from "@/themes/renderReouter";
import { themeIdx } from "@/store/defineThemes";
import { requestNotifyStatus } from "@/utils/notify";
import { readSettings } from "@/store/defineSettings";

const { imgSrcList } = defineImgList();
const { currentRenderUid, marshal, parameterDisable, unMarshal } =
  defineRender();
const { iconCache } = defineIcon();
let importQueue = Promise.resolve();
let nextUid = 1;

function addFiles(files) {
  for (const raw of files) {
    if (raw.type !== "image/jpeg" && !/\.jpe?g$/i.test(raw.name)) {
      requestNotifyStatus("仅支持 JPG 图片", "warning");
      continue;
    }
    const file = { uid: nextUid++, name: raw.name, raw, url: URL.createObjectURL(raw), status: "waiting" };
    imgSrcList.value.push(file);
    cacheRenderData(file);
  }
}
function onSelect(event) {
  addFiles(event.target.files);
  event.target.value = "";
}
function onDrop(event) { addFiles(event.dataTransfer.files); }
async function removeFile(file) {
  imgSrcList.value = imgSrcList.value.filter((item) => item.uid !== file.uid);
  await handleRemove(file, imgSrcList.value);
  URL.revokeObjectURL(file.url);
}

const handleRemove = async (uploadFile, uploadFiles) => {
  const uid = uploadFile.uid;
  releaseImage(uid);
  allCanvasConfigMap.delete(uid);
  uid2Src.delete(uid);

  if (currentRenderUid.value === uid) {
    currentRenderUid.value = 0;
    const next = uploadFiles.find((file) => allCanvasConfigMap.has(file.uid));
    if (next) {
      try {
        await ensureImage(next.uid);
        currentRenderUid.value = next.uid;
        unMarshal(next.uid);
        themeIdx.value = uid2Src.get(next.uid).renderThemeIdx;
      } catch (error) {
        requestNotifyStatus("无法加载下一张图片", "error");
      }
    } else {
      const { mainImgConfig, iconInfoConfig } = defineCanvasConfig();
      mainImgConfig.image = null;
      iconInfoConfig.image = null;
    }
  }
  parameterDisable.value = currentRenderUid.value === 0;
};

const cacheRenderData = (uploadFile) => {
  importQueue = importQueue
    .catch(() => {})
    .then(() => processUpload(uploadFile))
    .catch(() => {
      uploadFile.status = "error";
      requestNotifyStatus("无法处理图片", "error");
    });
  return importQueue;
};

async function processUpload(uploadFile) {
  const uid = uploadFile.uid;
  if (!imgSrcList.value.some((file) => file.uid === uid)) return;
  uploadFile.status = "loading";
  if (!uid2Src.has(uid)) {
    uid2Src.set(uid, {
      name: uploadFile.name,
      src: uploadFile.url,
      renderThemeIdx: 1,
      img: null,
      exif: null,
    });
  }
  if (!allCanvasConfigMap.has(uid)) {
    let imgData;
    try {
      imgData = await getImageData(uploadFile.raw);
    } catch (error) {
      requestNotifyStatus("无法读取图片", "error");
      uploadFile.status = "error";
      return;
    }
    if (!uid2Src.has(uid)) return;
    let exifData = null;
    try {
      exifData = getExifData(imgData);
    } catch (e) {
      exifData = parseExifData(null);
      requestNotifyStatus(
        "Oops, Your picture is not contain exif data.",
        "warning",
      );
    }
    imgData = null;
    exifData.LEN = exifData.LEN.replace(/\u0000/g, "");
    uid2Src.get(uid).exif = exifData;
    try {
      await ensureImage(uid);
    } catch (e) {
      requestNotifyStatus("Oops, load img failed, please try again", "error");
      uploadFile.status = "error";
      return;
    }

    const iconName = getIconSrc(exifData);
    const iconSrc = readSettings().value.iconPrefix + iconName;
    if (!iconCache.has(iconSrc)) {
      try {
        const iconImg = await loadImg(iconSrc);
        pushToIconCache(iconSrc, iconImg);
      } catch (e) {
        requestNotifyStatus("Oops, load img failed, please try again", "error");
        uploadFile.status = "error";
        releaseImage(uid);
        return;
      }
    }
    if (!uid2Src.has(uid)) return;
    PreviewRender(uid);
    if (currentRenderUid.value !== 0) releaseImage(uid);
  }

  if (currentRenderUid.value === 0) {
    try {
      await ensureImage(uid);
    } catch (error) {
      return;
    }
    currentRenderUid.value = uid;
    unMarshal(uid);
    themeIdx.value = uid2Src.get(uid).renderThemeIdx;
  }
  uploadFile.status = "ready";
  parameterDisable.value = false;
}

const handlePreview = async function (uploadFile) {
  const uid = uploadFile.uid;
  if (!uid2Src.has(uid) || uid === currentRenderUid.value) return;
  if (!allCanvasConfigMap.has(uid)) await importQueue;
  if (!allCanvasConfigMap.has(uid) || !uid2Src.has(uid)) return;
  try {
    await ensureImage(uid);
  } catch (error) {
    requestNotifyStatus("无法加载图片", "error");
    return;
  }
  const previousUid = currentRenderUid.value;
  marshal(previousUid);
  currentRenderUid.value = uid;
  unMarshal(uid);
  releaseImage(previousUid);
  themeIdx.value = uid2Src.get(uid).renderThemeIdx;
};
</script>

<style scoped>
.photo-library { min-width: 0; }
.upload-zone { height: 38px; display: flex; align-items: center; justify-content: center; gap: 7px; border: 1px dashed #777a80; border-radius: 7px; color: #f4f4f5; background: #303136; cursor: pointer; font-size: 12px; font-weight: 600; }
.upload-zone:hover, .upload-zone:focus-within { background: #3c3e44; border-color: #d4d4d8; }
.upload-zone input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.upload-icon { font-size: 18px; line-height: 1; }
.library-empty { margin: 14px 4px 2px; color: #a1a1aa; font-size: 11px; line-height: 1.6; }
.photo-library-list { display: grid; gap: 9px; max-height: min(72vh, 780px); overflow-y: auto; overscroll-behavior: contain; margin: 12px -5px -3px; padding: 3px 5px 6px; scrollbar-width: thin; scrollbar-color: #5d5f65 transparent; }
.photo-tile { min-width: 0; position: relative; border: 1px solid #46474d; border-radius: 8px; background: #2b2c30; overflow: hidden; }
.photo-tile.active { border-color: #e4e4e7; box-shadow: 0 0 0 2px #e4e4e7; }
.photo-preview { width: 100%; aspect-ratio: 4 / 3; border: 0; padding: 8px; background: #17181b; display: flex; align-items: center; justify-content: center; position: relative; }
.photo-preview img { display: block; max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; }
.photo-preview:focus-visible, .remove-photo:focus-visible { outline: 2px solid #fafafa; outline-offset: -2px; }
.photo-status { position: absolute; inset: auto 0 0; padding: 4px; background: #18181bcc; color: #f4f4f5; font-size: 10px; }
.remove-photo { position: absolute; top: 5px; right: 5px; width: 23px; height: 23px; border: 1px solid #ffffff44; border-radius: 5px; background: #18181bd9; color: #fff; font-size: 17px; line-height: 1; opacity: 0; }
.photo-tile:hover .remove-photo, .photo-tile:focus-within .remove-photo { opacity: 1; }
.photo-caption { display: flex; align-items: center; gap: 7px; min-width: 0; padding: 7px 8px; }
.photo-index { color: #8b8d95; font-size: 10px; font-variant-numeric: tabular-nums; }
.photo-name { display: block; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #d4d4d8; font-size: 10px; }
.photo-tile.active .photo-name { color: #fff; }
@media (hover: none) { .remove-photo { opacity: 1; } }
@media (max-width: 700px) { .photo-library-list { display: flex; overflow-x: auto; overflow-y: hidden; max-height: none; margin: 12px -5px -3px; } .photo-tile { flex: 0 0 120px; } }
</style>
