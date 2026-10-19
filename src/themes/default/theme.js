import { whiteBorder, roundedPhoto } from "@/themes/appearance";
import { defaultIcons, createIconSizeOption } from "@/themes/icons";
import { PreviewRenderDefault, SelectIconForDefault, SlideFactorForDefault } from "./default";

export default {
  id: 2,
  order: 2,
  name: "简约",
  render: PreviewRenderDefault,
  selectIcon: SelectIconForDefault,
  slideFactor: SlideFactorForDefault,
  fields: [
    { key: "parameterInfoConfig", label: "拍摄参数", placeholder: "例如 35mm · f/2.8 · 1/250s" },
  ],
  iconPicker: true,
  icons: defaultIcons,
  appearance: [whiteBorder, roundedPhoto],
  options: [
    createIconSizeOption(),
    { key: "showIcon", section: "icon", label: "显示相机图标", type: "switch", target: "iconInfoConfig", property: "visible", defaultValue: true },
  ],
};
