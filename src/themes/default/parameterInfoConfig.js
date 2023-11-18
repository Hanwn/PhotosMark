function getMarkInfo(exifData, middle, rectW, rectH, imgH, iconImg) {}

function genRenderItem() {
  return {
    previewStageConfig: {
      width: imgW,
      height: imgH,
      scaleX: scaleX,
      scaleY: scaleY,
    },
    downloadStageConfig: {
      width: img.width,
      height: img.height * (1 + factor),
      visible: true,
    },
    mainImgConfig: {
      image: img,
    },

    iconGroupConfig: {},
    bannerRectConfig: {
      height: img.height * factor,
      width: img.width,
      x: 0,
      y: img.height,
      fill: "#ffffff",
    },
    deviceInfoConfig: genMarkInfo["left"]["deviceInfoConfig"],
    lensInfoConfig: genMarkInfo["left"]["lensInfoConfig"],
    iconInfoConfig: genMarkInfo["right"]["iconInfoConfig"],
    parameterInfoConfig: genMarkInfo["right"]["parameterInfoConfig"],
    timeInfoConfig: genMarkInfo["right"]["timeInfoConfig"],
    verticalBarInfoConfig: {},
  };
}
