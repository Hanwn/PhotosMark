import {ref} from "vue";

const factor = ref(0.1)
function defineFactor() {
    return {factor}
}

export {defineFactor}