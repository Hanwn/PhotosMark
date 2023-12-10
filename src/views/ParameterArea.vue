<script setup>
import { defineRender } from "@/store/defineRender";
import { defineIcon, uid2Src, pushToIconCache } from "@/store/defineImg";
import {
  Aim,
  Calendar,
  Camera,
  Delete,
  InfoFilled,
  Refresh,
} from "@element-plus/icons-vue";
import { onMounted, ref, watch } from "vue";
import {
  allCanvasConfigMap,
  defineCanvasConfig,
} from "@/store/defineCanvasConfig";
import { PreviewRender, SelectIcon, SlideFactor } from "@/themes/renderReouter";
import { defineThemeParameter, factor } from "@/store/defineThemes";
import { useParameterAreaOnMountedHook } from "@/hooks/defineOnMountedHook";

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
  topBannerRectConfig,
  leftBannerRectConfig,
  rightBannerRectConfig,
  mainImgConfig,
} = defineCanvasConfig();

async function reset() {
  if (
    allCanvasConfigMap.has(currentRenderUid.value) &&
    currentRenderUid.value !== 0
  ) {
    const uid = currentRenderUid.value;
    const fileObj = uid2Src.get(uid);
    PreviewRender(uid);
    unMarshal(uid);
  }
}

const value = ref("");
async function select() {
  await SelectIcon(value.value);
}

async function handleSlide(e) {
  const uid = currentRenderUid.value;
  SlideFactor(e);
  unMarshal(uid);
}

const { options, fetchIconList } = useParameterAreaOnMountedHook();

onMounted(() => {
  fetchIconList();
});

const { whiteBoard, privacyMode } = defineThemeParameter();

function selectOtherBanner() {
  if (whiteBoard.value === true) {
    topBannerRectConfig.visible = true;
    leftBannerRectConfig.visible = true;
    rightBannerRectConfig.visible = true;
  } else {
    topBannerRectConfig.visible = false;
    leftBannerRectConfig.visible = false;
    rightBannerRectConfig.visible = false;
  }
}
</script>

<template>
  <div class="parameterContainer">
    <div>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="删除照片exif信息"
        placement="top"
      >
        <el-checkbox
          label="隐私模式"
          :disabled="parameterDisable"
          v-model="privacyMode"
        />
      </el-tooltip>

      <el-tooltip
        class="box-item"
        effect="dark"
        content="为照片添加白边"
        placement="top"
      >
        <el-checkbox
          label="白边"
          :disabled="parameterDisable"
          v-model="whiteBoard"
          @change="selectOtherBanner"
        />
      </el-tooltip>
    </div>
    <div class="inputContainer">
      <div class="color-block">
        <el-input
          v-model="deviceInfoConfig.text"
          class="w-50 m-2"
          placeholder="Device info"
          :prefix-icon="Camera"
          :disabled="parameterDisable"
          clearable
        />
        <el-color-picker
          v-model="deviceInfoConfig.fill"
          size="small"
          :disabled="parameterDisable"
        />
        <el-input-number
          v-model="deviceInfoConfig.fontSize"
          size="small"
          :disabled="parameterDisable"
          :controls="false"
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
          clearable
          :disabled="parameterDisable"
        />
        <el-color-picker
          v-model="lensInfoConfig.fill"
          size="small"
          :disabled="parameterDisable"
        />
        <el-input-number
          v-model="lensInfoConfig.fontSize"
          :disabled="parameterDisable"
          size="small"
          :controls="false"
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
          clearable
        />
        <el-color-picker
          v-model="parameterInfoConfig.fill"
          size="small"
          :disabled="parameterDisable"
        />
        <el-input-number
          v-model="parameterInfoConfig.fontSize"
          :disabled="parameterDisable"
          size="small"
          :controls="false"
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
          clearable
        />
        <el-color-picker
          v-model="timeInfoConfig.fill"
          size="small"
          :disabled="parameterDisable"
        />
        <el-input-number
          v-model="timeInfoConfig.fontSize"
          :disabled="parameterDisable"
          size="small"
          :controls="false"
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
        placeholder="Icon select"
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
          :max="10000"
          :step="1"
        />
        <el-color-picker
          v-model="verticalBarInfoConfig.fill"
          size="small"
          :disabled="parameterDisable"
        />
        <el-input-number
          v-model="verticalBarInfoConfig.width"
          size="small"
          :disabled="parameterDisable"
          :controls="false"
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
  </div>
</template>

<style scoped>
.parameterContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
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
