<template>
  <div id="cvsContainer">
    <div id="innerContainer"
          class="inline-flex"
          :style="{
            boxShadow: '0px 0px 10px #000'
          }"
    >
      <v-stage :config="previewStageConfig"  ref="stage" id="previewStage" @mousedown="handleStageMouseDown">
        <v-layer>
          <v-image :config="mainImgConfig"></v-image>
          <v-group :config="{}">
            <v-rect :config="bannerRectConfig"></v-rect>
            <v-text :config="deviceInfoConfig" @dragEnd="dragDeviceInfoHook" @transformend="transformerDeviceInfoHook"></v-text>
            <v-text :config="lensInfoConfig" @dragEnd="dragLensInfoHook" @transformend="transformerLensInfoHook"></v-text>
            <v-image :config="iconInfoConfig" @dragEnd="dragIconInfoHook" @transformend="transformerIconInfoHook"></v-image>
            <v-rect :config="verticalBarInfoConfig" @dragEnd="dragVerticalBarHook" @transformend="transformerVerticalBarHook"></v-rect>
            <v-text :config="parameterInfoConfig" @dragEnd="dragParameterInfoHook" @transformend="transformerParameterInfoHook"></v-text>
            <v-text :config="timeInfoConfig" @dragEnd="dragTimeInfoHook" @transformend="transformerTimeInfoHook"></v-text>
          </v-group>
          <v-transformer ref="transformer" :config="transformerConfig" />
        </v-layer>
      </v-stage>
    </div>
  </div>
  <div>
    <el-pagination background layout="prev, pager, next" :total="30" @current-change="sizeChange" :disabled="parameterDisable" :current-page="themeIdx"/>
  </div>
</template>

<script setup>
  import {ref} from 'vue'
  import {defineRender} from "@/store/defineRender";
  import {defineCanvasConfig} from "@/store/defineCanvasConfig";
  import {themeIdx} from "@/store/defineThemes";
  import {uid2Src} from "@/store/defineImg";
  import {defineDragHooks} from "@/hooks/dragHooks";
  import {defineTransformerHooks} from "@/hooks/transformerHooks";
  const {currentRenderUid, parameterDisable, unMarshal}= defineRender()

  const {
    dragVerticalBarHook,
    dragLensInfoHook,
    dragTimeInfoHook,
    dragParameterInfoHook,
    dragDeviceInfoHook,
    dragIconInfoHook,
  } = defineDragHooks()

  const {
    transformerVerticalBarHook,
    transformerDeviceInfoHook,
    transformerLensInfoHook,
    transformerParameterInfoHook,
    transformerTimeInfoHook,
    transformerIconInfoHook,
    handleStageMouseDown,
    transformer
  } = defineTransformerHooks()


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
  } = defineCanvasConfig()

  function sizeChange(e) {
    const uid = currentRenderUid.value
    if (!uid2Src.has(uid)) {
      return
    }
    uid2Src.get(uid).renderThemeIdx = e
    themeIdx.value = e

    unMarshal(uid)
  }

</script>

<style>
#cvsContainer{
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
