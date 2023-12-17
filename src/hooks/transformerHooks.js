import { defineCanvasConfig } from "@/store/defineCanvasConfig";
import { defineRender } from "@/store/defineRender";
import { ref } from "vue";
import { SlideFactor } from "@/themes/renderReouter";
import { factor } from "@/store/defineThemes";
import { uid2Src } from "@/store/defineImg";

const { currentRenderUid, marshal } = defineRender();
const transformer = ref();
const borderTransformer = ref();
const bannerTransformer = ref();
const backgroundTransformer = ref();

const {
  mainImgConfig,
  iconInfoConfig,
  bannerRectConfig,
  backgroundRectConfig,
} = defineCanvasConfig();
const { unMarshal } = defineRender();

function transformerIconInfoHook(e) {
  for (let key in iconInfoConfig) {
    iconInfoConfig[key] = e.target.attrs[key];
  }
  iconInfoConfig.scaleX = 1;
  iconInfoConfig.scaleY = 1;
  const transHeight = iconInfoConfig.height * e.target.attrs.scaleY;
  const transWidth = iconInfoConfig.width * e.target.attrs.scaleX;
  iconInfoConfig.height = transHeight;
  iconInfoConfig.width = transWidth;
}

function handleStageMouseDown(e) {
  const selectName = new Map([["iconInfo", ""]]);

  const bannerName = "bannerRect";
  const backgroundRectName = "backgroundRect";

  const showBoard = new Map([
    ["timeInfo", ""],
    ["deviceInfo", ""],
    ["lensInfo", ""],
    ["parameterInfo", ""],
  ]);

  const name = e.target.name();
  const transformerNode = transformer.value.getNode();
  const borderTransformerNode = borderTransformer.value.getNode();
  const bannerTransformerNode = bannerTransformer.value.getNode();
  const backgroundTransformerNode = backgroundTransformer.value.getNode();
  if (name.length === 0) {
    transformerNode.nodes([]);
    borderTransformerNode.nodes([]);
    bannerTransformerNode.nodes([]);
    backgroundTransformerNode.nodes([]);
    return;
  }

  if (selectName.has(name)) {
    borderTransformerNode.nodes([]);
    bannerTransformerNode.nodes([]);
    backgroundTransformerNode.nodes([]);
    const stage = transformerNode.getStage();
    const selectNode = stage.findOne("." + name);
    transformerNode.nodes([selectNode]);
    return;
  }

  if (showBoard.has(name)) {
    transformerNode.nodes([]);
    bannerTransformerNode.nodes([]);
    backgroundTransformerNode.nodes([]);
    const stage = borderTransformerNode.getStage();
    const selectNode = stage.findOne("." + name);
    borderTransformerNode.nodes([selectNode]);
  }

  if (name === bannerName) {
    transformerNode.nodes([]);
    borderTransformerNode.nodes([]);
    backgroundTransformerNode.nodes([]);
    const stage = bannerTransformerNode.getStage();
    const selectNode = stage.findOne("." + name);
    bannerTransformerNode.nodes([selectNode]);
  }
  if (name === backgroundRectName) {
    transformerNode.nodes([]);
    bannerTransformerNode.nodes([]);
    borderTransformerNode.nodes([]);
    const stage = borderTransformerNode.getStage();
    const selectNode = stage.findOne("." + name);
    backgroundTransformerNode.nodes([selectNode]);
  }
}

function transformerBannerHook(e) {
  const scaleY = e.target.attrs.scaleY;
  const bannerHeight = bannerRectConfig.height;
  const uid = currentRenderUid.value;
  const imgH = uid2Src.get(uid).img.height;
  bannerRectConfig.height = bannerHeight * scaleY;
  backgroundRectConfig.height =
    backgroundRectConfig.height - bannerHeight + bannerRectConfig.height;
  factor.value = bannerRectConfig.height / imgH;
}

function transformerBannerEnd() {
  const uid = currentRenderUid.value;
  SlideFactor(factor.value);
  unMarshal(uid);
}

function transformerBackgroundRectHook(e) {
  backgroundRectConfig.scaleY = e.target.attrs.scaleY;
  backgroundRectConfig.scaleX = e.target.attrs.scaleX;

  backgroundRectConfig.x = e.target.attrs.x;
  backgroundRectConfig.y = e.target.attrs.y;
}

function transformerBackgroundRectEnd() {}

function defineTransformerHooks() {
  return {
    transformerIconInfoHook,
    transformerBackgroundRectHook,
    transformerBackgroundRectEnd,
    transformerBannerHook,
    transformerBannerEnd,
    handleStageMouseDown,
    transformer,
    borderTransformer,
    bannerTransformer,
    backgroundTransformer,
  };
}

export { defineTransformerHooks };
