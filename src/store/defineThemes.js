import { ref } from "vue";

const themeIdx = ref(1);
const factor = ref(0);

const whiteBoard = ref(false);
const privacyMode = ref(true);
const radius = ref(false);
const blurMode = ref(false);

function defineThemeParameter() {
  return {
    whiteBoard,
    privacyMode,
    radius,
    blurMode,
  };
}

export { defineThemeParameter, themeIdx, factor };
