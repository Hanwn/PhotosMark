import 'element-plus/es/components/notification/style/css'
import {ElNotification} from "element-plus";




const notify = (title, notifyType) => {
    ElNotification({
        title: title,
        type:notifyType
    })
}


export {notify}
