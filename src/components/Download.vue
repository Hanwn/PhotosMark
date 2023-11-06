<script setup>
import {ref} from "vue";
import {defineRender} from "@/store/defineRender";
import {Download } from '@element-plus/icons-vue'
import {uid2Src} from "@/store/defineImg";
import {notify} from "@/utils/notify";
import {allCanvasConfigMap, defineCanvasConfig} from "@/store/defineCanvasConfig";
const downloadStage = ref()
const disable = ref(true)
const {currentRenderUid}= defineRender()

const {
  downloadStageConfig,
  mainImgConfig,
  deviceInfoConfig,
  parameterInfoConfig,
  lensInfoConfig,
  timeInfoConfig,
  verticalBarInfoConfig,
  iconInfoConfig,
  bannerRectConfig,
} = defineCanvasConfig()

async function download() {
  if (allCanvasConfigMap.size === 1) {
    notify("请上传图片")
    return
  }
  for (let item of allCanvasConfigMap) {
    if (item[0] === 0) {
      continue
    }
    currentRenderUid.value = item[0]
    setTimeout(async ()=>{
      const outputConfig = {
        "mimeType": "image/jpeg",
        "width": downloadStage.value.width,
        "height": downloadStage.value.height
      }
      console.log(outputConfig)
      let node = await downloadStage.value.getNode()
      let href = node.toDataURL(outputConfig)
      let a = document.createElement("a")
      a.href = href
      a.download = uid2Src.get(currentRenderUid.value).name
      a.click()
    }, 1)
  }
  // notifyDownloadSuccess()
  notify("下载成功")
}
</script>

<template>
  <el-button type="primary" @click="download">
    Download
    <el-icon class="el-icon--left">
      <Download/>
    </el-icon>
  </el-button>

  <div class="downloadDiv">
    <v-stage :config="downloadStageConfig" ref="downloadStage" id="previewStage">
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
</template>

<style scoped>
.downloadDiv{
  height: 1px;
  width: 1px;
  overflow: auto;
}
</style>

