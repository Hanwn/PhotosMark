import { ref, reactive, computed, watch } from "vue";
import { defineRender } from "@/store/defineRender";

const imgSrcList = ref([]);
/*
 * iconCache : {uid: iconImg}
 * */
const iconCache = reactive(new Map());
/*
 * uid2Src {
 *  name: name,
 *  src: src,
 *  raw: raw,
 *  renderThemeIdx: 1,
 *  renderFactor: 0.125,
 *  img: null,
 *  exif: exifData,
 * }
 * */
const uid2Src = reactive(new Map());

function pushToIconCache(src, iconImg) {
  iconCache.set(src, iconImg);
}

function defineImgList() {
  return {
    imgSrcList,
  };
}

function defineIcon() {
  return {
    iconCache,
  };
}

export { defineImgList, pushToIconCache, defineIcon, uid2Src };
