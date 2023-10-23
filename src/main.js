
let fontFamily = "Arial"
let fontItalic = ""

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

function drawCameraText(ctx, factor, img, text) {
    ctx.fillStyle="#000000"
    let fontSize = 100
    ctx.font = `${fontItalic} ${fontSize}px ${fontFamily}`
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
    ctx.font = `${fontItalic} ${fontSize}px ${fontFamily}`;
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
    ctx.font = `${fontItalic} ${fontSize}px ${fontFamily}`
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
    ctx.font = `${fontItalic} ${dateFontSize}px ${fontFamily}`
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
    const iconImgH = iconImg.width
    const iconImgW = iconImg.height

    const iconFactor = {"H":2/3, "Y": 6}
    if (iconImgW/iconImgH >= 1.5 || iconImgH/iconImgW >= 1.5) {
        iconFactor["H"] = 1/3
        iconFactor["Y"] = 4
    }
    const middle = getRectMiddle(mainImg, factor)
    let maxIconHeight = rectH * iconFactor["H"]
    let iconHeight = maxIconHeight
    const scale = iconImg.width/iconImg.height
    let iconWidth = iconHeight * scale
    // const
    const maxIconWidth = mainImg.width / 6
    if (iconWidth > maxIconWidth) {
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
    const device = exifData["M"]
    const makeCompany = exifData["U"]
    const path = "./assets/logo/"
    let iconSrc = ""
    const deviceModel = device.toLowerCase()
    const deviceMake = makeCompany.toLowerCase()
    if (deviceModel.includes("nikon") || deviceMake.includes("nikon")) {
        iconSrc = "Nikon100.svg"
    } else if (deviceModel.includes("sony") || deviceMake.includes("sony")) {
        iconSrc = "sony.png"
    } else if (deviceModel.includes("canon") || deviceMake.includes("canon")) {
        iconSrc = "canon.svg"
    }else if (deviceModel.includes("fujifilm") || deviceMake.includes("fujifilm")) {
        iconSrc = "fujifilm.svg"
    } else if (deviceModel.includes("dji") || deviceMake.includes("dji")) {
        iconSrc = "dji.svg"
    } else {
        // iconSrc = "sony.png"
        iconSrc = "hs.svg"
    }

    const iconImg = await loadImg(path + iconSrc)

    // font
    const myFont = new FontFace('alibaba', 'url(./assets/font/Alibaba.ttf)')
    const newFont = await myFont.load()
    fontFamily = "alibaba"

    const cvs = document.getElementById("myCvs")
    const ctx = cvs.getContext("2d")
    // ctx.clearRect(0, 0, cvs.width, cvs.height);

    const factor = 0.08

    cvs.height = mainImg.height * (1 + factor)
    cvs.width = mainImg.width

    ctx.drawImage(mainImg, 0, 0)
    // console.log(mainImg.width, mainImg.height)
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
    const Model = exifData['0th'][piexif.ImageIFD.Model]
    const Make = exifData['0th'][piexif.ImageIFD.Make]
    const F = exifData.Exif[piexif.ExifIFD.FNumber]
    const S = exifData.Exif[piexif.ExifIFD.ExposureTime]
    const ISO = exifData.Exif[piexif.ExifIFD.ISOSpeedRatings]
    const L = exifData.Exif[piexif.ExifIFD.FocalLength]
    const LEN = exifData.Exif[piexif.ExifIFD.LensModel]
    const T = exifData.Exif[piexif.ExifIFD.DateTimeOriginal]
    // const noneT = new Date().Format("")
    return {
        M: Model || "UNKNOWN Device",
        U: Make || "UNKNOWN Device",
        F: F && F[0] && F[1] ? F[0] / F[1] : "0.0",
        S: S && S[0] && S[1] ? S[1] : "0000",
        ISO: ISO || "000",
        L: L && L[0] && L[1] ? L[0] / L[1] : "00",
        LEN: LEN || "UNKNOWN LENS",
        T: T || ""
    }
}

function main() {
    const { createApp, ref, reactive } = Vue
    createApp({
        setup() {
            const message = ref('Hello vue!')
            const rendered = ref(false)
            const imgList = reactive([])
            const metaDataMap = reactive(new Map())
            const uploadFiles = function(e) {
                // console.log(e.target.files)
                const files = e.target.files
                if (!files.length) {
                    return
                }

                console.log(files)
                for (let i = 0; i < files.length; i++) {
                    const file = files[i]
                    getImageData(file).then((imgData) => {
                        const exif = getExifByPiExif(imgData)
                        const exifData = parseExifData(exif)
                        let src = URL.createObjectURL(file)
                        metaDataMap.set(src, exifData)
                        if (i === 0 && rendered.value === false) {
                            MarkPhoto(src, metaDataMap.get(src)).then()
                            rendered.value = true
                        }
                        imgList.push(src)
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            }

            function render(e) {
                MarkPhoto(e.target.src, metaDataMap.get(e.target.src)).then(()=>{})
            }
            return {
                imgList,
                message,
                uploadFiles,
                render
            }
        }
    }).mount('#app')
}

window.onload =main