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


export { calcDeviceFontSize}
