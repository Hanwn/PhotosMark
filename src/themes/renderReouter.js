import {themeIdx} from "@/store/defineThemes";
import {PreviewRenderMi} from "@/themes/mi/mi";

function PreviewRender(uid, img, exifData, iconImg) {
    const themeIdxValue = themeIdx.value
    switch (themeIdxValue) {
        case 1:
            PreviewRenderMi(uid, img, exifData, iconImg)
            break
        case 2:
            break
        default:
            break
    }
}


export {PreviewRender}