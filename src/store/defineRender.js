import {reactive, ref, render, watch} from "vue";
import {getInitData} from "@/utils/constInfo";

const initData = getInitData()
const renderCache = reactive(new Map)
renderCache.set(0, initData)
const currentRenderUid = ref(0)


function defineRender() {
    return {renderCache, currentRenderUid}
}

export {defineRender}
