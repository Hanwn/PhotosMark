import {reactive, ref} from "vue";
import {getInitData} from "@/utils/constInfo";

const initData = getInitData()
const renderList = reactive([initData])
const renderIdx = ref(0)


function pushToRenderList(obj) {
    if (renderIdx.value === 0) {
        renderIdx.value = 1
    }
    renderList.push(obj)
}

function setRenderIdx(idx) {
    renderIdx.value = idx
}

function defineRender() {

    return {renderList,pushToRenderList, renderIdx, setRenderIdx}
}

export {defineRender}
