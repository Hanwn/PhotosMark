import "element-plus/es/components/notification/style/css";
import "element-plus/es/components/message/style/css";
import { ElMessage, ElNotification } from "element-plus";

const downloadStatusNotify = (title, notifyType) => {
  ElNotification({
    title: title,
    type: notifyType,
  });
};

const requestNotifyStatus = (msg, notifyType) => {
  ElMessage({
    message: msg,
    type: notifyType,
  });
};

export { downloadStatusNotify, requestNotifyStatus };
