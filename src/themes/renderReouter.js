import { themeIdx } from "@/store/defineThemes";
import {
  PreviewRenderMi,
  SelectIconForMiTheme,
  SlideFactorMi,
} from "@/themes/mi/mi";
import {
  PreviewRenderDefault,
  SelectIconForDefault,
  SlideFactorForDefault,
} from "@/themes/default/default";
import {
  PreviewRenderBgColorTheme,
  SelectIconForBgColorTheme,
} from "@/themes/bgColor/bgColor";
const { currentRenderUid, marshal, unMarshal } = defineRender();
import { allCanvasConfigMap } from "@/store/defineCanvasConfig";
import { defineRender } from "@/store/defineRender";
import { uid2Src } from "@/store/defineImg";

function PreviewRender(uid) {
  // const themeIdxValue = themeIdx.value;
  const themeIdxValue = uid2Src.get(uid).renderThemeIdx;
  let renderItem = {};
  switch (themeIdxValue) {
    case 1:
      renderItem = PreviewRenderMi(uid);
      break;
    case 2:
      renderItem = PreviewRenderDefault(uid);
      // PreviewRenderDefault(uid, img, exifData, iconImg)
      break;
    case 3:
      renderItem = PreviewRenderBgColorTheme(uid);
      break;
    default:
      PreviewRenderMi(uid);
      break;
  }
  allCanvasConfigMap.set(uid, renderItem);
}

async function SelectIcon(iconSrc) {
  // const themeIdxValue = themeIdx.value;
  const uid = currentRenderUid.value;
  const themeIdxValue = uid2Src.get(uid).renderThemeIdx;
  switch (themeIdxValue) {
    case 1:
      await SelectIconForMiTheme(iconSrc);
      break;
    case 2:
      await SelectIconForDefault(iconSrc);
      break;
    case 3:
      await SelectIconForBgColorTheme(iconSrc);
  }
}

function SlideFactor(e) {
  const themeIdxValue = themeIdx.value;
  let renderItem = {};
  const uid = currentRenderUid.value;
  switch (themeIdxValue) {
    case 1:
      renderItem = SlideFactorMi(e);
      break;
    case 2:
      renderItem = SlideFactorForDefault(e);
      break;
  }
  allCanvasConfigMap.set(uid, renderItem);
}

export { PreviewRender, SelectIcon, SlideFactor };
