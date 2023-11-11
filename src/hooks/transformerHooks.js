import {defineCanvasConfig} from "@/store/defineCanvasConfig";
import {defineRender} from "@/store/defineRender";
import {ref} from "vue";
const {currentRenderUid,marshal} = defineRender()
const transformer = ref()


const {
    deviceInfoConfig,
    parameterInfoConfig,
    lensInfoConfig,
    timeInfoConfig,
    verticalBarInfoConfig,
    iconInfoConfig,
} = defineCanvasConfig()

function transformerVerticalBarHook(e) {
    for (let key in verticalBarInfoConfig) {
        verticalBarInfoConfig[key] = e.target.attrs[key]
    }
    marshal(currentRenderUid.value)
}
function transformerDeviceInfoHook(e) {
    for (let key in deviceInfoConfig) {
        deviceInfoConfig[key] = e.target.attrs[key]
    }
    marshal(currentRenderUid.value)
}

function transformerLensInfoHook(e) {
    for (let key in lensInfoConfig) {
        lensInfoConfig[key] = e.target.attrs[key]
    }
    marshal(currentRenderUid.value)

}

function transformerTimeInfoHook(e) {
    for (let key in timeInfoConfig) {
        timeInfoConfig[key] = e.target.attrs[key]
    }
    marshal(currentRenderUid.value)

}
function transformerParameterInfoHook(e) {
    for (let key in parameterInfoConfig) {
        parameterInfoConfig[key] = e.target.attrs[key]
    }
    marshal(currentRenderUid.value)
}

function transformerIconInfoHook(e) {
    for (let key in iconInfoConfig) {
        iconInfoConfig[key] = e.target.attrs[key]
    }
    marshal(currentRenderUid.value)
}

function handleStageMouseDown(e) {
    const selectName = new Map([
        ["timeInfo", ""],
        ["deviceInfo", ""],
        ["lensInfo", ""],
        ["parameterInfo",""],
        ["iconInfo", ""],
        ["verticalBarInfo", ""]
    ])

    const name = e.target.name();
    const transformerNode = transformer.value.getNode()
    if (name.length === 0){
        transformerNode.nodes([])
        return
    }
    if (selectName.has(name)) {
        const stage = transformerNode.getStage()
        const selectNode = stage.findOne('.' + name)
        transformerNode.nodes([selectNode])
    }
}


function defineTransformerHooks() {
    return {
        transformerTimeInfoHook,
        transformerDeviceInfoHook,
        transformerParameterInfoHook,
        transformerLensInfoHook,
        transformerVerticalBarHook,
        transformerIconInfoHook,
        handleStageMouseDown,
        transformer,
    }
}

export {defineTransformerHooks}
