<template>
  <div id="cvsContainer">
    <div id="innerContainer">
      <v-stage :config="renderList[renderIdx].previewKonvaConfig" ref="stage" id="previewStage">
        <v-layer>
          <v-image :config="renderList[renderIdx].configImg"></v-image>
          <v-group :config="renderList[renderIdx].iconGroupConfig">
            <v-rect :config="renderList[renderIdx].iconRectConfig"></v-rect>
            <v-text :config="renderList[renderIdx].deviceInfoConfig"></v-text>
            <v-text :config="renderList[renderIdx].lensInfoConfig"></v-text>
            <v-image :config="renderList[renderIdx].iconInfoConfig"></v-image>
            <v-rect :config="renderList[renderIdx].verticalBarInfoConfig"></v-rect>
            <v-text :config="renderList[renderIdx].parameterInfoConfig"></v-text>
            <v-text :config="renderList[renderIdx].timeInfoConfig"></v-text>
          </v-group>
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<script setup>
  import {defineRender} from "@/store/defineRender";
  const {renderList, renderIdx}= defineRender()
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
