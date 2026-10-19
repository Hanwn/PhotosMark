import { defineThemeParameter, themeIdx } from "@/store/defineThemes";
import { getTheme, getThemeOptions, applyThemeAppearance, applyThemeOptions } from "@/themes/registry";
import { allCanvasConfigMap } from "@/store/defineCanvasConfig";
import { defineRender } from "@/store/defineRender";
import { uid2Src } from "@/store/defineImg";

const { currentRenderUid } = defineRender();
const appearanceParameters = defineThemeParameter();

function PreviewRender(uid) {
  const theme = getTheme(uid2Src.get(uid).renderThemeIdx);
  const restoreAppearance = currentRenderUid.value && currentRenderUid.value !== uid;
  const previousAppearance = restoreAppearance
    ? Object.fromEntries(["whiteBoard", "radius", "blurMode"].map((key) => [key, appearanceParameters[key].value]))
    : null;
  applyThemeAppearance(uid, theme);
  try {
    const renderItem = theme.render(uid, getThemeOptions(uid, theme));
    applyThemeOptions(renderItem, uid, theme);
    allCanvasConfigMap.set(uid, renderItem);
  } finally {
    if (previousAppearance) {
      for (const [key, value] of Object.entries(previousAppearance)) appearanceParameters[key].value = value;
    }
  }
}

function SelectIcon(iconSrc) {
  const uid = currentRenderUid.value;
  const theme = getTheme(uid2Src.get(uid).renderThemeIdx);
  return theme.selectIcon?.(iconSrc, getThemeOptions(uid, theme));
}

function SlideFactor(value) {
  const uid = currentRenderUid.value;
  const theme = getTheme(themeIdx.value);
  applyThemeAppearance(uid, theme);
  const renderItem = theme.slideFactor(value, getThemeOptions(uid, theme));
  applyThemeOptions(renderItem, uid, theme);
  allCanvasConfigMap.set(uid, renderItem);
}

export { PreviewRender, SelectIcon, SlideFactor };
