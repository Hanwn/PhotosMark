import {genRenderItem, getMarkInfo} from "@/themes/mi/parameterInfoConfig";
import {allCanvasConfigMap} from "@/store/defineCanvasConfig";
import {ref} from 'vue'

// const factor = ref(0.1)

function PreviewRenderMi(uid, img, exifData, iconImg) {
    const genMarkInfo = getMarkInfo(exifData, img, iconImg)
    const renderItem = genRenderItem(img, genMarkInfo)
    allCanvasConfigMap.set(uid, renderItem)
}

export {PreviewRenderMi}