
const getIconSrc = function (exifData) {
    const model = exifData.Model
    const make = exifData.Make

    const deviceModel = model.toLowerCase()
    const deviceMake = make.toLowerCase()
    let iconSrc = ""

    console.log(deviceModel, deviceMake)

    if (deviceModel.includes("nikon") || deviceMake.includes("nikon")) {
        iconSrc = "Nikon2.svg"
        iconSrc = "Lumix.svg"
    } else if (deviceModel.includes("sony") || deviceMake.includes("sony")) {
        iconSrc = "Sony.svg"
    } else if (deviceModel.includes("canon") || deviceMake.includes("canon")) {
        iconSrc = "Canon.svg"
    }else if (deviceModel.includes("fujifilm") || deviceMake.includes("fujifilm")) {
        iconSrc = "Fujifilm.svg"
    } else if (deviceModel.includes("dji") || deviceMake.includes("dji")) {
        iconSrc = "Dji.svg"
    }else if (deviceModel.includes("hasselblad") || deviceMake.includes("hasseldblad")) {
        iconSrc = "Hasselblad.svg"
    } else if (deviceModel.includes("lumix") || deviceMake.includes("lumix")) {
        iconSrc = "Lumix.svg"
    } else {
        iconSrc = "Sony.svg"
    }

    console.log(iconSrc)

    return iconSrc
}

export {getIconSrc}