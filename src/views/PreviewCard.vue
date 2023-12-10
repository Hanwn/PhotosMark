<template>
  <div id="previewStage">
    <div id="cvsContainer">
      <div id="innerContainer" class="inline-flex" :style="{}">
        <v-stage
          :config="previewStageConfig"
          ref="stage"
          id="previewStage"
          @mousedown="handleStageMouseDown"
        >
          <v-layer>
            <v-group :config="previewGroupConfig">
              <v-group>
                <v-rect :config="topBannerRectConfig"></v-rect>
                <v-rect :config="leftBannerRectConfig"></v-rect>
                <v-rect :config="rightBannerRectConfig"></v-rect>
              </v-group>

              <v-image :config="mainImgConfig"></v-image>
              <v-group :config="{}">
                <v-rect :config="bannerRectConfig"></v-rect>
                <v-text
                  :config="deviceInfoConfig"
                  @dragmove="dragMoveDeviceInfoHook"
                  @dragEnd="dragEndDeviceInfoHook"
                  __useStrictMode
                ></v-text>
                <v-text
                  :config="lensInfoConfig"
                  @dragmove="dragMoveLensInfoHook"
                  @dragEnd="dragEndLensInfoHook"
                  __useStrictMode
                ></v-text>
                <v-image
                  :config="iconInfoConfig"
                  @dragEnd="dragEndIconInfoHook"
                  @dragmove="dragMoveIconInfoHook"
                  __useStrictMode
                ></v-image>
                <v-rect
                  :config="verticalBarInfoConfig"
                  @dragmove="dragMoveVerticalBarHook"
                  @dragEnd="dragEndVerticalBarHook"
                  __useStrictMode
                ></v-rect>
                <v-text
                  :config="parameterInfoConfig"
                  @dragmove="dragMoveParameterInfoHook"
                  @dragEnd="dragEndParameterInfoHook"
                  __useStrictMode
                ></v-text>
                <v-text
                  :config="timeInfoConfig"
                  @dragmove="dragMoveTimeInfoHook"
                  @dragEnd="dragEndTimeInfoHook"
                  __useStrictMode
                ></v-text>
              </v-group>
              <v-transformer ref="transformer" :config="transformerConfig" />
              <v-transformer
                ref="borderTransformer"
                :config="borderTransformerConfig"
              />
              <v-line :config="alignLineOneThirdConfig"></v-line>
              <v-line :config="alignLineMiddleConfig"></v-line>
              <v-line :config="alignLineTwoThirdConfig"></v-line>
              <v-line :config="debugConfig"></v-line>
            </v-group>
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
        :disabled="true"
        :current-page="themeIdx"
      />
    </div>
    <!--    <div>-->
    <!--      <el-rate v-model="value1" />-->
    <!--    </div>-->
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

const debugConfig = ref({
  points: [0, 0, 5000, 5000],
  draggable: true,
  stroke: "black",
  strokeWidth: 10,
  visible: false,
});

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
  previewGroupConfig,
  deviceInfoConfig,
  parameterInfoConfig,
  lensInfoConfig,
  timeInfoConfig,
  verticalBarInfoConfig,
  iconInfoConfig,
  bannerRectConfig,
  topBannerRectConfig,
  leftBannerRectConfig,
  rightBannerRectConfig,
  transformerConfig,
  borderTransformerConfig,
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
#previewStage {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#cvsContainer {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  margin: 2rem;
}

#innerContainer {
  background: #808080;
}
</style>
