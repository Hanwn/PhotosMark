<template>
  <div id="cvsContainer">
    <div id="innerContainer"
          class="inline-flex"
          :style="{
            boxShadow: '0px 0px 10px #000'
          }"
    >
      <v-stage :config="previewStageConfig" ref="stage" id="previewStage">
        <v-layer>
          <v-image :config="mainImgConfig"></v-image>
          <v-group :config="{}">
            <v-rect :config="bannerRectConfig"></v-rect>
            <v-text :config="deviceInfoConfig"></v-text>
            <v-text :config="lensInfoConfig"></v-text>
            <v-image :config="iconInfoConfig"></v-image>
            <v-rect :config="verticalBarInfoConfig"></v-rect>
            <v-text :config="parameterInfoConfig"></v-text>
            <v-text :config="timeInfoConfig"></v-text>
          </v-group>
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<script setup>
  import {defineRender} from "@/store/defineRender";
  import {defineCanvasConfig} from "@/store/defineCanvasConfig";
  const {currentRenderUid}= defineRender()

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
  } = defineCanvasConfig()

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
