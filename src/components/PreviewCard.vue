<template>
  <div id="cvsContainer">
    <div
      id="innerContainer"
      class="inline-flex"
      :style="{
        boxShadow: '0px 0px 10px #000',
      }"
    >
      <v-stage
        :config="previewStageConfig"
        ref="stage"
        id="previewStage"
        @mousedown="handleStageMouseDown"
      >
        <v-layer>
          <v-image :config="mainImgConfig"></v-image>
          <v-group :config="{}">
            <v-rect :config="bannerRectConfig"></v-rect>
            <v-text
              :config="deviceInfoConfig"
              @dragmove="dragMoveDeviceInfoHook"
              @dragEnd="dragEndDeviceInfoHook"
              @transformend="transformerDeviceInfoHook"
              __useStrictMode
            ></v-text>
            <v-text
              :config="lensInfoConfig"
              @dragmove="dragMoveLensInfoHook"
              @dragEnd="dragEndLensInfoHook"
              @transformend="transformerLensInfoHook"
              __useStrictMode
            ></v-text>
            <v-image
              :config="iconInfoConfig"
              @dragEnd="dragEndIconInfoHook"
              @dragmove="dragMoveIconInfoHook"
              @transformend="transformerIconInfoHook"
              __useStrictMode
            ></v-image>
            <v-rect
              :config="verticalBarInfoConfig"
              @dragmove="dragMoveVerticalBarHook"
              @dragEnd="dragEndVerticalBarHook"
              @transformend="transformerVerticalBarHook"
              __useStrictMode
            ></v-rect>
            <v-text
              :config="parameterInfoConfig"
              @dragmove="dragMoveParameterInfoHook"
              @dragEnd="dragEndParameterInfoHook"
              @transformend="transformerParameterInfoHook"
              __useStrictMode
            ></v-text>
            <v-text
              :config="timeInfoConfig"
              @dragmove="dragMoveTimeInfoHook"
              @dragEnd="dragEndTimeInfoHook"
              @transformend="transformerTimeInfoHook"
              __useStrictMode
            ></v-text>
          </v-group>
          <v-transformer ref="transformer" :config="transformerConfig" />
          <v-line :config="alignLineOneThirdConfig"></v-line>
          <v-line :config="alignLineMiddleConfig"></v-line>
          <v-line :config="alignLineTwoThirdConfig"></v-line>
        </v-layer>
      </v-stage>
    </div>
  </div>
  <div>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="30"
      @current-change="sizeChange"
      :disabled="parameterDisable"
      :current-page="themeIdx"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { defineRender } from "@/store/defineRender";
import { defineCanvasConfig } from "@/store/defineCanvasConfig";
import { themeIdx } from "@/store/defineThemes";
import { uid2Src } from "@/store/defineImg";
import { defineDragHooks } from "@/hooks/dragHooks";
import { defineTransformerHooks } from "@/hooks/transformerHooks";
const { currentRenderUid, parameterDisable, unMarshal } = defineRender();

const {
  dragEndVerticalBarHook,
  dragMoveVerticalBarHook,
  dragEndLensInfoHook,
  dragMoveLensInfoHook,
  dragEndTimeInfoHook,
  dragMoveTimeInfoHook,
  dragEndParameterInfoHook,
  dragMoveParameterInfoHook,
  dragEndDeviceInfoHook,
  dragMoveDeviceInfoHook,
  dragEndIconInfoHook,
  dragMoveIconInfoHook,
} = defineDragHooks();

const {
  transformerVerticalBarHook,
  transformerDeviceInfoHook,
  transformerLensInfoHook,
  transformerParameterInfoHook,
  transformerTimeInfoHook,
  transformerIconInfoHook,
  handleStageMouseDown,
  transformer,
} = defineTransformerHooks();

const {
  previewStageConfig,
  mainImgConfig,
  deviceInfoConfig,
  parameterInfoConfig,
  lensInfoConfig,
  timeInfoConfig,
  verticalBarInfoConfig,
  iconInfoConfig,
  bannerRectConfig,
  transformerConfig,
  alignLineMiddleConfig,
  alignLineTwoThirdConfig,
  alignLineOneThirdConfig,
} = defineCanvasConfig();

function sizeChange(e) {
  const uid = currentRenderUid.value;
  if (!uid2Src.has(uid)) {
    return;
  }
  uid2Src.get(uid).renderThemeIdx = e;
  themeIdx.value = e;

  unMarshal(uid);
}
</script>

<style>
#cvsContainer {
  display: flex;
  width: 800px;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  margin: 2rem;
}

#innerContainer {
  display: inline;
}
</style>
