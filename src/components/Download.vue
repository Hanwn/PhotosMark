<script setup>
import {ref} from "vue";
import {defineRender} from "@/store/defineRender";
const {renderList, renderIdx} = defineRender()

const downloadStage = ref()

async function download() {
  renderIdx.value = 1
  for (let i = 1; i < renderList.length; i++) {
    const idx = renderIdx.value
    const outputConfig = {
      "mimeType": "image/jpeg",
      "width": downloadStage.value.width,
      "height": downloadStage.value.height
    }
    let node = await downloadStage.value.getNode()
    let href = node.toDataURL(outputConfig)
    let a = document.createElement("a")
    a.href = href
    a.download = "xx" + i
    a.click()
    renderIdx.value = idx + 1
  }
}
</script>

<template>
  <input type="button" @click="download" value="下载">

  <div class="downloadDiv">
    <v-stage :config="renderList[renderIdx].downloadKonvaConfig" ref="downloadStage" id="downloadStage">
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
</template>

<style scoped>
.downloadDiv{
  height: 1px;
  width: 1px;
  overflow: auto;
}
</style>

