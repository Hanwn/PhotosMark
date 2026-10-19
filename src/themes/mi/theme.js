import { whiteBorder, roundedPhoto, photoShadow } from "@/themes/appearance";
import { defaultIcons, createIconSizeOption } from "@/themes/icons";
import { PreviewRenderMi, SelectIconForMiTheme, SlideFactorMi } from "./mi";

export default {
  id: 1,
  order: 1,
  name: "经典",
  render: PreviewRenderMi,
  selectIcon: SelectIconForMiTheme,
  slideFactor: SlideFactorMi,
  fields: [
    { key: "deviceInfoConfig", label: "相机型号", placeholder: "例如 Sony A7 IV" },
    { key: "lensInfoConfig", label: "镜头", placeholder: "例如 FE 24-70mm F2.8" },
    { key: "parameterInfoConfig", label: "拍摄参数", placeholder: "例如 35mm · f/2.8 · 1/250s" },
    { key: "timeInfoConfig", label: "拍摄时间", placeholder: "例如 2026-10-18" },
  ],
  iconPicker: true,
  icons: defaultIcons,
  appearance: [whiteBorder, roundedPhoto, photoShadow],
  options: [
    createIconSizeOption("right"),
    { key: "showTime", label: "显示拍摄时间", type: "switch", target: "timeInfoConfig", property: "visible", defaultValue: true },
    { key: "verticalWidth", label: "分割符宽度", type: "number", min: 1, step: 1, target: "verticalBarInfoConfig", property: "width", defaultValue: 13 },
    { key: "verticalHeight", label: "分割符高度", type: "number", min: 1, step: 1, target: "verticalBarInfoConfig", property: "height", defaultValue: null },
  ],
};
