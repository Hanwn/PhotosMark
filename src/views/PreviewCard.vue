<template>
  <div id="previewStage">
    <div id="cvsContainer">
      <div id="innerContainer" ref="innerContainer" :style="{ '--preview-scale': previewScale }">
        <div v-if="parameterDisable" class="empty-preview"><strong>预览将在这里显示</strong><span>添加一张照片，开始制作水印</span></div>
        <v-stage
          v-if="!parameterDisable"
          :config="previewStageConfig"
          ref="stage"
          @mousedown="handleStageMouseDown"
          @pointerdown="onPointerDown"
        >
          <v-layer>
            <v-group :config="previewGroupConfig">
              <v-group>
                <v-rect
                  :config="backgroundRectConfig"
                  @pointermove="resetDragCursor"
                  @transform="transformerBackgroundRectHook"
                  @transformend="transformerBackgroundRectEnd"
                ></v-rect>
              </v-group>

              <v-group :config="{}">
                <v-rect
                  :config="bannerRectConfig"
                  @transformend="transformerBannerEnd"
                  __useStrictMode
                ></v-rect>
                <v-text
                  :config="deviceInfoConfig"
                  @pointermove="setDragCursor"
                  __useStrictMode
                ></v-text>
                <v-text
                  :config="lensInfoConfig"
                  @pointermove="setDragCursor"
                  __useStrictMode
                ></v-text>
                <v-image
                  :config="iconInfoConfig"
                  @pointermove="setDragCursor"
                  @transform="transformerIconInfoHook"
                  __useStrictMode
                ></v-image>
                <v-rect
                  :config="verticalBarInfoConfig"
                  @pointermove="setDragCursor"
                  __useStrictMode
                ></v-rect>
                <v-text
                  :config="parameterInfoConfig"
                  @pointermove="setDragCursor"
                  __useStrictMode
                ></v-text>
                <v-text
                  :config="timeInfoConfig"
                  @pointermove="setDragCursor"
                  __useStrictMode
                ></v-text>
                <v-circle
                  :config="{
                    x: parameterInfoConfig.x,
                    y: parameterInfoConfig.y,
                    radius: 70,
                    fill: 'red',
                    stroke: 'black',
                    strokeWidth: 4,
                    visible: false,
                  }"
                ></v-circle>
                <v-rect :config="blurRectConfig" @pointermove="setDragCursor"></v-rect>
                <v-image :config="mainImgConfig" @pointermove="setDragCursor"></v-image>
              </v-group>
              <v-transformer ref="transformer" :config="transformerConfig" />
              <v-transformer
                ref="borderTransformer"
                :config="borderTransformerConfig"
              />
              <v-transformer
                ref="bannerTransformer"
                :config="bannerTransformerConfig"
              >
              </v-transformer>
              <v-transformer
                ref="backgroundTransformer"
                :config="backgroundTransformerConfig"
              >
              </v-transformer>
              <v-line :config="alignLineOneThirdConfig"></v-line>
              <v-line :config="alignLineMiddleConfig"></v-line>
              <v-line :config="alignLineTwoThirdConfig"></v-line>
              <v-line :config="alignLineVerticalConfig"></v-line>
              <v-line v-for="(line, index) in equalGapLineConfigs" :key="`gap-${index}`" :config="line"></v-line>
              <v-line :config="debugConfig"></v-line>
            </v-group>
          </v-layer>
        </v-stage>
      </div>
    </div>
    <div v-if="!parameterDisable" class="theme-picker" aria-label="水印主题"><span>主题</span><button v-for="theme in themes" :key="theme.id" class="ui-button" :class="{ selected: themeIdx === theme.id }" @click="sizeChange(theme.id)">{{ theme.name }}</button></div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { defineRender } from "@/store/defineRender";
import { defineCanvasConfig, syncBannerWidthToFrame } from "@/store/defineCanvasConfig";
import { themeIdx } from "@/store/defineThemes";
import { uid2Src } from "@/store/defineImg";
import { useCanvasDrag } from "@/hooks/dragHooks";
import { defineTransformerHooks } from "@/hooks/transformerHooks";
import { PreviewRender } from "@/themes/renderReouter";
import { themes } from "@/themes/registry";
const { currentRenderUid, parameterDisable, unMarshal } = defineRender();
const innerContainer = ref(null);
const previewScale = ref(1);
let resizeObserver;

onMounted(() => {
  resizeObserver = new ResizeObserver(([entry]) => {
    previewScale.value = entry.contentRect.width / 1200;
  });
  resizeObserver.observe(innerContainer.value);
});
onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  onPointerUp();
});

const debugConfig = ref({
  points: [0, 0, 5000, 5000],
  draggable: true,
  stroke: "black",
  strokeWidth: 10,
  visible: false,
});

const { onPointerDown, onPointerUp } = useCanvasDrag(previewScale);
function setDragCursor(e) {
  e.target.getStage().container().style.cursor = "grab";
}
function resetDragCursor(e) {
  e.target.getStage().container().style.cursor = "";
}

const {
  transformerIconInfoHook,
  transformerBackgroundRectHook,
  transformerBackgroundRectEnd,
  transformerBannerEnd,
  handleStageMouseDown,
  transformer,
  borderTransformer,
  bannerTransformer,
  backgroundTransformer,
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
  backgroundRectConfig,
  blurRectConfig,
  transformerConfig,
  borderTransformerConfig,
  bannerTransformerConfig,
  backgroundTransformerConfig,
  alignLineMiddleConfig,
  alignLineTwoThirdConfig,
  alignLineOneThirdConfig,
  alignLineVerticalConfig,
  equalGapLineConfigs,
} = defineCanvasConfig();

function sizeChange(e) {
  const uid = currentRenderUid.value;
  if (!uid2Src.has(uid) || themeIdx.value === e) {
    return;
  }
  const photoWidth = mainImgConfig.image?.width || 0;
  const frameMargins = {
    left: mainImgConfig.x - backgroundRectConfig.x,
    right: backgroundRectConfig.x + backgroundRectConfig.width * backgroundRectConfig.scaleX - mainImgConfig.x - photoWidth,
    top: mainImgConfig.y - backgroundRectConfig.y,
  };
  uid2Src.get(uid).renderThemeIdx = e;
  themeIdx.value = e;
  PreviewRender(uid);
  unMarshal(uid);
  if (photoWidth) {
    backgroundRectConfig.x = mainImgConfig.x - frameMargins.left;
    backgroundRectConfig.y = mainImgConfig.y - frameMargins.top;
    backgroundRectConfig.width = photoWidth + frameMargins.left + frameMargins.right;
    backgroundRectConfig.height = bannerRectConfig.y + bannerRectConfig.height - backgroundRectConfig.y;
    backgroundRectConfig.scaleX = 1;
    backgroundRectConfig.scaleY = 1;
    syncBannerWidthToFrame(backgroundRectConfig.visible);
  }
}
</script>

<style>
#previewStage {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  width: 100%;
}
#cvsContainer {
  width: 100%;
  min-width: 0;
  overflow: hidden;
  padding: 18px;
  display: flex;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--preview-shell);
}
#innerContainer {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  width: 100%;
  max-width: 1200px;
  aspect-ratio: 3 / 2;
  background: var(--preview-stage);
  overflow: hidden;
}
.empty-preview { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: var(--preview-empty); pointer-events: none; }
.empty-preview strong { font-size: 16px; }
.empty-preview span { font-size: 12px; color: var(--preview-empty-subtle); }
#innerContainer .konvajs-content { transform: scale(var(--preview-scale)); transform-origin: top left; }
.theme-picker { display: flex; align-items: center; gap: 8px; padding: 14px 0 0; align-self: start; font-size: 12px; color: var(--muted-foreground); }
.theme-picker .selected { background: var(--foreground); color: var(--background); border-color: var(--foreground); }
@media (max-width: 650px) { #cvsContainer { padding: 8px; } }
</style>
