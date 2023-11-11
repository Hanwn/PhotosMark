import {defineCanvasConfig} from "@/store/defineCanvasConfig";
import {defineRender} from "@/store/defineRender";
import {ref} from "vue";
const {currentRenderUid,marshal} = defineRender()


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

function dragVerticalBarHook(e) {
    verticalBarInfoConfig.x = e.target.attrs.x
    verticalBarInfoConfig.Y = e.target.attrs.y
    marshal(currentRenderUid.value)
}
function dragDeviceInfoHook(e) {
    deviceInfoConfig.x = e.target.attrs.x
    deviceInfoConfig.Y = e.target.attrs.y
    marshal(currentRenderUid.value)
}

function dragLensInfoHook(e) {

    lensInfoConfig.x = e.target.attrs.x
    lensInfoConfig.Y = e.target.attrs.y
    marshal(currentRenderUid.value)

}

function dragTimeInfoHook(e) {
    timeInfoConfig.x = e.target.attrs.x
    timeInfoConfig.Y = e.target.attrs.y
    marshal(currentRenderUid.value)

}
function dragParameterInfoHook(e) {
    parameterInfoConfig.x = e.target.attrs.x
    parameterInfoConfig.Y = e.target.attrs.y
    marshal(currentRenderUid.value)
}

function dragIconInfoHook(e) {
    iconInfoConfig.x = e.target.attrs.x
    iconInfoConfig.y = e.target.attrs.y
    marshal(currentRenderUid.value)
}



function defineDragHooks() {
    return {
        dragTimeInfoHook,
        dragDeviceInfoHook,
        dragParameterInfoHook,
        dragLensInfoHook,
        dragVerticalBarHook,
        dragIconInfoHook,
    }
}

export {defineDragHooks}