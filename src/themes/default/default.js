import { defineIcon, pushToIconCache, uid2Src } from "@/store/defineImg";
import { getIconSrc } from "@/utils/getIcon";
import { readSettings } from "@/store/defineSettings";
import { getScale, loadImg } from "@/utils/loadImg";
import {
  genRenderDefaultItem,
  getDefaultMarkInfo,
} from "@/themes/default/parameterInfoConfig";
import {
  allCanvasConfigMap,
  defineCanvasConfig,
} from "@/store/defineCanvasConfig";
import { ConvertConfig2Exif } from "@/utils/readExif";
import { defineRender } from "@/store/defineRender";
const { iconCache } = defineIcon();
const { iconInfoConfig, verticalBarInfoConfig } = defineCanvasConfig();
const { currentRenderUid } = defineRender();

function PreviewRenderDefault(uid) {
  const fileObj = uid2Src.get(uid);
  const img = fileObj.img;
  const exifData = fileObj.exif;
  const iconName = getIconSrc(exifData);
  const iconSrc = readSettings().value.iconPrefix + iconName;
  const iconImg = iconCache.get(iconSrc);
  const imgScaleInfo = getScale(img);
  const factor = imgScaleInfo.imgH > imgScaleInfo.imgW ? 0.15 : 0.2;
  const markInfo = getDefaultMarkInfo(iconImg, factor, imgScaleInfo);
  return genRenderDefaultItem(img, markInfo, factor, imgScaleInfo);
}
async function SelectIconForDefault(iconSrc) {
  const uid = currentRenderUid.value;
  const uploadFile = uid2Src.get(currentRenderUid.value);

  if (uploadFile.img === null) {
    // TODO:重新加载图片信息
  }

  let iconImg = "";
  if (iconCache.has(iconSrc)) {
    iconImg = iconCache.get(iconSrc);
  } else {
    iconImg = await loadImg(iconSrc);
    pushToIconCache(iconSrc, iconImg);
  }

  const factor = allCanvasConfigMap.get(uid).factor;
  const img = uploadFile.img;

  const imgScaleInfo = getScale(img);
  const genMarkInfo = getDefaultMarkInfo(iconImg, factor, imgScaleInfo);
  const targetIconWidth = genMarkInfo.iconConfig.width;
  const targetIconHeight = genMarkInfo.iconConfig.height;

  const iconHeight = iconInfoConfig.height;
  const iconWidth = iconInfoConfig.width;
  const iconCenterX = iconInfoConfig.x + iconWidth / 2;
  const iconCenterY = iconInfoConfig.y + iconHeight / 2;

  let targetIconX = iconCenterX - targetIconWidth / 2;
  let targetIconY = iconCenterY - targetIconHeight / 2;

  if (isNaN(targetIconX) || isNaN(targetIconY)) {
    targetIconX = genMarkInfo.iconInfoConfig.x;
    targetIconY = genMarkInfo.iconInfoConfig.y;
  }
  iconInfoConfig.x = targetIconX;
  iconInfoConfig.y = targetIconY;
  iconInfoConfig.image = iconImg;
  iconInfoConfig.height = targetIconHeight;
  iconInfoConfig.width = targetIconWidth;
}

function SlideFactorForDefault(factorValue) {
  const uid = currentRenderUid.value;
  const fileObj = uid2Src.get(uid);
  const img = fileObj.img;
  const exifData = fileObj.exif;
  const iconName = getIconSrc(exifData);
  const iconSrc = readSettings().value.iconPrefix + iconName;
  const iconImg = iconCache.get(iconSrc);
  const imgScaleInfo = getScale(img);
  const factor = factorValue;
  const markInfo = getDefaultMarkInfo(iconImg, factor, imgScaleInfo);
  return genRenderDefaultItem(img, markInfo, factor, imgScaleInfo);
}

export { PreviewRenderDefault, SelectIconForDefault, SlideFactorForDefault };
