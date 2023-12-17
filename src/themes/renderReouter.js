import { themeIdx } from "@/store/defineThemes";
import {
  PreviewRenderMi,
  SelectIconForMiTheme,
  SlideFactorMi,
} from "@/themes/mi/mi";
import {
  PreviewRenderDefault,
  SelectIconForDefault,
} from "@/themes/default/default";
const { currentRenderUid, marshal, unMarshal } = defineRender();
import { allCanvasConfigMap } from "@/store/defineCanvasConfig";
import { defineRender } from "@/store/defineRender";

function PreviewRender(uid) {
  const themeIdxValue = themeIdx.value;
  let renderItem = {};
  switch (themeIdxValue) {
    case 1:
      renderItem = PreviewRenderMi(uid);
      break;
    case 2:
      renderItem = PreviewRenderDefault(uid);
      // PreviewRenderDefault(uid, img, exifData, iconImg)
      break;
    default:
      PreviewRenderMi(uid);
      break;
  }
  allCanvasConfigMap.set(uid, renderItem);
}

async function SelectIcon(iconSrc) {
  const themeIdxValue = themeIdx.value;
  switch (themeIdxValue) {
    case 1:
      await SelectIconForMiTheme(iconSrc);
      break;
    case 2:
      await SelectIconForDefault(iconSrc);
      break;
  }
}

function SlideFactor(e) {
  const themeIdxValue = themeIdx.value;
  let renderItem = {};
  const uid = currentRenderUid.value;
  switch (themeIdxValue) {
    case 1:
      renderItem = SlideFactorMi(e);
  }
  allCanvasConfigMap.set(uid, renderItem);
}

export { PreviewRender, SelectIcon, SlideFactor };
