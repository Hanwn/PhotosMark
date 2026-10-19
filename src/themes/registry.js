import { uid2Src } from "@/store/defineImg";
import { defineThemeParameter } from "@/store/defineThemes";

const appearanceParameters = defineThemeParameter();
const themeModules = import.meta.glob("./*/theme.js", { eager: true });
const themes = Object.values(themeModules)
  .map((module) => module.default)
  .sort((first, second) => first.order - second.order);

function getTheme(id) {
  return themes.find((theme) => theme.id === id) || themes[0];
}

function getThemeOptions(uid, theme) {
  const file = uid2Src.get(uid);
  if (!file) return null;
  file.themeOptions ??= {};
  file.themeOptions[theme.id] ??= Object.fromEntries(
    [...(theme.appearance || []), ...(theme.options || [])].map((option) => [option.key, option.defaultValue]),
  );
  return file.themeOptions[theme.id];
}

function applyThemeAppearance(uid, theme) {
  const values = getThemeOptions(uid, theme);
  for (const key of ["whiteBoard", "radius", "blurMode"]) {
    appearanceParameters[key].value = false;
  }
  for (const option of [...(theme.appearance || []), ...(theme.options || [])]) {
    option.prepare?.(values?.[option.key] ?? option.defaultValue);
  }
}

function applyThemeOptions(renderItem, uid, theme) {
  const values = getThemeOptions(uid, theme);
  if (!values) return;
  for (const option of [...(theme.appearance || []), ...(theme.options || [])]) {
    const value = values[option.key];
    if (value == null) continue;
    if (option.target && renderItem[option.target]) {
      renderItem[option.target][option.property] = value;
    }
    option.applyRender?.(renderItem, value);
  }
}

export { themes, getTheme, getThemeOptions, applyThemeAppearance, applyThemeOptions };
