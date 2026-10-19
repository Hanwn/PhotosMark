import { defineCanvasConfig, syncBannerWidthToFrame } from "@/store/defineCanvasConfig";
import { defineThemeParameter } from "@/store/defineThemes";

const canvas = defineCanvasConfig();
const parameters = defineThemeParameter();

const whiteBorder = {
  key: "whiteBoard",
  label: "白色边框",
  type: "switch",
  defaultValue: false,
  prepare(value) { parameters.whiteBoard.value = value; },
  apply(value) {
    parameters.whiteBoard.value = value;
    canvas.backgroundRectConfig.visible = value;
    syncBannerWidthToFrame(value);
  },
};

const roundedPhoto = {
  key: "radius",
  label: "照片圆角",
  type: "switch",
  defaultValue: false,
  prepare(value) { parameters.radius.value = value; },
  apply(value) {
    parameters.radius.value = value;
    canvas.mainImgConfig.cornerRadius = value ? 50 : 0;
    canvas.blurRectConfig.cornerRadius = value ? 50 : 0;
  },
};

const photoShadow = {
  key: "blurMode",
  label: "照片阴影",
  type: "switch",
  defaultValue: false,
  prepare(value) { parameters.blurMode.value = value; },
  apply(value) {
    parameters.blurMode.value = value;
    canvas.mainImgConfig.shadowBlur = value ? 100 : 0;
    canvas.blurRectConfig.shadowBlur = value ? 100 : 0;
  },
};

export { whiteBorder, roundedPhoto, photoShadow };
