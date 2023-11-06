import {ref, watch, watchEffect} from "vue";
import {allCanvasConfigMap, defineCanvasConfig} from "@/store/defineCanvasConfig";

const currentRenderUid = ref(0)

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


// watchEffect(()=>{
//     console.log("r")
//     if (currentRenderUid.value === 0) {
//         return
//     }
//     allCanvasConfigMap.get(currentRenderUid.value).deviceInfoConfig.text = deviceInfoConfig.text
// })

watch(currentRenderUid, (newVal,oldVal)=>{
    if (!allCanvasConfigMap.has(newVal)) {
        return
    }
    const currentRenderCanvasConfig = allCanvasConfigMap.get(newVal)
    const scaleX = currentRenderCanvasConfig.previewStageConfig.scaleX
    const scaleY = currentRenderCanvasConfig.previewStageConfig.scaleY

    downloadStageConfig.width = currentRenderCanvasConfig.downloadStageConfig.width
    downloadStageConfig.height = currentRenderCanvasConfig.downloadStageConfig.height

    previewStageConfig.scaleX = currentRenderCanvasConfig.previewStageConfig.scaleX
    previewStageConfig.scaleY = currentRenderCanvasConfig.previewStageConfig.scaleY
    previewStageConfig.width = currentRenderCanvasConfig.previewStageConfig.width
    previewStageConfig.height = currentRenderCanvasConfig.previewStageConfig.height

    // downloadStageConfig
    mainImgConfig.image = currentRenderCanvasConfig.mainImgConfig.image

    deviceInfoConfig.text = currentRenderCanvasConfig.deviceInfoConfig.text
    deviceInfoConfig.x = currentRenderCanvasConfig.deviceInfoConfig.x
    deviceInfoConfig.y = currentRenderCanvasConfig.deviceInfoConfig.y
    deviceInfoConfig.fontSize = currentRenderCanvasConfig.deviceInfoConfig.fontSize
    deviceInfoConfig.fontStyle = currentRenderCanvasConfig.deviceInfoConfig.fontStyle
    deviceInfoConfig.offsetY = currentRenderCanvasConfig.deviceInfoConfig.offsetY
    deviceInfoConfig.fill = currentRenderCanvasConfig.deviceInfoConfig.fill
    deviceInfoConfig.draggable = currentRenderCanvasConfig.deviceInfoConfig.draggable

    parameterInfoConfig.text = currentRenderCanvasConfig.parameterInfoConfig.text
    parameterInfoConfig.x = currentRenderCanvasConfig.parameterInfoConfig.x
    parameterInfoConfig.y = currentRenderCanvasConfig.parameterInfoConfig.y
    parameterInfoConfig.fontStyle = currentRenderCanvasConfig.parameterInfoConfig.fontStyle
    parameterInfoConfig.fontSize = currentRenderCanvasConfig.parameterInfoConfig.fontSize
    parameterInfoConfig.offsetY = currentRenderCanvasConfig.parameterInfoConfig.offsetY
    parameterInfoConfig.fill = currentRenderCanvasConfig.parameterInfoConfig.fill
    parameterInfoConfig.draggable = currentRenderCanvasConfig.parameterInfoConfig.draggable

    timeInfoConfig.text = currentRenderCanvasConfig.timeInfoConfig.text
    timeInfoConfig.x = currentRenderCanvasConfig.timeInfoConfig.x
    timeInfoConfig.y = currentRenderCanvasConfig.timeInfoConfig.y
    timeInfoConfig.fontStyle = currentRenderCanvasConfig.timeInfoConfig.fontStyle
    timeInfoConfig.fontSize = currentRenderCanvasConfig.timeInfoConfig.fontSize
    timeInfoConfig.offsetY = currentRenderCanvasConfig.timeInfoConfig.offsetY
    timeInfoConfig.fill = currentRenderCanvasConfig.timeInfoConfig.fill
    timeInfoConfig.draggable = currentRenderCanvasConfig.timeInfoConfig.draggable

    lensInfoConfig.text = currentRenderCanvasConfig.lensInfoConfig.text
    lensInfoConfig.x = currentRenderCanvasConfig.lensInfoConfig.x
    lensInfoConfig.y = currentRenderCanvasConfig.lensInfoConfig.y
    lensInfoConfig.fontStyle = currentRenderCanvasConfig.lensInfoConfig.fontStyle
    lensInfoConfig.fontSize = currentRenderCanvasConfig.lensInfoConfig.fontSize
    lensInfoConfig.offsetY = currentRenderCanvasConfig.lensInfoConfig.offsetY
    lensInfoConfig.fill = currentRenderCanvasConfig.lensInfoConfig.fill
    lensInfoConfig.draggable = currentRenderCanvasConfig.lensInfoConfig.draggable

    verticalBarInfoConfig.x = currentRenderCanvasConfig.verticalBarInfoConfig.x
    verticalBarInfoConfig.y = currentRenderCanvasConfig.verticalBarInfoConfig.y
    verticalBarInfoConfig.width = currentRenderCanvasConfig.verticalBarInfoConfig.width
    verticalBarInfoConfig.height = currentRenderCanvasConfig.verticalBarInfoConfig.height
    verticalBarInfoConfig.fill = currentRenderCanvasConfig.verticalBarInfoConfig.fill

    iconInfoConfig.image = currentRenderCanvasConfig.iconInfoConfig.image
    iconInfoConfig.x = currentRenderCanvasConfig.iconInfoConfig.x
    iconInfoConfig.y = currentRenderCanvasConfig.iconInfoConfig.y
    iconInfoConfig.height = currentRenderCanvasConfig.iconInfoConfig.height
    iconInfoConfig.width = currentRenderCanvasConfig.iconInfoConfig.width

    bannerRectConfig.height = currentRenderCanvasConfig.bannerRectConfig.height
    bannerRectConfig.width = currentRenderCanvasConfig.bannerRectConfig.width
    bannerRectConfig.x = currentRenderCanvasConfig.bannerRectConfig.x
    bannerRectConfig.y = currentRenderCanvasConfig.bannerRectConfig.y
    bannerRectConfig.fill = currentRenderCanvasConfig.bannerRectConfig.fill

})

function defineRender() {
    return {currentRenderUid}
}

export {defineRender}
