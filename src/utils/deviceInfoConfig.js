import {calcDeviceFontSize} from "@/utils/calcFontSize";

function getDeviceInfoConfig(padding, middle, exifData, rectH) {

    let fontInfo = calcDeviceFontSize(exifData.Model, 60, rectH, true)
    let fontSize = fontInfo.fontSize
    let textSize = fontInfo.textSize

    const ret = {
        text : exifData.Model,
        x : padding,
        y : middle,
        fontSize : fontSize,
        offsetY : textSize.height/2
    }
    return ret
}


export {getDeviceInfoConfig}