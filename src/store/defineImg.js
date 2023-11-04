import {ref, reactive, computed, watch} from "vue";
import {defineRender} from "@/store/defineRender";

const imgSrcList = ref([])
const iconCache = reactive(new Map())
const exifCache = reactive(new Map())
// const uid2Src = reactive(new Map())

// watch(imgSrcList, ()=>{
//     for (let i in imgSrcList) {
//         console.log(i)
//     }
// })


function pushToImgList(src) {
    imgSrcList.value.push({name:src, URL:src})
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


export {defineImgList, defineIcon, defineExifCache, pushToImgList, pushToIconCache, pushToExifCache}
