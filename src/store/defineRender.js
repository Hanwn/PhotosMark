import {ref, watch, watchEffect} from "vue";
import {allCanvasConfigMap, defineCanvasConfig} from "@/store/defineCanvasConfig";

const currentRenderUid = ref(0)
const resetBtn = ref(false)
const parameterDisable = ref(true)

const {
    previewStageConfig,
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

// dump
function marshal(oldVal) {
    if (!allCanvasConfigMap.has(oldVal)) {
        return
    }
    const currentRenderCanvasConfig = allCanvasConfigMap.get(oldVal)
    Object.assign(currentRenderCanvasConfig.previewStageConfig, previewStageConfig)
    Object.assign(currentRenderCanvasConfig.downloadStageConfig, downloadStageConfig)
    Object.assign(currentRenderCanvasConfig.mainImgConfig, mainImgConfig)
    Object.assign(currentRenderCanvasConfig.deviceInfoConfig, deviceInfoConfig)
    Object.assign(currentRenderCanvasConfig.iconInfoConfig, iconInfoConfig)
    Object.assign(currentRenderCanvasConfig.parameterInfoConfig, parameterInfoConfig)
    Object.assign(currentRenderCanvasConfig.timeInfoConfig, timeInfoConfig)
    Object.assign(currentRenderCanvasConfig.lensInfoConfig, lensInfoConfig)
    Object.assign(currentRenderCanvasConfig.verticalBarInfoConfig, verticalBarInfoConfig)
    Object.assign(currentRenderCanvasConfig.bannerRectConfig, bannerRectConfig)
}

// load
function unMarshal(newVal) {
    if (!allCanvasConfigMap.has(newVal)){
        return
    }
    const currentRenderCanvasConfig = allCanvasConfigMap.get(newVal)
    const scaleX = currentRenderCanvasConfig.previewStageConfig.scaleX
    const scaleY = currentRenderCanvasConfig.previewStageConfig.scaleY

    Object.assign(previewStageConfig, currentRenderCanvasConfig.previewStageConfig)
    Object.assign(downloadStageConfig, currentRenderCanvasConfig.downloadStageConfig)
    Object.assign(mainImgConfig, currentRenderCanvasConfig.mainImgConfig)
    Object.assign(deviceInfoConfig, currentRenderCanvasConfig.deviceInfoConfig)
    Object.assign(iconInfoConfig, currentRenderCanvasConfig.iconInfoConfig)
    Object.assign(parameterInfoConfig, currentRenderCanvasConfig.parameterInfoConfig)
    Object.assign(timeInfoConfig, currentRenderCanvasConfig.timeInfoConfig)
    Object.assign(lensInfoConfig, currentRenderCanvasConfig.lensInfoConfig)
    Object.assign(verticalBarInfoConfig, currentRenderCanvasConfig.verticalBarInfoConfig)
    Object.assign(bannerRectConfig, currentRenderCanvasConfig.bannerRectConfig)
}


function defineRender() {
    return {currentRenderUid, unMarshal, marshal, parameterDisable}
}

export {defineRender}
