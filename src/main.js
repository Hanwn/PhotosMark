
let fontFamily = "Arial"

function loadImg(imgSrc) {
    return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = imgSrc
    })
}

function drawRect(ctx, factor, mainImg) {
    const rectH = mainImg.height * factor
    const rectW = mainImg.width
    const rectPosX = 0
    const rectPosY = mainImg.height

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(rectPosX, rectPosY, rectW, rectH)
}

function debug(ctx, x, y) {
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    // 指定“填充”属性
    ctx.fillStyle = 'red';
    // 执行“填充”操作
    ctx.fill();

    // ctx.beginPath();
    // ctx.arc(95,50,40,0,2*Math.PI);
    // ctx.stroke();
}

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
        ctx.font = `${bolding} italic ${fontSize}px ${fontFamily}`
        fontInfo = calcFontWidth(ctx, text, fontSize)
    }

    let ret = fontInfo
    while (fontInfo.width < maxWidth && fontInfo.height < maxHeight) {
        fontSize = fontSize + 1
        ret = fontInfo
        fontBkp = ctx.font
        ctx.font = `${bolding} italic ${fontSize}px ${fontFamily}`
        fontInfo = calcFontWidth(ctx, text, fontSize)
    }
    ctx.font = fontBkp
    return ret
}

function drawCameraText(ctx, factor, img, text) {
    ctx.fillStyle="#000000"
    let fontSize = 100
    ctx.font = `italic ${fontSize}px ${fontFamily}`
    ctx.textAlign = "start"
    ctx.textBaseline = "middle"
    const middle = getRectMiddle(img, factor)
    const fontFactor = {"W":3, "H":3}
    const fontInfo = modifyFont(ctx, img, factor, fontSize,text, fontFactor, true)
    ctx.fillText(text, 100,  middle)
    return fontInfo
}

function drawLensText(ctx, factor, img, text, cameraFontInfo) {
    let fontSize = 100
    ctx.font = `italic ${fontSize}px ${fontFamily}`;
    ctx.textAlign = "start"
    ctx.textBaseline = "top"
    ctx.fillStyle="gray"
    const middle = getRectMiddle(img, factor)
    const cameraTextHeight = middle + cameraFontInfo.height/2
    const fontFactor = {"W":3, "H":4}
    modifyFont(ctx, img, factor, fontSize,text,fontFactor, false)
    ctx.fillText(text, 100,  cameraTextHeight)
}

function drawParameterText(ctx, factor, img, exifData) {
    const exposureTime = parseFloat(exifData["S"])
    if (exposureTime > 1) {
        exifData["S"] = "1/" + exifData["S"]
    }
    let text = [exifData["L"] + "mm",  exifData["S"] + "s", "f/" + exifData["F"],  "ISO" + exifData["ISO"]].join(" ")
    let fontSize = 100
    ctx.font = `italic ${fontSize}px ${fontFamily}`
    ctx.textAlign = "start"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#000000"
    const rectH = img.height * factor
    const middle = getRectMiddle(img, factor)
    const fontFactor = {"W":3, "H":3}
    const fontInfo = modifyFont(ctx, img, factor, fontSize,text,fontFactor, true)
    const parameterX = img.width - fontInfo.width - 100
    const parameterY = middle - rectH * 3 /20
    ctx.fillText(text, parameterX, parameterY)

    const dateParameterX = parameterX
    const dateParameterY = middle + rectH * 3 / 20

    let dateFontSize =fontInfo["fontSize"] / 5 * 4
    // console.log(fontInfo["fontSize"], dateFontSize)

    ctx.fillStyle = "#4a4444"
    ctx.font = `italic ${dateFontSize}px ${fontFamily}`
    ctx.fillText(exifData['T'], dateParameterX, dateParameterY)

    return {"X": parameterX, "Y": parameterY}
    // debug(ctx, parameterX, middle)
}

function drawRectMiddleLine(ctx, factor, img) {
    ctx.setLineDash([5,10]); // 设置间隔
    ctx.beginPath();
    const middleLineFromX = 0
    const middleLineFromY = getRectMiddle(img, factor)
    const middleLineToX = img.width
    const middleLineToY = middleLineFromY

    ctx.moveTo(middleLineFromX,middleLineFromY)
    ctx.lineTo(middleLineToX, middleLineToY)
    ctx.strokeStyle="red";
    ctx.stroke();
}

function getRectMiddle(img, factor) {
    return img.height * ( factor/2 + 1)
}

function drawVerticalBar(ctx, factor, img, parameterPosInfo) {
    ctx.fillStyle="gray"
    const verticalBarDistance = 70
    const verticalBarX = parameterPosInfo["X"] - verticalBarDistance
    const verticalBarW = 15
    const verticalBarFactor = 3/5
    const verticalBarH= img.height * factor * verticalBarFactor
    const rectH = img.height * factor
    const verticalBarY = img.height + rectH * (1 - verticalBarFactor)/2
    ctx.fillRect(verticalBarX, verticalBarY , verticalBarW, verticalBarH)
    // debug(ctx, verticalBarX, verticalBarY)
    return {"X": verticalBarX, "W": verticalBarDistance - verticalBarW}
}

function fitIcon() {

}

function drawIcon(ctx, factor, mainImg, iconImg, verticalBarInfo) {
    const rectH = mainImg.height * factor
    const iconFactor = {"H":3/2, "Y": 6}
    const middle = getRectMiddle(mainImg, factor)
    let iconHeight = rectH / iconFactor["H"]
    const scale = iconImg.width/iconImg.height
    let iconWidth = iconHeight * scale
    // const
    const maxIconWidth = mainImg.width / 6
    while (iconWidth > maxIconWidth) {
        iconWidth = maxIconWidth
        iconHeight = maxIconWidth / scale
    }
    const iconPosX = verticalBarInfo["X"] - verticalBarInfo["W"] - iconWidth
    const iconPosY = middle - iconHeight/2
    ctx.drawImage(iconImg, iconPosX, iconPosY, iconWidth, iconHeight)
    // debug(ctx, iconPosX, iconPosY)
}

function getExifByPiExif(img) {
    let exif = piexif.load(img)
    return exif
}

function getExif(img) {
    // console.log(img)
    EXIF.getData(img, function () {
        let ExposureTime = EXIF.getTag(this, "ExposureTime");
        let ISOSpeedRatings = EXIF.getTag(this, "ISOSpeedRatings")
        let DateTime = EXIF.getTag(this, "DateTime")
        let model = EXIF.getTag(this, "Model")
        let ApertureValue = EXIF.getTag(this, "ApertureValue")
        let LensModel = EXIF.getTag(this, "PixelXDimension")
        let LensMake = EXIF.getTag(this, "LensSerialNumber")
        let make = EXIF.getTag(this, "Make")
        console.log(LensMake)
        // console.log(ISOSpeedRatings, model, ApertureValue, LensModel, LensMake, make)
    });
}

async function MarkPhoto(imgSrc, exifData) {
    // const mainImg = await loadImg("./image_s.JPG")
    // const mainImg = await loadImg("image_h.JPG")
    const mainImg = await loadImg(imgSrc)
    // const iconImg = await loadImg("./Nikon.png")
    // const iconImg = await loadImg("./Nikon.svg")
    const iconImg = await loadImg("./Nikon100.svg")
    // const iconImg = await loadImg("./hs.svg")
    // getExif(mainImg)
    // getExifByPiExif(mainImg)

    // font
    const myFont = new FontFace('alibaba', 'url(./alibaba.ttf)')
    const newFont = await myFont.load()
    fontFamily = "alibaba"

    const cvs = document.getElementById("myCvs")
    const ctx = cvs.getContext("2d")
    // ctx.clearRect(0, 0, cvs.width, cvs.height);

    const factor = 0.08

    cvs.height = mainImg.height * (1 + factor)
    cvs.width = mainImg.width

    ctx.drawImage(mainImg, 0, 0)
    console.log(mainImg.width, mainImg.height)
    drawRect(ctx, factor, mainImg)

    debug(ctx, 0, 0)
    // drawRectMiddleLine(ctx, factor, mainImg)

    const cameraTextInfo = drawCameraText(ctx, factor, mainImg, exifData["M"])
    // TODO: replace \u0000
    drawLensText(ctx, factor, mainImg, exifData["LEN"].replace(/\u0000/g, ""), cameraTextInfo)
    const parameterPosInfo = drawParameterText(ctx, factor, mainImg, exifData)

    const verticalBarInfo = drawVerticalBar(ctx, factor, mainImg, parameterPosInfo)
    drawIcon(ctx, factor, mainImg, iconImg, verticalBarInfo)

    // draw

}
const getImageData = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = (e) => {
            resolve(e.target.result)
        }
        fileReader.onerror = (error) => {
            reject(error)
        }
        fileReader.readAsDataURL(file)
    })
}

const parseExifData = (exifData) => {
    if (!exifData) { return null }
    const M = exifData['0th'][piexif.ImageIFD.Model]
    const F = exifData.Exif[piexif.ExifIFD.FNumber]
    const S = exifData.Exif[piexif.ExifIFD.ExposureTime]
    const ISO = exifData.Exif[piexif.ExifIFD.ISOSpeedRatings]
    const L = exifData.Exif[piexif.ExifIFD.FocalLength]
    const LEN = exifData.Exif[piexif.ExifIFD.LensModel]
    const T = exifData.Exif[piexif.ExifIFD.DateTimeOriginal]
    return {
        M: M || "UNKNOWN Device",
        F: F && F[0] && F[1] ? F[0] / F[1] : "0.0",
        S: S && S[0] && S[1] ? S[1] : "0000",
        ISO: ISO || "000",
        L: L && L[0] && L[1] ? L[0] / L[1] : "00",
        LEN: LEN || "UNKNOWN LENS",
        T: T || ""
    }
}

function upload() {
    const input = document.querySelector("#upload");
    input.addEventListener('change',function(){
        // 通过onchange事件获取files,函数要使用function定义,箭头函数this指向父级作用域
        const files = this.files;
        // getExif(files[0])
        getImageData(files[0]).then((imgData) => {
            this.imgData = imgData
            const exif = getExifByPiExif(this.imgData)
            const exifData = parseExifData(exif)
            console.log(exifData)
            let src = URL.createObjectURL(files[0])
            MarkPhoto(src, exifData).then()
        })
    },false);
}

function main() {
    upload()
}

window.onload =main