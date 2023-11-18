import { ref, reactive, watchEffect } from "vue";
import { getInitData } from "@/utils/constInfo";

const previewStageConfig = reactive({
  width: 800,
  height: 600,
  scaleX: 1,
  scaleY: 1,
});

const downloadStageConfig = reactive({
  width: 100,
  height: 200,
  visible: true,
});

const mainImgConfig = reactive({
  image: null,
  scaleX: 1,
  scaleY: 1,
});

const iconGroupConfig = reactive({});

const bannerRectConfig = reactive({
  height: 100,
  width: 100,
  y: 100,
  fill: "#ffffff",
  scaleX: 1,
  scaleY: 1,
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
});
const lensInfoConfig = reactive({
  x: 100,
  y: 0,
  text: "",
  fontSize: 0,
  offsetY: 0,
  fontStyle: "normal",
  align: "center",
  fill: "#808080",
  draggable: true,
  scaleX: 1,
  scaleY: 1,
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
});

const parameterInfoConfig = reactive({
  x: 100,
  y: 0,
  text: "",
  fontSize: 0,
  fontStyle: "bold",
  align: "center",
  offsetY: 0,
  verticalAlign: "middle",
  fill: "#000000",
  draggable: true,
  scaleX: 1,
  scaleY: 1,
});
const timeInfoConfig = reactive({
  x: 100,
  y: 0,
  text: "",
  fontSize: 0,
  fontStyle: "normal",
  align: "center",
  verticalAlign: "middle",
  offsetY: 0,
  fill: "#808080",
  draggable: true,
  scaleX: 1,
  scaleY: 1,
});

const transformerConfig = reactive({
  rotateEnabled: false,
  keepRadio: true,
  enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"],
  anchorStyleFunc: (anchor) => {
    anchor.cornerRadius(10);
  },
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

function defineCanvasConfig() {
  return {
    previewStageConfig,
    downloadStageConfig,
    mainImgConfig,
    deviceInfoConfig,
    parameterInfoConfig,
    lensInfoConfig,
    timeInfoConfig,
    verticalBarInfoConfig,
    iconInfoConfig,
    bannerRectConfig,
    transformerConfig,
    alignLineTwoThirdConfig,
    alignLineOneThirdConfig,
    alignLineMiddleConfig,
  };
}

export { defineCanvasConfig, allCanvasConfigMap };
