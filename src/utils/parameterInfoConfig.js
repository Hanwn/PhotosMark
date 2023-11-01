import {calcDeviceFontSize} from "@/utils/calcFontSize";
import {calcIconSize} from "@/utils/calcIconSize";


function getTimeInfoConfig(exifData, middle, rectH, parameterInfoConfig) {
    const timeTextSize = 45
    const fontInfo = calcDeviceFontSize(exifData.Time, timeTextSize, rectH, false)
    const fontSize = fontInfo.fontSize
    const textSize = fontInfo.textSize
    return {
        text : exifData.Time,
        x : parameterInfoConfig.x,
        y : middle + rectH/3,
        offsetY : textSize.height/2,
        fontSize : fontSize,
        fill: "gray",
        draggable:true,
    }
}

function getVerticalBarInfoConfig(parameterInfoConfig, rectH, imgH) {
    const dist = 50
    const verticalBarWidth = 5
    return {
        x : parameterInfoConfig.x - verticalBarWidth - dist,
        y : imgH + rectH / 6,
        height : rectH * 2 / 3,
        width: verticalBarWidth,
        fill: "gray",
        draggable:true,
    }
}


function getIconInfoConfig(verticalBarInfoConfig, maxLensEndPos, iconImg, rectH, rectW, imgH) {
    const dist = 50
    const iconMaxLen = verticalBarInfoConfig.x - dist - maxLensEndPos
    const calcIconData = calcIconSize(iconImg.width, iconImg.height, rectH, rectW, iconMaxLen)
    return {
        x : verticalBarInfoConfig.x - dist - calcIconData.iconImgWidth,
        image : iconImg,
        y : imgH + (rectH - calcIconData.iconImgHeight)/2,
        height : calcIconData.iconImgHeight,
        width : calcIconData.iconImgWidth,
        draggable:true,
    }
}

function getParameterInfoConfig(exifData, padding, middle, rectW, rectH) {
    const parameterText = exifData.FocalLength +  "mm f/" + exifData.F + " 1/" + exifData.S + " ISO" + exifData.ISO
    const parameterTextSize = 60
    const fontInfo = calcDeviceFontSize(parameterText, parameterTextSize, rectH, true)
    const fontSize = fontInfo.fontSize
    const textSize = fontInfo.textSize
    return {
        text : parameterText,
        x : rectW - textSize.width - padding,
        y : middle,
        fill:"black",
        fontStyle:"bold",
        offsetY : textSize.height/2,
        fontSize : fontSize,
        draggable:true,
    }
}

function getLensInfo(exifData, padding, middle, rectH) {

    const fontInfo = calcDeviceFontSize(exifData.LEN, 45, rectH, false)
    const fontSize = fontInfo.fontSize
    const textSize = fontInfo.textSize

    return [{
        text : exifData.LEN,
        x : padding,
        y : middle + rectH/3,
        offsetY : textSize.height/2,
        fontSize : fontSize,
        fill:"gray",
        draggable:true,
    }, textSize]
}


function getDeviceInfoConfig(padding, middle, exifData, rectH) {

    let fontInfo = calcDeviceFontSize(exifData.Model, 60, rectH, true)
    let fontSize = fontInfo.fontSize
    let textSize = fontInfo.textSize

    const ret = {
        text : exifData.Model,
        x : padding,
        y : middle,
        fill:"black",
        fontStyle:"bold",
        fontSize : fontSize,
        offsetY : textSize.height/2,
        draggable:true,
    }
    return [ret, textSize]
}

function calcMaxLensEndPos() {

}


function getLeftInfo(padding, middle, exifData, rectH) {
    const deviceInfoConfigList = getDeviceInfoConfig(padding,middle, exifData, rectH)
    const deviceInfoEndPos = deviceInfoConfigList[0].x + deviceInfoConfigList[1].width

    const lensInfoConfigList = getLensInfo(exifData, padding, middle, rectH)
    const lensInfoEndPos = lensInfoConfigList[0].x + lensInfoConfigList[1].width

    const maxLensEndPos = (deviceInfoEndPos > lensInfoEndPos ? deviceInfoEndPos : lensInfoEndPos) + 30

    return {
        "deviceInfoConfig":deviceInfoConfigList[0],
        "lensInfoConfig": lensInfoConfigList[0],
        "maxLensEndPos": maxLensEndPos
    }
}

function getRightInfo(exifData, padding, middle, rectW, rectH, imgH, iconImg, maxLensEndPos) {
    const parameterInfoConfig = getParameterInfoConfig(exifData, padding, middle, rectW, rectH)
    const timeInfoConfig = getTimeInfoConfig(exifData, middle, rectH, parameterInfoConfig)
    const verticalBarInfoConfig = getVerticalBarInfoConfig(parameterInfoConfig, rectH, imgH)
    const iconInfoConfig = getIconInfoConfig(verticalBarInfoConfig, maxLensEndPos, iconImg, rectH, rectW, imgH)

    return {
        "parameterInfoConfig": parameterInfoConfig,
        "timeInfoConfig": timeInfoConfig,
        "verticalBarInfoConfig": verticalBarInfoConfig,
        "iconInfoConfig": iconInfoConfig
    }
}

function getMarkInfo(exifData, padding, middle, rectW, rectH, imgH, iconImg) {
    const leftInfo = getLeftInfo(padding, middle, exifData, rectH)
    const rightInfo = getRightInfo(exifData, padding, middle, rectW, rectH, imgH, iconImg, leftInfo["maxLensEndPos"])
    return {
        "left": leftInfo,
        "right": rightInfo
    }
}

export {getMarkInfo}