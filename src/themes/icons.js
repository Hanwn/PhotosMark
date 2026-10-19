import { readSettings } from "@/store/defineSettings";
import { defineCanvasConfig } from "@/store/defineCanvasConfig";

const prefix = readSettings().value.iconPrefix;
const defaultIcons = [
  ["Nikon", "Nikon2.svg"],
  ["Nikon（简洁版）", "Nikon.svg"],
  ["Nikon（100 周年）", "Nikon100.svg"],
  ["Nikon（研究会）", "NikonResearch.svg"],
  ["Sony", "Sony.svg"],
  ["Fujifilm", "Fujifilm.svg"],
  ["DJI", "Dji.svg"],
  ["Hasselblad", "hasselblad.svg"],
  ["Leica", "leica.svg"],
  ["Olympus", "olympus.svg"],
  ["Panasonic", "panasonic.svg"],
  ["Zeiss", "zeiss.svg"],
  ["Carl Zeiss Jena", "carl-zeiss-jena.svg"],
].map(([label, filename]) => ({ label, src: prefix + filename }));

function fitLogo(image, maxWidth, maxHeight) {
  const ratio = image.width / image.height;
  const width = Math.min(maxWidth, maxHeight * ratio);
  return { width, height: width / ratio };
}

function scaleLogo(config, factor, anchor = "center") {
  if (!config || !Number.isFinite(factor) || factor <= 0) return;
  const rightX = config.x + config.width;
  const centerX = config.x + config.width / 2;
  const centerY = config.y + config.height / 2;
  config.width *= factor;
  config.height *= factor;
  config.x = anchor === "right" ? rightX - config.width : centerX - config.width / 2;
  config.y = centerY - config.height / 2;
}

function createIconSizeOption(anchor = "center") {
  return {
    key: "iconSize",
    section: "icon",
    label: "Logo 大小（%）",
    type: "number",
    min: 25,
    max: 250,
    step: 5,
    defaultValue: 100,
    apply(value, previousValue) {
      scaleLogo(defineCanvasConfig().iconInfoConfig, value / (previousValue ?? 100), anchor);
    },
    applyRender(renderItem, value) {
      scaleLogo(renderItem.iconInfoConfig, value / 100, anchor);
    },
  };
}

export { defaultIcons, fitLogo, createIconSizeOption };
