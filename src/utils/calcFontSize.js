function calcFontWidth(ctx, text, fontSize) {
    const metrics = ctx.measureText(text)
    let fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
    return {
        "height": fontHeight,
        "width": metrics.width,
        "fontSize": fontSize
    }
}

function modifyFont(ctx, img, factor, fontSize, text, fontFactor, bold) {
    const rectW = img.width
    const rectH = img.height * factor
    const maxWidth = rectW/fontFactor["W"]
    const maxHeight =  rectH/fontFactor["H"]
    let fontInfo = calcFontWidth(ctx, text, fontSize)
    let fontBkp = ctx.font
    // console.log(fontInfo.height, maxHeight)
    let bolding = ""
    if (bold) {
        bolding = "bold"
    }
    while ((fontInfo.width > maxWidth || fontInfo.height > maxHeight) && fontSize > 0) {
        fontSize = fontSize - 1
        fontBkp = ctx.font
        ctx.font = `${bolding} ${fontItalic} ${fontSize}px ${fontFamily}`
        fontInfo = calcFontWidth(ctx, text, fontSize)
    }

    let ret = fontInfo
    while (fontInfo.width < maxWidth && fontInfo.height < maxHeight) {
        fontSize = fontSize + 1
        ret = fontInfo
        fontBkp = ctx.font
        ctx.font = `${bolding} ${fontItalic} ${fontSize}px ${fontFamily}`
        fontInfo = calcFontWidth(ctx, text, fontSize)
    }
    ctx.font = fontBkp
    return ret
}

import Konva from 'konva'


function calcDeviceFontSize(text, fontSize, rectH, bold) {
    const textObj = new Konva.Text({
        fontSize:fontSize
    })


    let fontMaxHeight = 0
    if (bold) {
        fontMaxHeight = rectH * 0.2
    } else {
        fontMaxHeight = rectH * 0.15
    }

    let textSize = textObj.fontSize()

    while (fontMaxHeight > textObj.measureSize(text).height) {
        // let textSize = textObj.fontSize()
        textSize = textSize + 1
        textObj.fontSize(textSize)
    }

    while (fontMaxHeight < textObj.measureSize(text).height) {
        // let textSize = textObj.fontSize()
        textSize = textSize - 1
        textObj.fontSize(textSize)
    }

    return {
        "textSize":textObj.measureSize(text),
        "fontSize":textSize
    }
}

function calcLensFontSize() {

}

function calcParameterFontSize() {

}

function calcTimeFontSize() {

}

export {calcTimeFontSize, calcDeviceFontSize, calcLensFontSize, calcParameterFontSize}
