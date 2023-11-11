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
    for (let key in verticalBarInfoConfig) {
        verticalBarInfoConfig[key] = e.target.attrs[key]
    }
    marshal(currentRenderUid.value)
}
function dragDeviceInfoHook(e) {
    for (let key in deviceInfoConfig) {
        deviceInfoConfig[key] = e.target.attrs[key]
    }
    marshal(currentRenderUid.value)
}

function dragLensInfoHook(e) {
    for (let key in lensInfoConfig) {
        lensInfoConfig[key] = e.target.attrs[key]
    }
    marshal(currentRenderUid.value)

}

function dragTimeInfoHook(e) {
    for (let key in timeInfoConfig) {
        timeInfoConfig[key] = e.target.attrs[key]
    }
    marshal(currentRenderUid.value)

}
function dragParameterInfoHook(e) {
    for (let key in parameterInfoConfig) {
        parameterInfoConfig[key] = e.target.attrs[key]
    }
    marshal(currentRenderUid.value)
}

function dragIconInfoHook(e) {
    for (let key in iconInfoConfig) {
        iconInfoConfig[key] = e.target.attrs[key]
    }
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