import { calcDeviceFontSize } from "@/utils/calcFontSize";

const padding = 100;

function calcIconSize(iconWidth, iconHeight, rectH, rectW, maxLen) {
  let verticalMaxRadio = 1 / 2;
  const horizonMaxRadio = 1 / 6;

  if (iconWidth / iconHeight >= 3 || iconHeight / iconWidth >= 3) {
    verticalMaxRadio = 1 / 4;
  }

  let iconImgHeight = rectH * verticalMaxRadio;
  const scale = iconWidth / iconHeight;
  let iconImgWidth = iconImgHeight * scale;
  const maxIconWidth =
    maxLen > rectW * horizonMaxRadio ? rectW * horizonMaxRadio : maxLen;
  if (iconImgWidth > maxIconWidth) {
    iconImgWidth = maxIconWidth;
    iconImgHeight = maxIconWidth / scale;
  }

  return {
    iconImgWidth: iconImgWidth,
    iconImgHeight: iconImgHeight,
    scaleX: iconImgWidth / iconWidth,
    scaleY: iconImgHeight / iconHeight,
  };
}

function getTimeInfoConfig(exifData, middle, rectH, parameterInfoConfig) {
  const timeTextSize = 45;
  const fontInfo = calcDeviceFontSize(
    exifData.Time,
    timeTextSize,
    rectH,
    false,
  );
  const fontSize = fontInfo.fontSize;
  const textSize = fontInfo.textSize;
  return {
    text: exifData.Time,
    x: parameterInfoConfig.x,
    y: middle + rectH / 3,
    offsetY: textSize.height / 2,
    fontSize: fontSize,
    fill: "gray",
    draggable: true,
    name: "timeInfo",
    scaleX: 1,
    scaleY: 1,
  };
}

function getVerticalBarInfoConfig(parameterInfoConfig, rectH, imgH) {
  const dist = 50;
  const verticalBarWidth = 6;
  const radio = 0.5;
  const offset = (rectH * (1 - radio)) / 2;
  return {
    x: parameterInfoConfig.x - verticalBarWidth - dist,
    y: imgH + offset,
    height: rectH * radio,
    width: verticalBarWidth,
    fill: "gray",
    draggable: true,
    name: "verticalBarInfo",
    scaleX: 1,
    scaleY: 1,
  };
}

function getIconInfoConfig(
  verticalBarInfoConfig,
  maxLensEndPos,
  iconImg,
  rectH,
  rectW,
  imgH,
) {
  const dist = 50;
  const iconMaxLen = verticalBarInfoConfig.x - dist - maxLensEndPos;
  const calcIconData = calcIconSize(
    iconImg.width,
    iconImg.height,
    rectH,
    rectW,
    iconMaxLen,
  );
  return {
    x: verticalBarInfoConfig.x - dist - calcIconData.iconImgWidth,
    image: iconImg,
    y: imgH + (rectH - calcIconData.iconImgHeight) / 2,
    height: calcIconData.iconImgHeight,
    width: calcIconData.iconImgWidth,
    draggable: true,
    name: "iconInfo",
    scaleX: 1,
    scaleY: 1,
  };
}

function getParameterInfoConfig(exifData, padding, middle, rectW, rectH) {
  const parameterText =
    exifData.FocalLength +
    "mm f/" +
    exifData.F +
    " 1/" +
    exifData.S +
    " ISO" +
    exifData.ISO;
  const parameterTextSize = 60;
  const fontInfo = calcDeviceFontSize(
    parameterText,
    parameterTextSize,
    rectH,
    true,
  );
  const fontSize = fontInfo.fontSize;
  const textSize = fontInfo.textSize;
  return {
    text: parameterText,
    x: rectW - textSize.width - padding,
    y: middle,
    fill: "black",
    fontStyle: "bold",
    offsetY: textSize.height / 2,
    fontSize: fontSize,
    draggable: true,
    name: "parameterInfo",
    scaleX: 1,
    scaleY: 1,
  };
}

function getLensInfo(exifData, padding, middle, rectH) {
  const fontInfo = calcDeviceFontSize(exifData.LEN, 45, rectH, false);
  const fontSize = fontInfo.fontSize;
  const lensTextSize = fontInfo.textSize;

  const lensInfoConfig = {
    text: exifData.LEN,
    x: padding,
    y: middle + rectH / 3,
    offsetY: lensTextSize.height / 2,
    fontSize: fontSize,
    fill: "gray",
    draggable: true,
    scaleX: 1,
    scaleY: 1,
    name: "lensInfo",
  };
  return {
    lensInfoConfig,
    lensTextSize,
  };
}

function getDeviceInfoConfig(padding, middle, exifData, rectH) {
  let fontInfo = calcDeviceFontSize(exifData.Model, 60, rectH, true);
  let fontSize = fontInfo.fontSize;
  let textSize = fontInfo.textSize;

  const deviceInfoConfig = {
    text: exifData.Model,
    x: padding,
    y: middle,
    fill: "black",
    fontStyle: "bold",
    fontSize: fontSize,
    offsetY: textSize.height / 2,
    scaleX: 1,
    scaleY: 1,
    draggable: true,
    name: "deviceInfo",
  };
  return { deviceInfoConfig, textSize };
}

function calcMaxLensEndPos() {}

function getLeftInfo(padding, middle, exifData, rectH) {
  const { deviceInfoConfig, textSize } = getDeviceInfoConfig(
    padding,
    middle,
    exifData,
    rectH,
  );
  const deviceInfoEndPos = deviceInfoConfig.x + textSize.width;

  const { lensInfoConfig, lensTextSize } = getLensInfo(
    exifData,
    padding,
    middle,
    rectH,
  );
  const lensInfoEndPos = lensInfoConfig.x + lensTextSize.width;

  const maxLensEndPos =
    (deviceInfoEndPos > lensInfoEndPos ? deviceInfoEndPos : lensInfoEndPos) +
    30;

  return {
    deviceInfoConfig: deviceInfoConfig,
    lensInfoConfig: lensInfoConfig,
    maxLensEndPos: maxLensEndPos,
  };
}

function getRightInfo(
  exifData,
  padding,
  middle,
  rectW,
  rectH,
  imgH,
  iconImg,
  maxLensEndPos,
) {
  const parameterInfoConfig = getParameterInfoConfig(
    exifData,
    padding,
    middle,
    rectW,
    rectH,
  );
  const timeInfoConfig = getTimeInfoConfig(
    exifData,
    middle,
    rectH,
    parameterInfoConfig,
  );
  const verticalBarInfoConfig = getVerticalBarInfoConfig(
    parameterInfoConfig,
    rectH,
    imgH,
  );
  const iconInfoConfig = getIconInfoConfig(
    verticalBarInfoConfig,
    maxLensEndPos,
    iconImg,
    rectH,
    rectW,
    imgH,
  );
  return {
    parameterInfoConfig: parameterInfoConfig,
    timeInfoConfig: timeInfoConfig,
    verticalBarInfoConfig: verticalBarInfoConfig,
    iconInfoConfig: iconInfoConfig,
  };
}

function getMarkInfo(exifData, img, iconImg, factor) {
  const rectH = img.height * factor;
  const rectW = img.width;
  const middle = img.height + rectH / 3;
  const imgH = img.height;

  const leftInfo = getLeftInfo(padding, middle, exifData, rectH);
  const rightInfo = getRightInfo(
    exifData,
    padding,
    middle,
    rectW,
    rectH,
    imgH,
    iconImg,
    leftInfo["maxLensEndPos"],
  );
  return {
    left: leftInfo,
    right: rightInfo,
  };
}

function genRenderItem(img, genMarkInfo, factor) {
  let imgH = img.height * (1 + factor);
  let imgW = img.width;
  const scale = imgH / imgW;
  if (imgH > imgW) {
    imgH = 600;
    imgW = imgH / scale;
  } else {
    imgW = 800;
    imgH = imgW * scale;
  }
  const scaleX = imgW / img.width;
  const scaleY = imgH / (img.height * (1 + factor));
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
      fill: "white",
    },
    deviceInfoConfig: genMarkInfo["left"]["deviceInfoConfig"],
    lensInfoConfig: genMarkInfo["left"]["lensInfoConfig"],
    iconInfoConfig: genMarkInfo["right"]["iconInfoConfig"],
    verticalBarInfoConfig: genMarkInfo["right"]["verticalBarInfoConfig"],
    parameterInfoConfig: genMarkInfo["right"]["parameterInfoConfig"],
    timeInfoConfig: genMarkInfo["right"]["timeInfoConfig"],
  };
}

export { getMarkInfo, genRenderItem, getIconInfoConfig };
