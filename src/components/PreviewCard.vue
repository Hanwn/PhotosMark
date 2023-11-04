<template>
  <div id="cvsContainer">
    <div id="innerContainer">

      <v-stage :config="renderCache.has(currentRenderUid) ? renderCache.get(currentRenderUid).previewKonvaConfig : {}" ref="stage" id="previewStage">
        <v-layer>
          <v-image :config="renderCache.has(currentRenderUid) ? renderCache.get(currentRenderUid).configImg : {}"></v-image>
          <v-group :config="renderCache.has(currentRenderUid) ? renderCache.get(currentRenderUid).iconGroupConfig : {}">
            <v-rect :config="renderCache.has(currentRenderUid) ? renderCache.get(currentRenderUid).iconRectConfig : {}"></v-rect>
            <v-text :config="renderCache.has(currentRenderUid) ? renderCache.get(currentRenderUid).deviceInfoConfig : {}"></v-text>
            <v-text :config="renderCache.has(currentRenderUid) ? renderCache.get(currentRenderUid).lensInfoConfig : {}"></v-text>
            <v-image :config="renderCache.has(currentRenderUid) ? renderCache.get(currentRenderUid).iconInfoConfig : {}"></v-image>
            <v-rect :config="renderCache.has(currentRenderUid) ? renderCache.get(currentRenderUid).verticalBarInfoConfig : {}"></v-rect>
            <v-text :config="renderCache.has(currentRenderUid) ? renderCache.get(currentRenderUid).parameterInfoConfig : {}"></v-text>
            <v-text :config="renderCache.has(currentRenderUid) ? renderCache.get(currentRenderUid).timeInfoConfig : {}"></v-text>
          </v-group>
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<script setup>
  import {defineRender} from "@/store/defineRender";
  const {renderCache, currentRenderUid}= defineRender()
</script>

<style>
#cvsContainer{
  display: flex;
  width: 800px;
  height: 601px;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  margin: 2rem;
}

#innerContainer {
  border: 1px solid black;
  display: inline;
}

</style>
