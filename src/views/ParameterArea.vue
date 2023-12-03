<script setup>
import { defineRender } from "@/store/defineRender";
import {
  defineExifCache,
  defineIcon,
  pushToExifCache,
  pushToIconCache,
  uid2Src,
} from "@/store/defineImg";
import { loadImg } from "@/utils/loadImg";
import { getIconSrc } from "@/utils/getIcon";
import {
  Aim,
  Calendar,
  Camera,
  Delete,
  InfoFilled,
  Refresh,
  ZoomIn,
} from "@element-plus/icons-vue";
import { onMounted, ref, watch } from "vue";
import { getImageData } from "@/utils/readFile";
import { getExifData, parseExifData } from "@/utils/readExif";
import {
  allCanvasConfigMap,
  defineCanvasConfig,
} from "@/store/defineCanvasConfig";
import { PreviewRender, SelectIcon } from "@/themes/renderReouter";
import { factor } from "@/store/defineThemes";
import { useParameterAreaOnMountedHook } from "@/hooks/defineOnMountedHook";
import { readSettings } from "@/store/defineSettings";
import { ElMessage } from "element-plus";
import { requestNotifyStatus } from "@/utils/notify";

const { exifCache } = defineExifCache();
const { iconCache } = defineIcon();
const { currentRenderUid, unMarshal, marshal, parameterDisable } =
  defineRender();

const {
  deviceInfoConfig,
  parameterInfoConfig,
  timeInfoConfig,
  lensInfoConfig,
  verticalBarInfoConfig,
  bannerRectConfig,
} = defineCanvasConfig();

async function reset() {
  if (
    allCanvasConfigMap.has(currentRenderUid.value) &&
    currentRenderUid.value !== 0
  ) {
    const uid = currentRenderUid.value;
    const src = uid2Src.get(currentRenderUid.value).src;
    const img = await loadImg(src);
    const exifData = exifCache.get(src);
    pushToExifCache(src, exifData);
    const iconName = getIconSrc(exifData);
    const iconSrc = readSettings().value.iconPrefix + iconName;
    let iconImg = "";
    if (iconCache.has(iconSrc)) {
      iconImg = iconCache.get(iconSrc);
    } else {
      iconImg = await loadImg(iconSrc);
      pushToIconCache(src);
    }
    // fix: reset not work
    if (img.height > img.width) {
      factor.value = 0.1;
    } else {
      factor.value = 0.125;
    }
    uid2Src.get(uid).renderFactor = factor.value;
    PreviewRender(uid, img, exifData, iconImg, uid2Src.get(uid).renderFactor);
    // not best practise
    unMarshal(uid);
  }
}

const value = ref("");

async function select() {
  await SelectIcon(value.value);
}

async function handleSlide(e) {
  const uid = currentRenderUid.value;
  const uploadFile = uid2Src.get(currentRenderUid.value);
  uploadFile.renderFactor = e;
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
  const src = uid2Src.get(currentRenderUid.value).src;
  let img = null;
  try {
    img = await loadImg(src);
  } catch (e) {
    // ElMessage.error("Oops, load img failed, please try again");

    requestNotifyStatus("Oops, load img failed, please try again", "error");
    return;
  }

  const iconName = getIconSrc(exifData);
  pushToExifCache(src, exifData);
  const iconSrc = readSettings().value.iconPrefix + iconName;

  let iconImg = "";
  if (iconCache.has(iconSrc)) {
    iconImg = iconCache.get(iconSrc);
  } else {
    iconImg = await loadImg(iconSrc);
    pushToIconCache(iconSrc, iconImg);
  }

  PreviewRender(uid, img, exifData, iconImg, e);
  // not best practise
  unMarshal(uid);
}

const { options, fetchIconList } = useParameterAreaOnMountedHook();

onMounted(() => {
  fetchIconList();
});
</script>

<template>
  <div class="inputContainer">
    <div class="color-block">
      <el-input
        v-model="deviceInfoConfig.text"
        class="w-50 m-2"
        placeholder="Device info"
        :prefix-icon="Camera"
        :disabled="parameterDisable"
      />
      <el-color-picker
        v-model="deviceInfoConfig.fill"
        size="small"
        :disabled="parameterDisable"
      />
      <el-button
        size="small"
        :style="{ 'font-weight': deviceInfoConfig.fontStyle }"
        :disabled="parameterDisable"
        @click="
          (evt) => {
            deviceInfoConfig.fontStyle.includes('bold')
              ? (deviceInfoConfig.fontStyle =
                  deviceInfoConfig.fontStyle.replace('bold', ''))
              : (deviceInfoConfig.fontStyle = 'bold');
          }
        "
        >B</el-button
      >
    </div>

    <div class="color-block">
      <el-input
        v-model="lensInfoConfig.text"
        class="w-50 m-2"
        placeholder="Lens Info"
        :prefix-icon="Aim"
        :disabled="parameterDisable"
      />
      <el-color-picker
        v-model="lensInfoConfig.fill"
        size="small"
        :disabled="parameterDisable"
      />
      <el-button
        size="small"
        :style="{ 'font-weight': lensInfoConfig.fontStyle }"
        :disabled="parameterDisable"
        @click="
          (evt) => {
            lensInfoConfig.fontStyle.includes('bold')
              ? (lensInfoConfig.fontStyle = lensInfoConfig.fontStyle.replace(
                  'bold',
                  '',
                ))
              : (lensInfoConfig.fontStyle = 'bold');
          }
        "
        >B</el-button
      >
    </div>

    <div class="color-block">
      <el-input
        v-model="parameterInfoConfig.text"
        class="w-50 m-2"
        placeholder="parameter Info"
        :prefix-icon="InfoFilled"
        :disabled="parameterDisable"
      />
      <el-color-picker
        v-model="parameterInfoConfig.fill"
        size="small"
        :disabled="parameterDisable"
      />
      <el-button
        size="small"
        :style="{ 'font-weight': parameterInfoConfig.fontStyle }"
        :disabled="parameterDisable"
        @click="
          (evt) => {
            parameterInfoConfig.fontStyle.includes('bold')
              ? (parameterInfoConfig.fontStyle =
                  parameterInfoConfig.fontStyle.replace('bold', ''))
              : (parameterInfoConfig.fontStyle = 'bold');
          }
        "
        >B</el-button
      >
    </div>

    <div class="color-block">
      <el-input
        v-model="timeInfoConfig.text"
        class="w-50 m-2"
        placeholder="time info"
        :prefix-icon="Calendar"
        :disabled="parameterDisable"
      />
      <el-color-picker
        v-model="timeInfoConfig.fill"
        size="small"
        :disabled="parameterDisable"
      />
      <el-button
        size="small"
        :style="{ 'font-weight': timeInfoConfig.fontStyle }"
        :disabled="parameterDisable"
        @click="
          (evt) => {
            timeInfoConfig.fontStyle.includes('bold')
              ? (timeInfoConfig.fontStyle = timeInfoConfig.fontStyle.replace(
                  'bold',
                  '',
                ))
              : (timeInfoConfig.fontStyle = 'bold');
          }
        "
        >B</el-button
      >
    </div>

    <el-select
      v-model="value"
      placeholder="Select"
      :disabled="parameterDisable"
      @change="select"
    >
      <el-option-group
        v-for="group in options"
        :key="group.label"
        :label="group.label"
      >
        <el-option
          v-for="item in group.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <div
            style="
              display: flex;
              justify-content: flex-end;
              align-items: center;
            "
          >
            <el-image
              style="
                float: right;
                display: inline-block;
                width: 20px;
                height: 20px;
              "
              :src="item.value"
              fit="contain"
            />
          </div>
        </el-option>
      </el-option-group>
    </el-select>

    <div class="slider-block">
      <el-slider
        v-model="verticalBarInfoConfig.x"
        @input="
          (value) => {
            verticalBarInfoConfig.x = parseInt(value);
          }
        "
        :disabled="parameterDisable"
        :max="bannerRectConfig.width"
        :step="1"
      />
      <el-color-picker
        v-model="verticalBarInfoConfig.fill"
        size="small"
        :disabled="parameterDisable"
      />
      <el-button
        size="small"
        :icon="Delete"
        :disabled="parameterDisable && verticalBarInfoConfig.visible"
        @click="
          (evt) => {
            verticalBarInfoConfig.visible = !verticalBarInfoConfig.visible;
          }
        "
      />
    </div>

    <div class="slider-block">
      <el-slider
        :prefix-icon="ZoomIn"
        v-model="factor"
        show-input
        :disabled="parameterDisable"
        @change="handleSlide"
        :max="0.5"
        :step="0.005"
      />
    </div>

    <el-button type="danger" @click="reset" :disabled="parameterDisable">
      Reset
      <el-icon class="el-icon--left">
        <Refresh />
      </el-icon>
    </el-button>
  </div>
</template>

<style scoped>
.inputContainer {
  display: flex;
  width: 800px;
  flex-direction: column;
  justify-content: center;
  margin: 20px;
}
.slider-block {
  display: flex;
  align-items: center;
}
.color-block {
  display: flex;
  align-items: center;
}
</style>
