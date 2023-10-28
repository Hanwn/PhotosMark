// import p
import piexifjs, { piexif } from 'piexifjs'

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

const getExifData = function getExifByPiExif(img) {
    let exif = piexif.load(img)
    return parseExifData(exif)
}

export {getExifData}
