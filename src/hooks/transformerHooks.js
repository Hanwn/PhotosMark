import { defineCanvasConfig, syncBannerWidthToFrame } from "@/store/defineCanvasConfig";
import { ref } from "vue";
import { factor } from "@/store/defineThemes";

const transformer = ref();
const borderTransformer = ref();
const bannerTransformer = ref();
const backgroundTransformer = ref();

const {
  mainImgConfig,
  iconInfoConfig,
  bannerRectConfig,
  backgroundRectConfig,
  equalGapLineConfigs,
} = defineCanvasConfig();

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

function transformerBannerEnd(e) {
  const node = e.target;
  const oldHeight = bannerRectConfig.height;
  const height = Math.max(1, node.height() * node.scaleY());
  node.scaleY(1);
  node.height(height);
  bannerRectConfig.height = height;
  backgroundRectConfig.height += height - oldHeight;
  factor.value = height / (mainImgConfig.image?.height || 1);
}

function transformerBackgroundRectHook(e) {
  const node = e.target;
  const anchor = backgroundTransformer.value.getNode().getActiveAnchor();
  const stage = node.getStage();
  const inverse = node.getParent().getAbsoluteTransform().copy().invert();
  const stageTopLeft = inverse.point({ x: 0, y: 0 });
  const stageBottomRight = inverse.point({ x: stage.width(), y: stage.height() });
  const minX = Math.min(stageTopLeft.x, stageBottomRight.x);
  const maxX = Math.max(stageTopLeft.x, stageBottomRight.x);
  const minY = Math.min(stageTopLeft.y, stageBottomRight.y);
  let left = node.x();
  let right = left + node.width() * node.scaleX();
  const bottom = node.y() + node.height() * node.scaleY();

  if (anchor === "middle-left" && left < minX) {
    left = minX;
    node.x(left);
    node.scaleX((right - left) / node.width());
  } else if (anchor === "middle-right" && right > maxX) {
    right = maxX;
    node.scaleX((right - left) / node.width());
  } else if (anchor === "top-center" && node.y() < minY) {
    node.y(minY);
    node.scaleY((bottom - minY) / node.height());
  }

  const photoLeft = mainImgConfig.x;
  const photoRight = photoLeft + (mainImgConfig.image?.width || bannerRectConfig.width);
  const leftMargin = photoLeft - left;
  const rightMargin = right - photoRight;
  const cssScale = stage.container().getBoundingClientRect().width / stage.width();
  const threshold = 9 / Math.max(0.01, node.getParent().getAbsoluteScale().x * cssScale);
  let equalSides = false;

  if (node.scaleX() > 0 && leftMargin >= 0 && rightMargin >= 0 &&
      Math.abs(leftMargin - rightMargin) <= threshold) {
    if (anchor === "middle-left") {
      const snappedLeft = photoLeft - rightMargin;
      node.x(snappedLeft);
      node.scaleX((right - snappedLeft) / node.width());
      equalSides = true;
    } else if (anchor === "middle-right") {
      const snappedRight = photoRight + leftMargin;
      node.scaleX((snappedRight - left) / node.width());
      equalSides = true;
    }
  }

  for (const line of equalGapLineConfigs) line.visible = equalSides;
  if (equalSides) {
    const outerLeft = node.x();
    const outerRight = outerLeft + node.width() * node.scaleX();
    const centerY = mainImgConfig.y + (mainImgConfig.image?.height || 0) / 2;
    const outerBottom = node.y() + node.height() * node.scaleY();
    equalGapLineConfigs[0].points = [outerLeft, centerY, photoLeft, centerY];
    equalGapLineConfigs[1].points = [photoRight, centerY, outerRight, centerY];
    equalGapLineConfigs[2].points = [outerLeft, node.y(), outerLeft, outerBottom];
    equalGapLineConfigs[3].points = [outerRight, node.y(), outerRight, outerBottom];
  }

  backgroundRectConfig.scaleY = node.scaleY();
  backgroundRectConfig.scaleX = node.scaleX();
  backgroundRectConfig.x = node.x();
  backgroundRectConfig.y = node.y();
  syncBannerWidthToFrame(true);
}

function transformerBackgroundRectEnd() {
  for (const line of equalGapLineConfigs) line.visible = false;
}

function defineTransformerHooks() {
  return {
    transformerIconInfoHook,
    transformerBackgroundRectHook,
    transformerBackgroundRectEnd,
    transformerBannerEnd,
    handleStageMouseDown,
    transformer,
    borderTransformer,
    bannerTransformer,
    backgroundTransformer,
  };
}

export { defineTransformerHooks };
