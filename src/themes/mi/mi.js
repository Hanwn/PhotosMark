import {
  genRenderItem,
  getIconInfoConfig,
  getMarkInfo,
} from "@/themes/mi/parameterInfoConfig";
import {
  allCanvasConfigMap,
  defineCanvasConfig,
} from "@/store/defineCanvasConfig";
import {
  defineIcon,
  pushToExifCache,
  pushToIconCache,
  uid2Src,
} from "@/store/defineImg";
import { loadImg } from "@/utils/loadImg";
import { defineRender } from "@/store/defineRender";
import { getImageData } from "@/utils/readFile";
import { getExifData, parseExifData } from "@/utils/readExif";
import { ElMessage } from "element-plus";
import { requestNotifyStatus } from "@/utils/notify";

const { iconInfoConfig, verticalBarInfoConfig } = defineCanvasConfig();
const { currentRenderUid, marshal, unMarshal } = defineRender();
const { iconCache } = defineIcon();

function PreviewRenderMi(uid, img, exifData, iconImg, factor) {
  const genMarkInfo = getMarkInfo(exifData, img, iconImg, factor);
  const renderItem = genRenderItem(img, genMarkInfo, factor);
  allCanvasConfigMap.set(uid, renderItem);
}

async function SelectIconForMiTheme(iconSrc) {
  const uid = currentRenderUid.value;
  const uploadFile = uid2Src.get(currentRenderUid.value);

  const imgData = await getImageData(uploadFile.raw);
  let exifData = null;

  try {
    exifData = getExifData(imgData);
  } catch (e) {
    exifData = parseExifData(null);
    // ElMessage.error("");
    requestNotifyStatus(
      "Oops, Your picture is not contain exif data.",
      "warning",
    );
  }
  exifData.LEN = exifData.LEN.replace(/\u0000/g, "");
  const src = uid2Src.get(currentRenderUid.value).src;
  let img = null;
  try {
    img = await loadImg(src);
  } catch (e) {
    // ElMessage.error("Oops, load img failed, please try again");
    requestNotifyStatus("Oops, load img failed, please try again", "error");
    return;
  }

  let iconImg = "";
  if (iconCache.has(iconSrc)) {
    iconImg = iconCache.get(iconSrc);
  } else {
    iconImg = await loadImg(iconSrc);
    pushToIconCache(iconSrc, iconImg);
  }
  const factor = uid2Src.get(uid).renderFactor;

  const genMarkInfo = getMarkInfo(exifData, img, iconImg, factor);
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
