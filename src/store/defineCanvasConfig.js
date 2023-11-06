import {ref, reactive, watchEffect} from 'vue'
import {getInitData} from "@/utils/constInfo";

const previewStageConfig = reactive({
    width: 800,
    height: 600,
    scaleX:1,
    scaleY:1
})

const downloadStageConfig = reactive({
    width : 100,
    height : 200,
    visible: true
})

const mainImgConfig = reactive({
    image: null,
    scaleX:1,
    scaleY:1
})

const iconGroupConfig =  reactive({})

const bannerRectConfig = reactive({
    height : 100,
    width : 100,
    y : 100,
    fill : "white",
    scaleX:1,
    scaleY:1
})
const deviceInfoConfig = reactive({
    x:100,
    y:0,
    text:"",
    fontSize:0,
    fontStyle:"bold",
    offsetY:0,
    fill:"black",
    draggable:true,
    scaleX:1,
    scaleY:1
})
const lensInfoConfig = reactive({
    x:100,
    y:0,
    text:"",
    fontSize:0,
    offsetY:0,
    fontStyle:"normal",
    align:"center",
    fill:"gray",
    draggable:true,
    scaleX:1,
    scaleY:1
})
const iconInfoConfig = reactive({
    image: null,
    x: 0,
    y:0,
    height:0,
    width:0,
    scaleX:1,
    scaleY:1
})
const verticalBarInfoConfig = reactive({
    x: 0,
    y: 0,
    width:5,
    height:0,
    fill: "gray",
    scaleX:1,
    scaleY:1
})

const parameterInfoConfig = reactive({
    x:100,
    y:0,
    text:"",
    fontSize:0,
    fontStyle:"bold",
    align:"center",
    offsetY:0,
    verticalAlign:"middle",
    fill:"black",
    draggable:true,
    scaleX:1,
    scaleY:1
})
const timeInfoConfig = reactive({
    x:100,
    y:0,
    text:"",
    fontSize:0,
    fontStyle:"normal",
    align:"center",
    verticalAlign:"middle",
    offsetY:0,
    fill:"gray",
    draggable:true,
    scaleX:1,
    scaleY:1
})

const initData = getInitData()
const allCanvasConfigMap = new Map()
allCanvasConfigMap.set(0, initData)


function defineCanvasConfig() {
    return {
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
    }
}

export {defineCanvasConfig, allCanvasConfigMap}