import { ref } from "vue";

const themeIdx = ref(1);
const factor = ref(0);

const whiteBoard = ref(false);
const privacyMode = ref(true);
const radius = ref(false);

function defineThemeParameter() {
  return {
    whiteBoard,
    privacyMode,
    radius,
  };
}

export { defineThemeParameter, themeIdx, factor };
