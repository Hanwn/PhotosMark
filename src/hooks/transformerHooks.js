import { defineCanvasConfig } from "@/store/defineCanvasConfig";
import { defineRender } from "@/store/defineRender";
import { ref } from "vue";
const { currentRenderUid, marshal } = defineRender();
const transformer = ref();

const {
  deviceInfoConfig,
  parameterInfoConfig,
  lensInfoConfig,
  timeInfoConfig,
  verticalBarInfoConfig,
  iconInfoConfig,
} = defineCanvasConfig();

function transformerVerticalBarHook(e) {
  const transHeight = verticalBarInfoConfig.height * e.target.attrs.scaleY;
  const transWidth = verticalBarInfoConfig.width * e.target.attrs.scaleX;
  verticalBarInfoConfig.height = transHeight;
  verticalBarInfoConfig.width = transWidth;
}
function transformerDeviceInfoHook(e) {
  for (let key in deviceInfoConfig) {
    deviceInfoConfig[key] = e.target.attrs[key];
  }
}

function transformerLensInfoHook(e) {
  for (let key in lensInfoConfig) {
    lensInfoConfig[key] = e.target.attrs[key];
  }
}

function transformerTimeInfoHook(e) {
  for (let key in timeInfoConfig) {
    timeInfoConfig[key] = e.target.attrs[key];
  }
}
function transformerParameterInfoHook(e) {
  for (let key in parameterInfoConfig) {
    parameterInfoConfig[key] = e.target.attrs[key];
  }
}

function transformerIconInfoHook(e) {
  const transHeight = iconInfoConfig.height * e.target.attrs.scaleY;
  const transWidth = iconInfoConfig.width * e.target.attrs.scaleX;
  iconInfoConfig.height = transHeight;
  iconInfoConfig.width = transWidth;
}

function handleStageMouseDown(e) {
  const selectName = new Map([
    ["timeInfo", ""],
    ["deviceInfo", ""],
    ["lensInfo", ""],
    ["parameterInfo", ""],
    ["iconInfo", ""],
  ]);

  const name = e.target.name();
  const transformerNode = transformer.value.getNode();
  if (name.length === 0) {
    transformerNode.nodes([]);
    return;
  }
  if (selectName.has(name)) {
    const stage = transformerNode.getStage();
    const selectNode = stage.findOne("." + name);
    transformerNode.nodes([selectNode]);
  }
}

function defineTransformerHooks() {
  return {
    transformerTimeInfoHook,
    transformerDeviceInfoHook,
    transformerParameterInfoHook,
    transformerLensInfoHook,
    transformerVerticalBarHook,
    transformerIconInfoHook,
    handleStageMouseDown,
    transformer,
  };
}

export { defineTransformerHooks };
