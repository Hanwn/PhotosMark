import { defineThemeParameter } from "@/store/defineThemes";
import { defineCanvasConfig } from "@/store/defineCanvasConfig";
import { fitLogo } from "@/themes/icons";

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

  const { width: iconWidth, height: iconHeight } = fitLogo(
    iconImg,
    imgW * 0.22,
    bannerHeight * 0.35,
  );

  const iconImgX = bannerMiddleX - iconWidth / 2;
  const iconImgY = bannerMiddleY - iconHeight / 2;
  return {
    x: iconImgX,
    y: iconImgY,
    image: iconImg,
    height: iconHeight,
    width: iconWidth,
    draggable: false,
    name: "iconInfo",
    scaleX: 1,
    scaleY: 1,
    visible: true,
  };
}

function getParameterConfig(factor, imgScale, iconConfig) {
  const imgH = imgScale.imgH;
  const bannerH = imgH * factor;
  const fontSize = Math.max(1, Math.round(parameterInfoConfig.fontSize));
  const parameterPosY = iconConfig.y + iconConfig.height + 0.15 * bannerH;
  const label = parameterInfoConfig.text || "";

  return {
    text: label,
    x: imgScale.posX + imgScale.imgW / 2,
    y: parameterPosY,
    width: "auto",
    rightAligned: false,
    centerAligned: true,
    offsetX: 0,
    fill: parameterInfoConfig.fill,
    fontStyle: parameterInfoConfig.fontStyle,
    offsetY: parameterInfoConfig.offsetY,
    fontSize: fontSize,
    draggable: false,
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
    rightAligned: false,
    offsetX: 0,
    offsetY: timeInfoConfig.offsetY,
    fontSize: timeInfoConfig.fontSize,
    fontStyle: timeInfoConfig.fontStyle,
    fill: timeInfoConfig.fill,
    draggable: false,
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
  const { whiteBoard, radius, blurMode } = defineThemeParameter();

  return {
    previewGroupConfig: {
      scaleY: scaleY,
      scaleX: scaleX,
    },
    mainImgConfig: {
      image: img,
      name: "mainImg",
      draggable: false,
      x: posX,
      y: posY,
      scaleX: 1,
      scaleY: 1,
      cornerRadius: radius.value === true ? 50 : 0,
    },
    iconGroupConfig: {},
    bannerRectConfig: {
      height: imgH * factor,
      width: whiteBoard.value ? imgW + imgH * bannerRadio * 2 : imgW,
      x: whiteBoard.value ? posX - imgH * bannerRadio : posX,
      y: imgH + posY,
      // fill: "#f08080",
      fill: "#ffffff",
      name: "bannerRect",
      draggable: false,
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
      name: "backgroundRect",
      draggable: false,
    },
    blurRectConfig: {
      height: imgH,
      width: imgW,
      x: posX,
      y: posY,
      fill: "#ffffff",
      shadowBlur: blurMode.value === true ? 100 : 0,
      cornerRadius: radius.value === true ? 50 : 0,
      scaleY: 1,
      scaleX: 1,
      visible: true,
      name: "blurRectConfig",
      draggable: false,
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
