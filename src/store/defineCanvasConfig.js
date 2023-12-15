import { ref, reactive, computed, watchEffect } from "vue";
import { getInitData } from "@/utils/constInfo";

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
  x: 0,
  y: 0,
  scaleX: 1,
  scaleY: 1,
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
});

const deviceInfoConfig = reactive({
  x: 100,
  y: 0,
  text: "",
  fontSize: 0,
  fontStyle: "bold",
  offsetY: 0,
  fill: "#000000",
  draggable: true,
  scaleX: 1,
  scaleY: 1,
  name: "deviceInfo",
  visible: true,
});
const lensInfoConfig = reactive({
  x: 100,
  y: 0,
  text: "",
  fontSize: 0,
  offsetY: 0,
  fontStyle: "normal",
  fill: "#808080",
  draggable: true,
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
  draggable: true,
  name: "iconInfo",
  visible: true,
});
const verticalBarInfoConfig = reactive({
  x: 0,
  y: 0,
  width: 5,
  height: 1,
  fill: "#808080",
  draggable: true,
  scaleX: 1,
  scaleY: 1,
  name: "verticalBarInfo",
  visible: true,
});

const parameterInfoConfig = reactive({
  x: 100,
  y: 0,
  text: "",
  fontSize: 0,
  fontStyle: "bold",
  offsetY: 0,
  verticalAlign: "middle",
  fill: "#000000",
  draggable: true,
  scaleX: 1,
  scaleY: 1,
  visible: true,
});
const timeInfoConfig = reactive({
  x: 100,
  y: 0,
  text: "",
  fontSize: 0,
  fontStyle: "normal",
  verticalAlign: "middle",
  offsetY: 0,
  fill: "#808080",
  draggable: true,
  scaleX: 1,
  scaleY: 1,
  visible: true,
});

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

const alignLineOneThirdConfig = reactive({
  points: [0, 0, 0, 0],
  draggable: true,
  stroke: "black",
  dash: [33, 10],
  name: "alignLineOneThird",
  visible: false,
});

const alignLineMiddleConfig = reactive({
  points: [0, 0, 0, 0],
  draggable: true,
  stroke: "black",
  dash: [33, 10],
  name: "alignLineMiddle",
  visible: false,
});

const alignLineTwoThirdConfig = reactive({
  points: [0, 0, 0, 0],
  draggable: true,
  stroke: "black",
  dash: [33, 10],
  name: "alignLineTwoThird",
  visible: false,
});

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
    transformerConfig,
    borderTransformerConfig,
    alignLineTwoThirdConfig,
    alignLineOneThirdConfig,
    alignLineMiddleConfig,
    StageCenter,
  };
}

export { defineCanvasConfig, allCanvasConfigMap };
