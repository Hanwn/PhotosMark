import {themeIdx} from "@/store/defineThemes";
import {PreviewRenderMi} from "@/themes/mi/mi";
import {PreviewRenderDefault} from "@/themes/default/default";

function PreviewRender(uid, img, exifData, iconImg, factor) {
    const themeIdxValue = themeIdx.value
    switch (themeIdxValue) {
        case 1:
            PreviewRenderMi(uid, img, exifData, iconImg, factor)
            break
        case 2:
            // PreviewRenderDefault(uid, img, exifData, iconImg)
            break
        default:
            PreviewRenderMi(uid, img, exifData, iconImg, factor)
            break
    }
}


export {PreviewRender}