<script setup>
import { createCommentVNode, ref } from "vue";
import { defineRender } from "@/store/defineRender";
import { Download } from "@element-plus/icons-vue";
import { uid2Src } from "@/store/defineImg";
import { downloadStatusNotify } from "@/utils/notify";
import {
  allCanvasConfigMap,
  defineCanvasConfig,
} from "@/store/defineCanvasConfig";
const downloadStage = ref();
const disable = ref(true);
const downloadLayer = ref();
const downloadGroup = ref();
const { currentRenderUid, unMarshal, marshal } = defineRender();

const {
  downloadStageConfig,
  mainImgConfig,
  deviceInfoConfig,
  parameterInfoConfig,
  lensInfoConfig,
  timeInfoConfig,
  verticalBarInfoConfig,
  backgroundRectConfig,
  blurRectConfig,
  iconInfoConfig,
  bannerRectConfig,
} = defineCanvasConfig();

async function download() {
  if (allCanvasConfigMap.size === 1) {
    downloadStatusNotify("请上传图片", "error");
    return;
  }

  // dump current preview, in case missing variation
  marshal(currentRenderUid.value);

  for (let item of allCanvasConfigMap) {
    if (item[0] === 0) {
      continue;
    }
    // currentRenderUid.value = item[0]
    const uid = item[0];

    const outputConfig = {
      mimeType: "image/jpeg",
      quality: 1,
      width: downloadGroup.value.width,
      height: downloadGroup.value.height,
    };
    unMarshal(uid);
    let node = await downloadGroup.value.getNode();
    let href = node.toDataURL(outputConfig);
    let a = document.createElement("a");
    a.href = href;
    let picName = "default";
    if (uid2Src.has(uid)) {
      picName = uid2Src.get(uid).name;
    }
    if (!uid2Src.has(uid)) {
      console.log(uid2Src);
      console.log(allCanvasConfigMap);
    }
    a.download = picName;
    a.click();
  }
  // notifyDownloadSuccess()
  downloadStatusNotify("下载成功", "success");
}
</script>

<template>
  <el-button type="primary" @click="download">
    Download
    <el-icon class="el-icon--left">
      <Download />
    </el-icon>
  </el-button>

  <div class="downloadDiv">
    <v-stage
      :config="downloadStageConfig"
      ref="downloadStage"
      id="previewStage"
    >
      <v-layer ref="downloadLayer" :config="{}">
        <v-group ref="downloadGroup">
          <v-group>
            <v-rect :config="backgroundRectConfig"></v-rect>
          </v-group>
          <v-group :config="{}">
            <v-rect :config="bannerRectConfig"></v-rect>
            <v-text :config="deviceInfoConfig"></v-text>
            <v-text :config="lensInfoConfig"></v-text>
            <v-image :config="iconInfoConfig"></v-image>
            <v-rect :config="verticalBarInfoConfig"></v-rect>
            <v-text :config="parameterInfoConfig"></v-text>
            <v-text :config="timeInfoConfig"></v-text>
            <v-rect :config="blurRectConfig"></v-rect>
            <v-image :config="mainImgConfig"></v-image>
          </v-group>
        </v-group>
      </v-layer>
    </v-stage>
  </div>
</template>

<style scoped>
.downloadDiv {
  height: 1px;
  width: 1px;
  overflow: auto;
}
</style>
