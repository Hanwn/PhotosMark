import { themeIdx } from "@/store/defineThemes";
import { PreviewRenderMi, SelectIconForMiTheme } from "@/themes/mi/mi";
import { PreviewRenderDefault } from "@/themes/default/default";

function PreviewRender(uid) {
  const themeIdxValue = themeIdx.value;
  switch (themeIdxValue) {
    case 1:
      PreviewRenderMi(uid);
      break;
    case 2:
      // PreviewRenderDefault(uid, img, exifData, iconImg)
      break;
    default:
      PreviewRenderMi(uid);
      break;
  }
}

async function SelectIcon(iconSrc) {
  const themeIdxValue = themeIdx.value;
  switch (themeIdxValue) {
    case 1:
      await SelectIconForMiTheme(iconSrc);
      break;
  }
}

export { PreviewRender, SelectIcon };
