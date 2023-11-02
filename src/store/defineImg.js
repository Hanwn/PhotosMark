import {reactive} from "vue";
import {defineRender} from "@/store/defineRender";

const imgSrcList = reactive([])
const iconCache = reactive(new Map())
const exifCache = reactive(new Map())
const id2Src = reactive(new Map())

function pushToImgList(src) {
    imgSrcList.push(src)
}

function pushToID2Src(id, src) {
    id2Src.set(id, src)
}

function pushToExifCache(src, exifData) {
    exifCache.set(src, exifData)
}

function pushToIconCache(src, iconImg) {
    iconCache.set(src, iconImg)
}

function clickImg(idx) {
    const {setRenderIdx} = defineRender()
    setRenderIdx(idx + 1)
}


function defineImgList() {
    return {
        imgSrcList,
        clickImg
    }
}

function defineIcon() {
    return {
        iconCache
    }
}

function defineExifCache() {
    return {
        exifCache
    }
}

function defineId2Src() {
    return {
        id2Src
    }
}

export {defineImgList, defineIcon, defineExifCache, id2Src, pushToImgList, pushToIconCache, pushToExifCache, pushToID2Src}
