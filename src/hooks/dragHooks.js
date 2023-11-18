import { defineCanvasConfig } from "@/store/defineCanvasConfig";
import { defineRender } from "@/store/defineRender";

const { currentRenderUid, marshal, unMarshal } = defineRender();

const {
  previewStageConfig,
  mainImgConfig,
  deviceInfoConfig,
  parameterInfoConfig,
  lensInfoConfig,
  timeInfoConfig,
  verticalBarInfoConfig,
  iconInfoConfig,
  bannerRectConfig,
  alignLineMiddleConfig,
  alignLineOneThirdConfig,
  alignLineTwoThirdConfig,
} = defineCanvasConfig();

function dragEndVerticalBarHook(e) {
  for (let key in verticalBarInfoConfig) {
    verticalBarInfoConfig[key] = e.target.attrs[key];
  }
  if (alignLineMiddleConfig.visible) {
    const diff = verticalBarInfoConfig.height * 0.5;
    verticalBarInfoConfig.y = alignLineMiddleConfig.points[1] - diff;
    alignLineMiddleConfig.visible = false;
  }
}

function dragMoveVerticalBarHook(evt) {
  const x = evt.target.attrs.x;
  const y = evt.target.attrs.y;
  const centerX = verticalBarInfoConfig.width * 0.5 + x;
  const centerY = verticalBarInfoConfig.height * 0.5 + y;

  const middle = alignLineMiddleConfig.points[1];
  const oneThird = alignLineOneThirdConfig.points[1];
  const twoThird = alignLineTwoThirdConfig[1];
  const dist = 10;
  alignLineMiddleConfig.visible = Math.abs(middle - centerY) < dist;
}

function dragEndDeviceInfoHook(e) {
  for (let key in deviceInfoConfig) {
    deviceInfoConfig[key] = e.target.attrs[key];
  }
  if (alignLineMiddleConfig.visible) {
    deviceInfoConfig.y = alignLineMiddleConfig.points[1];
    alignLineMiddleConfig.visible = false;
  }
  if (alignLineTwoThirdConfig.visible) {
    deviceInfoConfig.y = alignLineTwoThirdConfig.points[1];
    alignLineTwoThirdConfig.visible = false;
  }
  if (alignLineOneThirdConfig.visible) {
    deviceInfoConfig.y = alignLineOneThirdConfig.points[1];
    alignLineOneThirdConfig.visible = false;
  }
}

function dragMoveDeviceInfoHook(evt) {
  const centerY = evt.target.attrs.y;
  dragMoveText(centerY);
}

function dragEndLensInfoHook(e) {
  for (let key in lensInfoConfig) {
    lensInfoConfig[key] = e.target.attrs[key];
  }
  if (alignLineMiddleConfig.visible) {
    lensInfoConfig.y = alignLineMiddleConfig.points[1];
    alignLineMiddleConfig.visible = false;
  }
  if (alignLineTwoThirdConfig.visible) {
    lensInfoConfig.y = alignLineTwoThirdConfig.points[1];
    alignLineTwoThirdConfig.visible = false;
  }
  if (alignLineOneThirdConfig.visible) {
    lensInfoConfig.y = alignLineOneThirdConfig.points[1];
    alignLineOneThirdConfig.visible = false;
  }
}

function dragMoveLensInfoHook(evt) {
  const centerY = evt.target.attrs.y;
  dragMoveText(centerY);
}

function dragEndTimeInfoHook(e) {
  for (let key in timeInfoConfig) {
    timeInfoConfig[key] = e.target.attrs[key];
  }
  if (alignLineMiddleConfig.visible) {
    timeInfoConfig.y = alignLineMiddleConfig.points[1];
    alignLineMiddleConfig.visible = false;
  }
  if (alignLineTwoThirdConfig.visible) {
    timeInfoConfig.y = alignLineTwoThirdConfig.points[1];
    alignLineTwoThirdConfig.visible = false;
  }
  if (alignLineOneThirdConfig.visible) {
    timeInfoConfig.y = alignLineOneThirdConfig.points[1];
    alignLineOneThirdConfig.visible = false;
  }
}

function dragMoveTimeInfoHook(evt) {
  const centerY = evt.target.attrs.y;
  dragMoveText(centerY);
}

function dragEndParameterInfoHook(e) {
  for (let key in parameterInfoConfig) {
    parameterInfoConfig[key] = e.target.attrs[key];
  }

  if (alignLineMiddleConfig.visible) {
    parameterInfoConfig.y = alignLineMiddleConfig.points[1];
    alignLineMiddleConfig.visible = false;
  }
  if (alignLineTwoThirdConfig.visible) {
    parameterInfoConfig.y = alignLineTwoThirdConfig.points[1];
    alignLineTwoThirdConfig.visible = false;
  }
  if (alignLineOneThirdConfig.visible) {
    parameterInfoConfig.y = alignLineOneThirdConfig.points[1];
    alignLineOneThirdConfig.visible = false;
  }
}

function dragMoveParameterInfoHook(evt) {
  const centerY = evt.target.attrs.y;
  dragMoveText(centerY);
}

function dragEndIconInfoHook(e) {
  for (let key in iconInfoConfig) {
    iconInfoConfig[key] = e.target.attrs[key];
  }
  if (alignLineMiddleConfig.visible) {
    const diff = iconInfoConfig.height * 0.5;
    iconInfoConfig.y = alignLineMiddleConfig.points[1] - diff;
    alignLineMiddleConfig.visible = false;
  }
}

function dragMoveIconInfoHook(evt) {
  const x = evt.target.attrs.x;
  const y = evt.target.attrs.y;
  const centerX = iconInfoConfig.width * 0.5 + x;
  const centerY = iconInfoConfig.height * 0.5 + y;

  const middle = alignLineMiddleConfig.points[1];
  const oneThird = alignLineOneThirdConfig.points[1];
  const twoThird = alignLineTwoThirdConfig[1];
  const dist = 20;
  alignLineMiddleConfig.visible = Math.abs(middle - centerY) < dist;
}

function dragMoveText(centerY) {
  const middle = alignLineMiddleConfig.points[1];
  const oneThird = alignLineOneThirdConfig.points[1];
  const twoThird = alignLineTwoThirdConfig.points[1];
  const dist = 20;
  alignLineMiddleConfig.visible = Math.abs(middle - centerY) < dist;
  alignLineOneThirdConfig.visible = Math.abs(oneThird - centerY) < dist;
  alignLineTwoThirdConfig.visible = Math.abs(twoThird - centerY) < dist;
}

function defineDragHooks() {
  return {
    dragEndTimeInfoHook,
    dragMoveTimeInfoHook,
    dragEndDeviceInfoHook,
    dragMoveDeviceInfoHook,
    dragEndParameterInfoHook,
    dragMoveParameterInfoHook,
    dragEndLensInfoHook,
    dragMoveLensInfoHook,
    dragEndVerticalBarHook,
    dragMoveVerticalBarHook,
    dragEndIconInfoHook,
    dragMoveIconInfoHook,
  };
}

export { defineDragHooks };
