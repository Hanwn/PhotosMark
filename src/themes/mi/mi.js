import {genRenderItem, getMarkInfo} from "@/themes/mi/parameterInfoConfig";
import {allCanvasConfigMap} from "@/store/defineCanvasConfig";
import {ref} from 'vue'

// const factor = ref(0.1)

function PreviewRenderMi(uid, img, exifData, iconImg, facator) {
    const genMarkInfo = getMarkInfo(exifData, img, iconImg, facator)
    const renderItem = genRenderItem(img, genMarkInfo, facator)
    allCanvasConfigMap.set(uid, renderItem)
}

export {PreviewRenderMi}