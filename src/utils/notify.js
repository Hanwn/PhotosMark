import {ElNotification} from "element-plus";

const notify = (title) => {
    ElNotification({
        title: title,
        position: 'bottom-right',
    })
}


export {notify}
