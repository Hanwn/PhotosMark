import { ref, reactive, computed, watchEffect } from "vue";
import { getInitData } from "@/utils/constInfo";
import { measureTextWidth } from "@/utils/textMetrics";

const previewStageConfig = reactive({
  width: 1200,
  height: 800,
  scaleX: 1,
  scaleY: 1,
});

const downloadStageConfig = reactive({
  width: 1,
  height: 1,
  visible: true,
});

const previewGroupConfig = reactive({
  scaleX: 1,
  scaleY: 1,
});

const mainImgConfig = reactive({
  image: null,
  draggable: false,
  name: "mainImg",
  x: 0,
  y: 0,
  scaleX: 1,
  scaleY: 1,
  cornerRadius: 0,
});

const iconGroupConfig = reactive({});

const bannerRectConfig = reactive({
  height: 0,
  width: 0,
  x: 0,
  y: 100,
  fill: "#ffffff",
  scaleX: 1,
  scaleY: 1,
  name: "bannerRect",
  draggable: false,
});

const backgroundRectConfig = reactive({
  height: 0,
  width: 0,
  x: 0,
  y: 0,
  fill: "#ffffff",
  scaleX: 1,
  scaleY: 1,
  visible: false,
  name: "backgroundRect",
  draggable: false,
});

function syncBannerWidthToFrame(withWhiteBorder) {
  bannerRectConfig.x = withWhiteBorder ? backgroundRectConfig.x : mainImgConfig.x;
  bannerRectConfig.width = withWhiteBorder
    ? backgroundRectConfig.width * backgroundRectConfig.scaleX
    : mainImgConfig.image?.width || bannerRectConfig.width;
}

const blurRectConfig = reactive({
  height: 0,
  width: 0,
  x: 0,
  y: 0,
  // fillEnabled: false,
  fill: "transparent",
  shadowBlur: 0,
  scaleX: 1,
  scaleY: 1,
  visible: true,
  cornerRadius: 0,
  name: "blurRectConfig",
  draggable: false,
});

const deviceInfoConfig = reactive({
  x: 100,
  y: 0,
  text: "",
  width: "auto",
  fontSize: 0,
  fontStyle: "bold",
  offsetY: 0,
  fill: "#000000",
  draggable: false,
  scaleX: 1,
  scaleY: 1,
  name: "deviceInfo",
  visible: true,
});
const lensInfoConfig = reactive({
  x: 100,
  y: 0,
  text: "",
  width: "auto",
  fontSize: 0,
  offsetY: 0,
  fontStyle: "normal",
  fill: "#808080",
  draggable: false,
  scaleX: 1,
  scaleY: 1,
  visible: true,
});
const iconInfoConfig = reactive({
  image: null,
  x: 0,
  y: 0,
  height: 0,
  width: 0,
  scaleX: 1,
  scaleY: 1,
  draggable: false,
  name: "iconInfo",
  visible: true,
});
const verticalBarInfoConfig = reactive({
  x: 0,
  y: 0,
  width: 13,
  height: 1,
  fill: "#808080",
  // Keep the separator thin on screen while giving it a usable drag target.
  hitFunc(context, shape) {
    context.beginPath();
    context.rect(-12, 0, shape.width() + 24, shape.height());
    context.closePath();
    context.fillStrokeShape(shape);
  },
  draggable: false,
  scaleX: 1,
  scaleY: 1,
  name: "verticalBarInfo",
  visible: true,
});

const parameterInfoConfig = reactive({
  x: 100,
  y: 0,
  text: "",
  width: "auto",
  rightAligned: false,
  centerAligned: false,
  offsetX: 0,
  fontSize: 0,
  fontStyle: "bold",
  offsetY: 0,
  verticalAlign: "middle",
  fill: "#000000",
  draggable: false,
  scaleX: 1,
  scaleY: 1,
  visible: true,
});
const timeInfoConfig = reactive({
  x: 100,
  y: 0,
  text: "",
  width: "auto",
  rightAligned: false,
  offsetX: 0,
  fontSize: 0,
  fontStyle: "normal",
  verticalAlign: "middle",
  offsetY: 0,
  fill: "#808080",
  draggable: false,
  scaleX: 1,
  scaleY: 1,
  visible: true,
});

function keepTextAnchorAligned(config) {
  watchEffect(() => {
    if (!config.rightAligned && !config.centerAligned) return;
    const width = measureTextWidth(config.text, config.fontSize, config.fontStyle, config.fontFamily);
    config.offsetX = config.centerAligned ? width / 2 : width;
  });
}
keepTextAnchorAligned(parameterInfoConfig);
keepTextAnchorAligned(timeInfoConfig);

const transformerConfig = reactive({
  rotateEnabled: false,
  keepRadio: true,
  enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"],
  anchorStyleFunc: (anchor) => {
    anchor.cornerRadius(10);
  },
});

const borderTransformerConfig = reactive({
  rotateEnabled: false,
  keepRadio: true,
  enabledAnchors: [],
});

const bannerTransformerConfig = reactive({
  rotateEnabled: false,
  keepRadio: false,
  enabledAnchors: ["bottom-center"],
  anchorStyleFunc: (anchor) => {
    anchor.height(6);
    anchor.offsetY(3);
    anchor.width(30);
    anchor.offsetX(15);
  },
});

const backgroundTransformerConfig = reactive({
  rotateEnabled: false,
  keepRadio: false,
  borderStroke: getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim() || "#71717a",
  borderStrokeWidth: 2,
  anchorStroke: getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim() || "#71717a",
  enabledAnchors: ["middle-left", "middle-right", "top-center"],
  anchorStyleFunc: (anchor) => {
    anchor.fill("#ffffff");
    anchor.stroke(getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim() || "#71717a");
    anchor.strokeWidth(1.5);
    anchor.cornerRadius(6);
    anchor.shadowColor("#18181b");
    anchor.shadowBlur(5);
    anchor.shadowOpacity(0.18);
    if (anchor.hasName("middle-left") || anchor.hasName("middle-right")) {
      const left = anchor.hasName("middle-left");
      anchor.height(28);
      anchor.offsetY(14);
      anchor.width(10);
      anchor.offsetX(left ? 0 : 10);
      anchor.hitFunc((context, shape) => {
        context.beginPath();
        context.rect(left ? 0 : -14, -8, 24, 44);
        context.closePath();
        context.fillStrokeShape(shape);
      });
    }
    if (anchor.hasName("top-center")) {
      anchor.height(10);
      anchor.offsetY(0);
      anchor.width(28);
      anchor.offsetX(14);
      anchor.hitFunc((context, shape) => {
        context.beginPath();
        context.rect(-8, 0, 44, 24);
        context.closePath();
        context.fillStrokeShape(shape);
      });
    }
  },
});

const alignLineOneThirdConfig = reactive({
  points: [0, 0, 0, 0],
  draggable: false,
  stroke: "#ef4444",
  strokeWidth: 3,
  dash: [10, 6],
  shadowColor: "#ffffff",
  shadowBlur: 4,
  lineCap: "round",
  name: "alignLineOneThird",
  visible: false,
  listening: false,
});

const alignLineMiddleConfig = reactive({
  points: [0, 0, 0, 0],
  draggable: false,
  stroke: "#ef4444",
  strokeWidth: 3,
  dash: [10, 6],
  shadowColor: "#ffffff",
  shadowBlur: 4,
  lineCap: "round",
  name: "alignLineMiddle",
  visible: false,
  listening: false,
});

const alignLineTwoThirdConfig = reactive({
  points: [0, 0, 0, 0],
  draggable: false,
  stroke: "#ef4444",
  strokeWidth: 3,
  dash: [10, 6],
  shadowColor: "#ffffff",
  shadowBlur: 4,
  lineCap: "round",
  name: "alignLineTwoThird",
  visible: false,
  listening: false,
});

const alignLineVerticalConfig = reactive({
  points: [0, 0, 0, 0],
  stroke: "#ef4444",
  strokeWidth: 3,
  dash: [10, 6],
  shadowColor: "#ffffff",
  shadowBlur: 4,
  lineCap: "round",
  visible: false,
  listening: false,
});

const equalGapLineConfigs = Array.from({ length: 4 }, () => reactive({
  points: [0, 0, 0, 0],
  stroke: "#ea580c",
  strokeWidth: 4,
  shadowColor: "#ffffff",
  shadowBlur: 5,
  lineCap: "round",
  visible: false,
  listening: false,
}));

const initData = getInitData();
const allCanvasConfigMap = new Map();
allCanvasConfigMap.set(0, initData);

const StageCenter = computed(() => {
  return {
    x: previewStageConfig.width / 2,
    y: previewStageConfig.height / 2,
  };
});

function defineCanvasConfig() {
  return {
    previewStageConfig,
    downloadStageConfig,
    previewGroupConfig,
    mainImgConfig,
    deviceInfoConfig,
    parameterInfoConfig,
    lensInfoConfig,
    timeInfoConfig,
    verticalBarInfoConfig,
    iconInfoConfig,
    bannerRectConfig,
    backgroundRectConfig,
    blurRectConfig,
    transformerConfig,
    borderTransformerConfig,
    bannerTransformerConfig,
    backgroundTransformerConfig,
    alignLineTwoThirdConfig,
    alignLineOneThirdConfig,
    alignLineMiddleConfig,
    alignLineVerticalConfig,
    equalGapLineConfigs,
    StageCenter,
  };
}

export { defineCanvasConfig, allCanvasConfigMap, syncBannerWidthToFrame };
