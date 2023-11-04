import {calcIconSize} from "@/utils/calcIconSize";

const getIconSrc = function (exifData) {
    const model = exifData.Model
    const make = exifData.Make

    console.log(model,make)

    const deviceModel = model.toLowerCase()
    const deviceMake = make.toLowerCase()
    let iconSrc = "Nikon100.svg"
    const deviceMap = new Map([
        ["nikon", "Nikon2.svg"],
        ["sony", "Sony.svg"],
        ["canon", "Canon.svg"],
        ["fujifilm", "Fujifilm.svg"],
        ["dij", "Dji.svg"],
        ["hasselblad", "hasselblad.svg"],
        ["lumix", "lumix.svg"],
        ["gopro", "gopro.svg"],
        ["apple", "apple.svg"],
        ["pentax", "pentax.svg"],
        ["ricoh", "ricoh.svg"]
    ])

    if (deviceMap.has(deviceModel)) {
        return deviceMap.get(deviceModel)
    }
    if (deviceMake.hash(deviceMake)) {
        return deviceMap.get(deviceMake)
    }

    return iconSrc
}

function getIconInfoConfig(iconImg, rectW, rectH) {
}

export {getIconSrc}