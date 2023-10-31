import {calcDeviceFontSize} from "@/utils/calcFontSize";

function getLensInfo(exifData, padding, middle, rectH) {

    const fontInfo = calcDeviceFontSize(exifData.LEN, 45, rectH, false)
    const fontSize = fontInfo.fontSize
    const textSize = fontInfo.textSize
    return {
        text : exifData.LEN,
        x : padding,
        y : middle + rectH/3,
        offsetY : textSize.height/2,
        fontSize : fontSize
    }
}

export {getLensInfo}