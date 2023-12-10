import { ref } from "vue";

const themeIdx = ref(1);
const factor = ref(0);

const whiteBoard = ref(false);
const privacyMode = ref(true);

function defineThemeParameter() {
  return {
    whiteBoard,
    privacyMode,
  };
}

export { defineThemeParameter, themeIdx, factor };
