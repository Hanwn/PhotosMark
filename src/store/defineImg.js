import {reactive} from "vue";
import {defineRender} from "@/store/defineRender";

const imgSrcList = reactive([])
const iconCache = reactive(new Map())

function pushToImgList(src) {
    imgSrcList.push(src)
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

export {defineImgList, defineIcon, pushToImgList, pushToIconCache}
