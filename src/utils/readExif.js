// import p
import piexifjs, { piexif } from 'piexifjs'

const parseExifData = (exifData) => {
    if (!exifData) { return {
        Model:"UNKNOWN Device",
        Make: "UNKNOWN Device",
        F:  "0.0",
        S: "0000",
        ISO:  "000",
        FocalLength: "00",
        LEN: "UNKNOWN LENS",
        Time: "No time Info"
    } }
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
        Model: Model || "UNKNOWN Device",
        Make: Make || "UNKNOWN Device",
        F: F && F[0] && F[1] ? F[0] / F[1] : "0.0",
        S: S && S[0] && S[1] ? S[1] : "0000",
        ISO: ISO || "000",
        FocalLength: L && L[0] && L[1] ? L[0] / L[1] : "00",
        LEN: LEN || "UNKNOWN LENS",
        Time: T || ""
    }
}

const getExifData = function getExifByPiExif(img) {
    let exif = piexif.load(img)
    return parseExifData(exif)
}

export {getExifData, parseExifData}
