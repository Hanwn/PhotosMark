import {reactive, ref, render} from "vue";
import {getInitData} from "@/utils/constInfo";

const initData = getInitData()
const renderList = reactive([initData])
const renderIdx = ref(0)


function pushToRenderList(obj) {
    renderList.push(obj)
}

function setRenderIdx(idx) {
    renderIdx.value = idx
}

function setRenderListByRenderIdx(idx, obj)  {
    // renderList[idx].parameterInfoConfig.text = "Nikon z9"
    renderList[idx] = obj
}

function defineRender() {

    return {renderList,pushToRenderList, renderIdx, setRenderIdx, setRenderListByRenderIdx}
}

export {defineRender}
