
import {ref} from 'vue'
import {allCanvasConfigMap} from "@/store/defineCanvasConfig";


function PreviewRenderDefault(uid, img, exifData, iconImg) {
    const rectH = img.height * factor.value
    const rectW = img.width
    const middle = img.height + rectH / 2
    // todo:
    const genMarkInfo = getMarkInfo(exifData, middle, rectW, rectH, img.height, iconImg)
    const renderItem = genRenderItem(img, genMarkInfo)
    allCanvasConfigMap.set(uid, renderItem)
}

export {PreviewRenderDefault}
