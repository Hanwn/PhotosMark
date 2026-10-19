<script setup>
import { nextTick, ref } from "vue";
import { defineRender } from "@/store/defineRender";
import { uid2Src } from "@/store/defineImg";
import { ensureImage, releaseImage } from "@/utils/imageCache";
import { downloadStatusNotify } from "@/utils/notify";
import {
  allCanvasConfigMap,
  defineCanvasConfig,
} from "@/store/defineCanvasConfig";
const downloadGroup = ref();
const exporting = ref(false);
const completed = ref(0);
const total = ref(0);
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
  if (exporting.value) return;
  if (allCanvasConfigMap.size === 1) {
    downloadStatusNotify("请上传图片", "error");
    return;
  }

  const selectedUid = currentRenderUid.value;
  const uids = [...allCanvasConfigMap.keys()].filter((uid) => uid !== 0);
  exporting.value = true;
  completed.value = 0;
  total.value = uids.length;
  marshal(selectedUid);

  try {
    for (const uid of uids) {
      if (!uid2Src.has(uid)) continue;
      try {
        await ensureImage(uid);
        unMarshal(uid);
        await nextTick();

        const node = downloadGroup.value.getNode();
        const canvas = node.toCanvas({ pixelRatio: 1 });
        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", 0.95),
        );
        canvas.width = 0;
        canvas.height = 0;
        if (!blob) throw new Error("Failed to encode image");

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = uid2Src.get(uid).name.replace(/\.[^.]+$/, "") + ".jpg";
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        completed.value += 1;
      } finally {
        if (uid !== selectedUid) {
          mainImgConfig.image = null;
          releaseImage(uid);
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    downloadStatusNotify("下载成功", "success");
  } catch (error) {
    downloadStatusNotify("导出失败，请减少图片数量后重试", "error");
  } finally {
    try {
      if (uid2Src.has(selectedUid)) {
        await ensureImage(selectedUid);
        unMarshal(selectedUid);
      }
    } finally {
      exporting.value = false;
    }
  }
}
</script>

<template>
  <section class="ui-card export-panel"><div><h2>导出照片</h2><p>逐张生成 JPG 文件，照片只在浏览器中处理。</p></div><button class="ui-button ui-button-primary export-button" :disabled="exporting" @click="download">{{ exporting ? `正在导出 ${completed}/${total}` : '↓ 下载全部照片' }}</button><div v-if="exporting" class="progress" role="progressbar" :aria-valuenow="completed" :aria-valuemax="total"><div :style="{ width: `${total ? completed / total * 100 : 0}%` }"></div></div></section>

  <div class="downloadDiv">
    <v-stage
      :config="downloadStageConfig"
    >
      <v-layer :config="{}">
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
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  pointer-events: none;
}
.export-panel { padding: 20px 22px; display: grid; gap: 16px; }
.export-panel h2 { margin: 0; font-size: 15px; }
.export-panel p { margin: 7px 0 0; color: var(--muted-foreground); font-size: 12px; line-height: 1.5; }
.export-button { width: 100%; }
.progress { height: 5px; border-radius: 9px; background: var(--muted); overflow: hidden; }
.progress div { height: 100%; background: var(--foreground); transition: width .2s; }
</style>
