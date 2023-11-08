import {genRenderItem, getMarkInfo} from "@/themes/mi/parameterInfoConfig";
import {allCanvasConfigMap} from "@/store/defineCanvasConfig";
import {ref} from 'vue'

const padding = 100
const factor = ref(0.1)

function PreviewRenderMi(uid, img, exifData, iconImg) {
    const rectH = img.height * factor.value
    const rectW = img.width
    const middle = img.height + rectH / 3
    const genMarkInfo = getMarkInfo(exifData, padding, middle, rectW, rectH, img.height, iconImg)
    const renderItem = genRenderItem(img, genMarkInfo)
    allCanvasConfigMap.set(uid, renderItem)
}

export {PreviewRenderMi}