import {
  genRenderItem,
  getIconInfoConfig,
  getMarkInfo,
} from "@/themes/mi/parameterInfoConfig";
import {
  allCanvasConfigMap,
  defineCanvasConfig,
} from "@/store/defineCanvasConfig";
import { defineIcon, uid2Src, pushToIconCache } from "@/store/defineImg";
import { loadImg } from "@/utils/loadImg";
import { defineRender } from "@/store/defineRender";
import { getIconSrc } from "@/utils/getIcon";
import { readSettings } from "@/store/defineSettings";
import { ConvertConfig2Exif } from "@/utils/readExif";

const { iconInfoConfig, verticalBarInfoConfig } = defineCanvasConfig();
const { currentRenderUid, marshal, unMarshal } = defineRender();
const { iconCache } = defineIcon();

function getScale(img) {
  let imgH = img.height;
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
  const scaleY = imgH / img.height;

  const { StageCenter } = defineCanvasConfig();
  const posX = (StageCenter.value.x - imgW / 2) / scaleX;
  const posY = (StageCenter.value.y - imgH / 2) / scaleY;

  imgH = img.height;
  imgW = img.width;

  return {
    imgH,
    imgW,
    scaleX,
    scaleY,
    posX,
    posY,
  };
}

function PreviewRenderMi(uid) {
  // uid, img, exifData, iconImg, factor
  const fileObj = uid2Src.get(uid);
  const img = fileObj.img;
  const exifData = fileObj.exif;
  const iconName = getIconSrc(exifData);
  const iconSrc = readSettings().value.iconPrefix + iconName;
  const iconImg = iconCache.get(iconSrc);
  const factor = fileObj.renderFactor;
  const imgScaleInfo = getScale(img);
  const genMarkInfo = getMarkInfo(exifData, img, iconImg, factor, imgScaleInfo);
  const renderItem = genRenderItem(img, genMarkInfo, factor, imgScaleInfo);
  allCanvasConfigMap.set(uid, renderItem);
}

async function SelectIconForMiTheme(iconSrc) {
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

  const factor = uploadFile.renderFactor;
  const exifData = uploadFile.exif;
  const img = uploadFile.img;

  const imgScaleInfo = getScale(img);
  const newExifData = ConvertConfig2Exif();
  const selectIconMode = true;
  const genMarkInfo = getMarkInfo(
    newExifData,
    img,
    iconImg,
    factor,
    imgScaleInfo,
    selectIconMode,
  );
  const targetIconWidth = genMarkInfo.right.iconInfoConfig.width;
  const targetIconHeight = genMarkInfo.right.iconInfoConfig.height;

  const iconX = iconInfoConfig.x;
  const iconY = iconInfoConfig.y;
  const iconHeight = iconInfoConfig.height;
  const iconWidth = iconInfoConfig.width;

  const targetIconX = iconX + iconWidth - targetIconWidth;
  const targetIconY = iconY + iconHeight / 2 - targetIconHeight / 2;

  iconInfoConfig.x = targetIconX;
  iconInfoConfig.y = targetIconY;
  iconInfoConfig.image = iconImg;
  iconInfoConfig.height = targetIconHeight;
  iconInfoConfig.width = targetIconWidth;

  // Object.assign(iconInfoConfig, genMarkInfo.right.iconInfoConfig)

  // PreviewRender(uid, img, exifData, iconImg, uid2Src.get(uid).renderFactor);
  // not best practise
  // unMarshal(uid);
}

export { PreviewRenderMi, SelectIconForMiTheme };
