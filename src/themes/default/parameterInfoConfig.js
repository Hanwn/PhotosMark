import { defineThemeParameter } from "@/store/defineThemes";
import { defineCanvasConfig } from "@/store/defineCanvasConfig";
import { calcRenderFontSize } from "@/utils/calcFontSize";

const {
  parameterInfoConfig,
  timeInfoConfig,
  lensInfoConfig,
  deviceInfoConfig,
} = defineCanvasConfig();

function getIconInfo(iconImg, factor, imgScale) {
  const imgH = imgScale.imgH;
  const imgW = imgScale.imgW;

  const bannerHeight = imgH * factor;
  const bannerMiddleY = imgScale.posY + imgH + bannerHeight / 2;
  const bannerMiddleX = imgScale.posX + imgW / 2;

  const iconScale = iconImg.width / iconImg.height;
  let iconHRadio = 0.35;
  if (iconImg.width > 2.1 * iconImg.height) {
    iconHRadio = 0.15;
  }
  const iconHeight = bannerHeight * iconHRadio;
  const iconWidth = iconHeight * iconScale;

  const iconImgX = bannerMiddleX - iconWidth / 2;
  const iconImgY = bannerMiddleY - iconHeight / 2;
  return {
    x: iconImgX,
    y: iconImgY,
    image: iconImg,
    height: iconHeight,
    width: iconWidth,
    draggable: true,
    name: "iconInfo",
    scaleX: 1,
    scaleY: 1,
    visible: true,
  };
}

function getParameterConfig(factor, imgScale, iconConfig) {
  const imgH = imgScale.imgH;
  const bannerH = imgH * factor;
  const parameterX = imgScale.posX + imgScale.imgW / 2;
  const fontSize = parameterInfoConfig.fontSize;
  const { textSize } = calcRenderFontSize(parameterInfoConfig.text, fontSize);
  const parameterPosX = parameterX - textSize.width / 2;
  const parameterPosY = iconConfig.y + iconConfig.height + 0.15 * bannerH;

  return {
    text: parameterInfoConfig.text,
    x: parameterPosX,
    y: parameterPosY,
    fill: parameterInfoConfig.fill,
    fontStyle: parameterInfoConfig.fontStyle,
    offsetY: parameterInfoConfig.offsetY,
    fontSize: fontSize,
    draggable: true,
    name: "parameterInfo",
    scaleX: 1,
    scaleY: 1,
    visible: true,
  };
}

function getTimeConfig() {
  return {
    text: timeInfoConfig.text,
    x: timeInfoConfig.x,
    y: timeInfoConfig.y,
    offsetY: timeInfoConfig.offsetY,
    fontSize: timeInfoConfig.fontSize,
    fontStyle: timeInfoConfig.fontStyle,
    fill: timeInfoConfig.fill,
    draggable: true,
    name: "timeInfo",
    scaleX: 1,
    scaleY: 1,
    visible: false,
  };
}

function getLensConfig() {
  return {
    visible: false,
  };
}

function getDeviceConfig() {
  return { visible: false };
}

function getVerticalBarConfig() {
  return { visible: false };
}

function getDefaultMarkInfo(iconImg, factor, imgScale) {
  const iconConfig = getIconInfo(iconImg, factor, imgScale);
  const parameterConfig = getParameterConfig(factor, imgScale, iconConfig);
  const timeConfig = getTimeConfig();
  const lensConfig = getLensConfig();
  const deviceConfig = getDeviceConfig();
  const verticalBarConfig = getVerticalBarConfig();

  return {
    iconConfig,
    parameterConfig,
    timeConfig,
    lensConfig,
    deviceConfig,
    verticalBarConfig,
  };
}

function genRenderDefaultItem(img, markInfo, factor, imgScale) {
  const imgH = imgScale.imgH;
  const imgW = imgScale.imgW;
  const scaleX = imgScale.scaleX;
  const scaleY = imgScale.scaleY;

  const posX = imgScale.posX;
  const posY = imgScale.posY;
  const bannerRadio = factor * 0.3;
  const { whiteBoard } = defineThemeParameter();

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
    backgroundRectConfig: {
      height: imgH * (1 + factor + bannerRadio),
      width: imgW + imgH * bannerRadio * 2,
      x: posX - imgH * bannerRadio,
      y: posY - imgH * bannerRadio,
      fill: "#ffffff",
      scaleY: 1,
      scaleX: 1,
      visible: whiteBoard.value,
    },
    deviceInfoConfig: markInfo.deviceConfig,
    lensInfoConfig: markInfo.lensConfig,
    iconInfoConfig: markInfo.iconConfig,
    verticalBarInfoConfig: markInfo.verticalBarConfig,
    parameterInfoConfig: markInfo.parameterConfig,
    timeInfoConfig: markInfo.timeConfig,
    factor: factor,
  };
}

export { genRenderDefaultItem, getDefaultMarkInfo };
