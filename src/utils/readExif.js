// import p
import piexifjs, { piexif } from "piexifjs";
import { defineRender } from "@/store/defineRender";
import { uid2Src } from "@/store/defineImg";
import { defineCanvasConfig } from "@/store/defineCanvasConfig";

const parseExifData = (exifData) => {
  if (!exifData) {
    return {
      Model: "UNKNOWN Device",
      Make: "UNKNOWN Device",
      F: "0.0",
      S: "0000",
      ISO: "000",
      FocalLength: "00",
      LEN: "UNKNOWN LENS",
      Time: "No time Info",
    };
  }
  const Model = exifData["0th"][piexif.ImageIFD.Model];
  const Make = exifData["0th"][piexif.ImageIFD.Make];
  const F = exifData.Exif[piexif.ExifIFD.FNumber];
  const S = exifData.Exif[piexif.ExifIFD.ExposureTime];
  const ISO = exifData.Exif[piexif.ExifIFD.ISOSpeedRatings];
  const L = exifData.Exif[piexif.ExifIFD.FocalLength];
  const LEN = exifData.Exif[piexif.ExifIFD.LensModel];
  const T = exifData.Exif[piexif.ExifIFD.DateTimeOriginal];
  // const noneT = new Date().Format("")

  return {
    Model: Model || "UNKNOWN Device",
    Make: Make || "UNKNOWN Device",
    F: F && F[0] && F[1] ? F[0] / F[1] : "0.0",
    S: S && S[0] && S[1] ? S[1] : "0000",
    ISO: ISO || "000",
    FocalLength: L && L[0] && L[1] ? L[0] / L[1] : "00",
    LEN: LEN || "UNKNOWN LENS",
    Time: T || "",
    Parameter: null,
  };
};

function ConvertConfig2Exif() {
  const {
    parameterInfoConfig,
    lensInfoConfig,
    timeInfoConfig,
    deviceInfoConfig,
  } = defineCanvasConfig();

  // parameterInfoConfig
  const splitArr = parameterInfoConfig.text.split(" ");

  return {
    Model: deviceInfoConfig.text,
    Parameter: parameterInfoConfig.text,
    LEN: lensInfoConfig.text,
    Time: timeInfoConfig.text,
  };
}

const getExifData = function getExifByPiExif(img) {
  let exif = piexif.load(img);
  return parseExifData(exif);
};

export { getExifData, parseExifData, ConvertConfig2Exif };
