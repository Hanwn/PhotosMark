<script setup>
import {computed, ref, render, watch} from "vue";
import {defineRender} from "@/store/defineRender";
import {Download } from '@element-plus/icons-vue'
import { h } from 'vue'
import { ElNotification } from 'element-plus'
import {defineImgList, uid2Src} from "@/store/defineImg";
import {notify} from "@/utils/notify";

const {renderCache, currentRenderUid} = defineRender()
const downloadStage = ref()
const disable = ref(true)

const notifyDownloadSuccess = () => {
  ElNotification({
    title: '下载完成',
    position: 'bottom-right',
  })
}

async function download() {
  if (renderCache.size === 1) {
    notify("请上传图片")
    return
  }
  for (let item of renderCache) {
    if (item[0] === 0) {
      continue
    }
    currentRenderUid.value = item[0]
    const outputConfig = {
      "mimeType": "image/jpeg",
      "width": downloadStage.value.width,
      "height": downloadStage.value.height
    }
    let node = await downloadStage.value.getNode()
    let href = node.toDataURL(outputConfig)
    let a = document.createElement("a")
    a.href = href
    a.download = uid2Src.get(currentRenderUid.value).name
    a.click()
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

    <v-stage :config="renderCache.has(currentRenderUid) ? renderCache.get(currentRenderUid).downloadKonvaConfig : {}" ref="downloadStage" id="downloadStage">
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
</template>

<style scoped>
.downloadDiv{
  height: 1px;
  width: 1px;
  overflow: auto;
}
</style>

