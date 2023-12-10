import { calcDeviceFontSize, calcRenderFontSize } from "@/utils/calcFontSize";
import { defineCanvasConfig } from "@/store/defineCanvasConfig";

let padding = 100;
let dist = 50;

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

function getTimeInfoConfig(
  exifData,
  middle,
  rectH,
  parameterInfoConfig,
  selectIconMode,
) {
  const { timeInfoConfig } = defineCanvasConfig();
  let timeInfoConfigFontSize = timeInfoConfig.fontSize;
  let timeInfoConfigFontBold = timeInfoConfig.fontStyle.includes("bold");

  let fontInfo = {};
  if (selectIconMode === true) {
    fontInfo = calcRenderFontSize(exifData.Time, timeInfoConfigFontSize);
  } else {
    fontInfo = calcDeviceFontSize(
      exifData.Time,
      timeInfoConfigFontSize,
      rectH,
      timeInfoConfigFontBold,
    );
  }

  const fontSize = fontInfo.fontSize;
  const textSize = fontInfo.textSize;
  return {
    text: exifData.Time,
    x: parameterInfoConfig.x,
    y: middle + rectH / 3,
    offsetY: textSize.height / 2,
    fontSize: fontSize,
    fontStyle: "",
    fill: "gray",
    draggable: true,
    name: "timeInfo",
    scaleX: 1,
    scaleY: 1,
    visible: true,
  };
}

function getVerticalBarInfoConfig(
  parameterInfoConfig,
  rectH,
  imgH,
  imgScaleInfo,
) {
  dist = imgH * 0.02;
  const posY = imgScaleInfo.posY;
  const verticalBarWidth = imgH * 0.001;
  const radio = 0.5;
  const offset = (rectH * (1 - radio)) / 2;
  return {
    x: parameterInfoConfig.x - verticalBarWidth - dist,
    y: posY + imgH + offset,
    height: rectH * radio,
    width: verticalBarWidth,
    fill: "#808080",
    draggable: true,
    name: "verticalBarInfo",
    scaleX: 1,
    scaleY: 1,
    visible: true,
  };
}

function getIconInfoConfig(
  verticalBarInfoConfigX,
  maxLensEndPos,
  iconImg,
  rectH,
  rectW,
  imgH,
  imgScaleInfo,
) {
  const posY = imgScaleInfo.posY;
  const iconMaxLen = verticalBarInfoConfigX - dist - maxLensEndPos;
  const calcIconData = calcIconSize(
    iconImg.width,
    iconImg.height,
    rectH,
    rectW,
    iconMaxLen,
  );
  return {
    x: verticalBarInfoConfigX - dist - calcIconData.iconImgWidth,
    image: iconImg,
    y: posY + imgH + (rectH - calcIconData.iconImgHeight) / 2,
    height: calcIconData.iconImgHeight,
    width: calcIconData.iconImgWidth,
    draggable: true,
    name: "iconInfo",
    scaleX: 1,
    scaleY: 1,
    visible: true,
  };
}

function getParameterInfoConfig(
  exifData,
  padding,
  middle,
  rightX,
  rectH,
  selectIconMode,
) {
  let parameterText =
    exifData.FocalLength +
    "mm f/" +
    exifData.F +
    " 1/" +
    exifData.S +
    " ISO" +
    exifData.ISO;
  if (exifData.Parameter !== null) {
    parameterText = exifData.Parameter;
  }
  const { parameterInfoConfig } = defineCanvasConfig();
  let parameterInfoConfigFontSize = parameterInfoConfig.fontSize;
  let parameterInfoConfigFontBold =
    parameterInfoConfig.fontStyle.includes("bold");

  let fontInfo = {};
  if (selectIconMode === true) {
    fontInfo = calcRenderFontSize(parameterText, parameterInfoConfigFontSize);
  } else {
    fontInfo = calcDeviceFontSize(
      parameterText,
      parameterInfoConfigFontSize,
      rectH,
      parameterInfoConfigFontBold,
    );
  }

  const fontSize = fontInfo.fontSize;
  const textSize = fontInfo.textSize;
  return {
    text: parameterText,
    x: rightX - textSize.width - padding,
    y: middle,
    fill: "#000000",
    fontStyle: "bold",
    offsetY: textSize.height / 2,
    fontSize: fontSize,
    draggable: true,
    name: "parameterInfo",
    scaleX: 1,
    scaleY: 1,
    visible: true,
  };
}

function getLensInfo(exifData, padding, middle, rectH, selectIconMode) {
  const { lensInfoConfig } = defineCanvasConfig();
  let lensInfoConfigFontSize = lensInfoConfig.fontSize;
  let lensInfoConfigFontBold = lensInfoConfig.fontStyle.includes("bold");

  let fontInfo = {};
  if (selectIconMode === true) {
    fontInfo = calcRenderFontSize(exifData.LEN, lensInfoConfigFontSize);
  } else {
    fontInfo = calcDeviceFontSize(
      exifData.LEN,
      lensInfoConfigFontSize,
      rectH,
      lensInfoConfigFontBold,
    );
  }

  const fontSize = fontInfo.fontSize;
  const lensTextSize = fontInfo.textSize;

  const LensInfoConfig = {
    text: exifData.LEN,
    x: padding,
    y: middle + rectH / 3,
    offsetY: lensTextSize.height / 2,
    fontSize: fontSize,
    fill: "#808080",
    draggable: true,
    scaleX: 1,
    scaleY: 1,
    name: "lensInfo",
    visible: true,
  };
  return {
    LensInfoConfig,
    lensTextSize,
  };
}

function getDeviceInfoConfig(padding, middle, exifData, rectH, selectIconMode) {
  const { deviceInfoConfig } = defineCanvasConfig();
  let deviceInfoConfigFontSize = deviceInfoConfig.fontSize;
  let deviceInfoConfigFontBold = deviceInfoConfig.fontStyle.includes("bold");
  let fontInfo = {};
  if (selectIconMode === true) {
    fontInfo = calcRenderFontSize(exifData.Model, deviceInfoConfigFontSize);
  } else {
    fontInfo = calcDeviceFontSize(
      exifData.Model,
      deviceInfoConfigFontSize,
      rectH,
      deviceInfoConfigFontBold,
    );
  }
  let fontSize = fontInfo.fontSize;
  let textSize = fontInfo.textSize;

  const DeviceInfoConfig = {
    text: exifData.Model,
    x: padding,
    y: middle,
    fill: "#000000",
    fontStyle: "bold",
    fontSize: fontSize,
    offsetY: textSize.height / 2,
    scaleX: 1,
    scaleY: 1,
    draggable: true,
    name: "deviceInfo",
    visible: true,
  };
  return { DeviceInfoConfig, textSize };
}

function calcMaxLensEndPos() {}

function getLeftInfo(padding, middle, exifData, rectH, selectIconMode) {
  const { DeviceInfoConfig, textSize } = getDeviceInfoConfig(
    padding,
    middle,
    exifData,
    rectH,
    selectIconMode,
  );
  const deviceInfoEndPos = DeviceInfoConfig.x + textSize.width;

  const { LensInfoConfig, lensTextSize } = getLensInfo(
    exifData,
    padding,
    middle,
    rectH,
    selectIconMode,
  );
  const lensInfoEndPos = LensInfoConfig.x + lensTextSize.width;

  const maxLensEndPos =
    (deviceInfoEndPos > lensInfoEndPos ? deviceInfoEndPos : lensInfoEndPos) +
    30;

  return {
    deviceInfoConfig: DeviceInfoConfig,
    lensInfoConfig: LensInfoConfig,
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
  imgScaleInfo,
) {
  const rightX = imgScaleInfo.posX + imgScaleInfo.imgW;
  const parameterInfoConfig = getParameterInfoConfig(
    exifData,
    padding,
    middle,
    rightX,
    rectH,
    imgScaleInfo,
  );
  const timeInfoConfig = getTimeInfoConfig(
    exifData,
    middle,
    rectH,
    parameterInfoConfig,
    imgScaleInfo,
  );
  const verticalBarInfoConfig = getVerticalBarInfoConfig(
    parameterInfoConfig,
    rectH,
    imgH,
    imgScaleInfo,
  );
  const iconInfoConfig = getIconInfoConfig(
    verticalBarInfoConfig.x,
    maxLensEndPos,
    iconImg,
    rectH,
    rectW,
    imgH,
    imgScaleInfo,
  );
  return {
    parameterInfoConfig: parameterInfoConfig,
    timeInfoConfig: timeInfoConfig,
    verticalBarInfoConfig: verticalBarInfoConfig,
    iconInfoConfig: iconInfoConfig,
  };
}

function getMarkInfo(
  exifData,
  img,
  iconImg,
  factor,
  imgScaleInfo,
  selectIconMode,
) {
  const imgH = imgScaleInfo.imgH;
  const imgW = imgScaleInfo.imgW;

  const rectH = imgH * factor;
  const rectW = imgW;

  const middle = imgScaleInfo.posY + imgH + rectH / 3;
  // const imgH = img.height;
  padding = imgW * 0.02;
  const leftX = imgScaleInfo.posX + padding;

  const leftInfo = getLeftInfo(leftX, middle, exifData, rectH, selectIconMode);
  const rightInfo = getRightInfo(
    exifData,
    padding,
    middle,
    rectW,
    rectH,
    imgH,
    iconImg,
    leftInfo["maxLensEndPos"],
    imgScaleInfo,
    selectIconMode,
  );
  return {
    left: leftInfo,
    right: rightInfo,
  };
}

function genRenderItem(img, genMarkInfo, factor, imgScale) {
  const imgH = imgScale.imgH;
  const imgW = imgScale.imgW;
  const scaleX = imgScale.scaleX;
  const scaleY = imgScale.scaleY;

  const posX = imgScale.posX;
  const posY = imgScale.posY;

  const bannerRadio = factor * 0.15;

  return {
    previewGroupConfig: {
      scaleY: scaleY,
      scaleX: scaleX,
    },
    mainImgConfig: {
      image: img,
      x: posX,
      y: posY,
      scaleX: 1,
      scaleY: 1,
    },
    iconGroupConfig: {},
    bannerRectConfig: {
      height: imgH * factor,
      width: imgW,
      x: posX,
      y: imgH + posY,
      // fill: "#f08080",
      fill: "#ffffff",
      scaleY: 1,
      scaleX: 1,
    },
    topBannerRectConfig: {
      height: imgH * bannerRadio,
      width: imgW,
      x: posX,
      y: posY - imgH * bannerRadio,
      fill: "#ffffff",
      scaleY: 1,
      scaleX: 1,
      visible: false,
    },
    leftBannerRectConfig: {
      height: imgH * (1 + factor + bannerRadio),
      width: imgH * bannerRadio,
      x: posX - imgH * bannerRadio,
      y: posY - imgH * bannerRadio,
      fill: "#ffffff",
      scaleY: 1,
      scaleX: 1,
      visible: false,
    },
    rightBannerRectConfig: {
      height: imgH * (1 + factor + bannerRadio),
      width: imgH * bannerRadio,
      x: posX + imgW,
      y: posY - imgH * bannerRadio,
      fill: "#ffffff",
      scaleY: 1,
      scaleX: 1,
      visible: false,
    },
    deviceInfoConfig: genMarkInfo["left"]["deviceInfoConfig"],
    lensInfoConfig: genMarkInfo["left"]["lensInfoConfig"],
    iconInfoConfig: genMarkInfo["right"]["iconInfoConfig"],
    verticalBarInfoConfig: genMarkInfo["right"]["verticalBarInfoConfig"],
    parameterInfoConfig: genMarkInfo["right"]["parameterInfoConfig"],
    timeInfoConfig: genMarkInfo["right"]["timeInfoConfig"],
    factor: factor,
  };
}

export { getMarkInfo, genRenderItem, getIconInfoConfig };
