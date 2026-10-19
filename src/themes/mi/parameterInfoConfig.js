import { defineThemeParameter } from "@/store/defineThemes";
import { measureTextWidth } from "@/utils/textMetrics";
import { fitLogo } from "@/themes/icons";

// Theme positions are proportions of the source photo. Only this layout function
// needs to know about image dimensions; dragged positions remain in canvas state.
function getMarkInfo(exif, image, icon, factor, scale) {
  const { imgW: width, imgH: height, posX: x, posY: y } = scale;
  const bannerY = y + height;
  const bannerH = height * factor;
  const pad = width * 0.02;
  const gap = width * 0.018;
  const barW = 20;
  const { width: iconW, height: iconH } = fitLogo(icon, width * 0.16, bannerH * 0.46);
  const largeFont = Math.max(1, Math.round(bannerH * 0.2));
  const smallFont = Math.max(1, Math.round(bannerH * 0.14));
  const topY = bannerY + bannerH / 3 - largeFont / 2;
  const bottomY = bannerY + bannerH * 2 / 3 - smallFont / 2;
  const rightEdge = x + width - pad;
  const parameterText = exif.Parameter ?? `${exif.FocalLength}mm f/${exif.F} 1/${exif.S} ISO${exif.ISO}`;
  const rightTextWidth = Math.max(
    measureTextWidth(parameterText, largeFont, "bold"),
    measureTextWidth(exif.Time, smallFont),
  );
  const barX = Math.max(x + pad + iconW + gap, rightEdge - rightTextWidth - gap - barW);
  const iconX = barX - gap - iconW;

  const text = (value, textX, textY, fontSize, fill, style, name, rightAligned = false) => ({
    text: value || "",
    x: textX,
    y: textY,
    width: "auto",
    rightAligned,
    centerAligned: false,
    offsetX: rightAligned ? measureTextWidth(value || "", fontSize, style) : 0,
    fontSize,
    fill,
    fontStyle: style,
    name,
    draggable: false,
    visible: true,
    wrap: "none",
    scaleX: 1,
    scaleY: 1,
  });

  return {
    left: {
      deviceInfoConfig: text(exif.Model, x + pad, topY, largeFont, "#000000", "bold", "deviceInfo"),
      lensInfoConfig: text(exif.LEN, x + pad, bottomY, smallFont, "#808080", "normal", "lensInfo"),
    },
    right: {
      iconInfoConfig: {
        image: icon,
        x: iconX,
        y: bannerY + (bannerH - iconH) / 2,
        width: iconW,
        height: iconH,
        draggable: false,
        name: "iconInfo",
        visible: true,
        scaleX: 1,
        scaleY: 1,
      },
      verticalBarInfoConfig: {
        x: barX,
        y: bannerY + bannerH * 0.25,
        width: barW,
        height: bannerH * 0.5,
        fill: "#808080",
        name: "verticalBarInfo",
        visible: true,
        draggable: false,
        scaleX: 1,
        scaleY: 1,
      },
      parameterInfoConfig: text(parameterText, rightEdge, topY, largeFont, "#000000", "bold", "parameterInfo", true),
      timeInfoConfig: text(exif.Time, rightEdge, bottomY, smallFont, "#808080", "normal", "timeInfo", true),
    },
  };
}

function genRenderItem(img, mark, factor, scale) {
  const { whiteBoard, radius, blurMode } = defineThemeParameter();
  const { imgW: width, imgH: height, posX: x, posY: y, scaleX, scaleY } = scale;
  const bannerH = height * factor;
  const border = bannerH * 0.15;
  return {
    previewGroupConfig: { scaleX, scaleY },
    mainImgConfig: {
      image: img, x, y, scaleX: 1, scaleY: 1,
      name: "mainImg", draggable: false,
      shadowBlur: blurMode.value ? 100 : 0,
      cornerRadius: radius.value ? 50 : 0,
    },
    bannerRectConfig: {
      x: whiteBoard.value ? x - border : x, y: y + height,
      width: whiteBoard.value ? width + border * 2 : width,
      height: bannerH, fill: "#ffffff", scaleX: 1, scaleY: 1, name: "bannerRect", draggable: false,
    },
    backgroundRectConfig: {
      x: x - border, y: y - border,
      width: width + border * 2, height: height + border + bannerH,
      fill: "#ffffff", visible: whiteBoard.value, scaleX: 1, scaleY: 1,
      name: "backgroundRect", draggable: false,
    },
    blurRectConfig: {
      x, y, width, height, fill: "#ffffff", visible: true,
      name: "blurRectConfig", draggable: false,
      shadowBlur: blurMode.value ? 100 : 0,
      cornerRadius: radius.value ? 50 : 0,
      scaleX: 1, scaleY: 1,
    },
    deviceInfoConfig: mark.left.deviceInfoConfig,
    lensInfoConfig: mark.left.lensInfoConfig,
    iconInfoConfig: mark.right.iconInfoConfig,
    verticalBarInfoConfig: mark.right.verticalBarInfoConfig,
    parameterInfoConfig: mark.right.parameterInfoConfig,
    timeInfoConfig: mark.right.timeInfoConfig,
    factor,
  };
}

export { getMarkInfo, genRenderItem };
